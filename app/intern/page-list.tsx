'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job, Intern } from '@/lib/types';
import Button from '@/components/Button';

const WORK_TYPE_LABEL = { online: '线上', offline: '线下', hybrid: '混合办公' };

function JobCard({ job }: { job: Job }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-200">
      {/* 收起状态：一行摘要 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="btn w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors duration-150"
      >
        {/* 公司首字母 */}
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 text-sm font-semibold shrink-0">
          {job.companyName.charAt(0)}
        </div>

        {/* 职位信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-gray-900">{job.title}</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full shrink-0 ${
              job.employmentType === 'intern' ? 'bg-gray-100 text-gray-600' : 'bg-gray-900 text-white'
            }`}>
              {job.employmentType === 'intern' ? '实习' : '全职'}
            </span>
            {job.cohort && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full shrink-0 bg-blue-50 text-blue-600">
                {job.cohort}届
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{job.companyName}</span>
            <span>·</span>
            <span>{job.baseLocation}</span>
            <span>·</span>
            <span>{WORK_TYPE_LABEL[job.workType]}</span>
          </div>
        </div>

        {/* 展开箭头 */}
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 展开详情 */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 animate-[fade-in_0.2s_ease-out]">
          <div className="pt-4 space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">职位描述</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">任职要求</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="bg-gray-900 rounded-xl px-4 py-3">
                <div className="text-xs text-gray-400 mb-1">联系方式</div>
                <div className="text-sm font-semibold text-white">{job.contact}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InternPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showSubmitCard, setShowSubmitCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [search, setSearch] = useState('');
  const [filterEmployment, setFilterEmployment] = useState<'all' | 'intern' | 'full-time'>('all');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [currentIntern, setCurrentIntern] = useState<Intern | null>(null);
  const [checkingIntern, setCheckingIntern] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileViews, setProfileViews] = useState<{ id: string; viewerName: string; viewedAt: string }[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [cardForm, setCardForm] = useState({
    name: '',
    education: '',
    position: '',
    internshipPeriod: '',
    contact: '',
    startDate: '',
    baseLocation: '',
    workType: 'hybrid' as 'online' | 'offline' | 'hybrid',
    employmentType: 'intern' as 'intern' | 'full-time' | 'both'
  });

  useEffect(() => {
    fetchJobs();
    checkExistingIntern();
  }, []);

  const checkExistingIntern = async () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      setCheckingIntern(false);
      return;
    }
    try {
      const response = await fetch(`/api/interns/by-username?username=${encodeURIComponent(username)}`);
      const intern: Intern | null = await response.json();
      if (intern) {
        setCurrentIntern(intern);
        setIsEditMode(true);
        setCardForm({
          name: intern.name,
          education: intern.education,
          position: intern.position,
          internshipPeriod: intern.internshipPeriod,
          contact: intern.contact,
          startDate: intern.startDate,
          baseLocation: intern.baseLocation,
          workType: intern.workType,
          employmentType: intern.employmentType
        });
        if (intern.resumeUrl) setResumeUrl(intern.resumeUrl);
        // 加载查看记录
        fetchProfileViews(intern.id);
      }
    } catch (error) {
      console.error('Failed to check intern:', error);
    } finally {
      setCheckingIntern(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileViews = async (internId: string) => {
    try {
      const response = await fetch(`/api/profile-views?internId=${internId}`);
      const views = await response.json();
      setProfileViews(views);
      // 未读数：上次查看通知时间之后的记录
      const lastRead = localStorage.getItem('notificationsLastRead') || '1970-01-01';
      const unread = views.filter((v: { viewedAt: string }) => new Date(v.viewedAt) > new Date(lastRead)).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch profile views:', error);
    }
  };

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setUnreadCount(0);
    localStorage.setItem('notificationsLastRead', new Date().toISOString());
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('只支持 PDF 文件');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('文件大小不能超过 5MB');
      return;
    }

    setUploadError('');
    setResumeFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload/resume', { method: 'POST', body: formData });
      const data = await response.json();
      if (response.ok) {
        setResumeUrl(data.resumeUrl);
      } else {
        setUploadError(data.error || '上传失败，请重试');
        setResumeFile(null);
      }
    } catch {
      setUploadError('上传失败，请重试');
      setResumeFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const username = sessionStorage.getItem('username');
    if (!username) {
      alert('登录信息丢失，请重新登录');
      router.push('/');
      return;
    }

    try {
      if (isEditMode && currentIntern) {
        const response = await fetch(`/api/interns/${currentIntern.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...cardForm, resumeUrl: resumeUrl || undefined })
        });
        if (response.ok) {
          alert('名片卡更新成功！');
          setShowSubmitCard(false);
        } else {
          alert('更新失败，请重试');
        }
      } else {
        const response = await fetch('/api/interns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...cardForm, username, resumeUrl: resumeUrl || undefined })
        });
        if (response.ok) {
          const newIntern = await response.json();
          setCurrentIntern(newIntern);
          setIsEditMode(true);
          alert('名片卡提交成功！');
          setShowSubmitCard(false);
        } else {
          alert('提交失败，请重试');
        }
      }
    } catch (error) {
      console.error('Failed to submit card:', error);
      alert('操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-900 hover:border-gray-300";

  if (checkingIntern) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-8 w-8 object-contain" />
            <span className="text-xl font-semibold text-gray-900">Pluslink</span>
          </Link>
          <div className="flex items-center gap-3">
            {currentIntern && (
              <button
                onClick={handleOpenNotifications}
                className="btn relative w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">实习生端</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-6 flex items-center justify-between animate-[fade-in_0.4s_ease-out]">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {showSubmitCard ? (isEditMode ? '编辑名片卡' : '提交名片卡') : '招聘职位'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {showSubmitCard
                ? (isEditMode ? '修改个人信息，让企业发现你' : '填写个人信息，让企业发现你')
                : `${jobs.filter(j => {
                    const matchSearch = !search || j.title.includes(search) || j.companyName.includes(search) || j.baseLocation.includes(search);
                    const matchEmployment = filterEmployment === 'all' || j.employmentType === filterEmployment;
                    return matchSearch && matchEmployment;
                  }).length} / ${jobs.length} 个职位机会`}
            </p>
          </div>
          <Button onClick={() => setShowSubmitCard(!showSubmitCard)}>
            {showSubmitCard ? '返回查看' : (isEditMode ? '编辑名片卡' : '提交名片卡')}
          </Button>
        </div>

        {showSubmitCard ? (
          <div className="max-w-2xl animate-[fade-in_0.3s_ease-out]">
            <form onSubmit={handleSubmitCard} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">姓名 <span className="text-red-500">*</span></label>
                <input type="text" required value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  className={inputClass} placeholder="请输入您的姓名" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">学历 <span className="text-red-500">*</span></label>
                <input type="text" required value={cardForm.education}
                  onChange={(e) => setCardForm({ ...cardForm, education: e.target.value })}
                  className={inputClass} placeholder="例如：北京大学 计算机科学 本科" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">奇绩实习岗位 <span className="text-red-500">*</span></label>
                <input type="text" required value={cardForm.position}
                  onChange={(e) => setCardForm({ ...cardForm, position: e.target.value })}
                  className={inputClass} placeholder="例如：前端开发实习生" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  实习时间
                  <span className="ml-1.5 text-xs font-normal text-gray-400">选填</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">开始时间</label>
                    <input
                      type="month"
                      value={cardForm.internshipPeriod.split(' - ')[0] || ''}
                      onChange={(e) => {
                        const end = cardForm.internshipPeriod.split(' - ')[1] || '';
                        setCardForm({ ...cardForm, internshipPeriod: `${e.target.value}${end ? ' - ' + end : ''}` });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">结束时间</label>
                    <input
                      type="month"
                      value={cardForm.internshipPeriod.split(' - ')[1] || ''}
                      onChange={(e) => {
                        const start = cardForm.internshipPeriod.split(' - ')[0] || '';
                        setCardForm({ ...cardForm, internshipPeriod: `${start} - ${e.target.value}` });
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">可入职时间 <span className="text-red-500">*</span></label>
                <input type="text" required value={cardForm.startDate}
                  onChange={(e) => setCardForm({ ...cardForm, startDate: e.target.value })}
                  className={inputClass} placeholder="例如：随时、1个月后、2026年4月" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Base地点 <span className="text-red-500">*</span></label>
                <input type="text" required value={cardForm.baseLocation}
                  onChange={(e) => setCardForm({ ...cardForm, baseLocation: e.target.value })}
                  className={inputClass} placeholder="例如：北京、上海、深圳" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">工作方式 <span className="text-red-500">*</span></label>
                  <select required value={cardForm.workType}
                    onChange={(e) => setCardForm({ ...cardForm, workType: e.target.value as 'online' | 'offline' | 'hybrid' })}
                    className={inputClass}>
                    <option value="hybrid">混合办公</option>
                    <option value="online">线上</option>
                    <option value="offline">线下</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">期望职位类型 <span className="text-red-500">*</span></label>
                  <select required value={cardForm.employmentType}
                    onChange={(e) => setCardForm({ ...cardForm, employmentType: e.target.value as 'intern' | 'full-time' | 'both' })}
                    className={inputClass}>
                    <option value="intern">实习</option>
                    <option value="full-time">全职</option>
                    <option value="both">实习或全职都可以</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">联系方式 <span className="text-red-500">*</span></label>
                <input type="text" required value={cardForm.contact}
                  onChange={(e) => setCardForm({ ...cardForm, contact: e.target.value })}
                  className={inputClass} placeholder="手机号或微信" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  上传简历
                  <span className="ml-1.5 text-xs font-normal text-gray-400">PDF · 最大 5MB · 选填</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {!resumeFile && !resumeUrl ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn w-full px-4 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center gap-2"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
                    </svg>
                    <span className="text-sm text-gray-500">点击选择 PDF 文件</span>
                  </button>
                ) : (
                  <div className={`flex items-center gap-3 px-4 py-3 border rounded-xl transition-all duration-200 ${
                    uploading ? 'border-gray-200 bg-gray-50' : uploadError ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                  }`}>
                    <svg className={`w-5 h-5 shrink-0 ${uploading ? 'text-gray-400' : uploadError ? 'text-red-500' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 flex-1 truncate">{resumeFile?.name || '已上传的简历'}</span>
                    {uploading ? (
                      <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin shrink-0" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setResumeFile(null); setResumeUrl(''); setUploadError(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        className="btn w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors shrink-0"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                {uploadError && (
                  <p className="text-xs text-red-500 animate-[fade-in_0.2s_ease-out]">{uploadError}</p>
                )}
              </div>
              <Button type="submit" loading={submitting} className="w-full">
                {submitting ? (isEditMode ? '保存中' : '提交中') : (isEditMode ? '保存修改' : '提交名片卡')}
              </Button>
            </form>
          </div>
        ) : (
          <div className="animate-[fade-in_0.4s_ease-out]">
            {/* 搜索 + 筛选栏 */}
            {!loading && jobs.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="relative flex-1 min-w-64">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索职位、公司、城市..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-900"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">职位类型</span>
                  {[
                    { value: 'all' as const, label: '全部' },
                    { value: 'intern' as const, label: '实习' },
                    { value: 'full-time' as const, label: '全职' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setFilterEmployment(value)}
                      className={`btn px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150 ${
                        filterEmployment === value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <span className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-sm text-gray-500">暂无招聘职位</p>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs
                  .filter(j => {
                    const matchSearch = !search || j.title.includes(search) || j.companyName.includes(search) || j.baseLocation.includes(search);
                    const matchEmployment = filterEmployment === 'all' || j.employmentType === filterEmployment;
                    return matchSearch && matchEmployment;
                  })
                  .map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 通知弹窗 */}
      {showNotifications && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="bg-white w-full max-w-md max-h-[80vh] overflow-hidden rounded-2xl shadow-xl animate-[modal-in_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">查看通知</h2>
              <button
                onClick={() => setShowNotifications(false)}
                className="btn w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {profileViews.length === 0 ? (
                <div className="py-16 text-center">
                  <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-sm text-gray-500">暂无查看记录</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {profileViews.map((view) => (
                    <div key={view.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-semibold">
                          {view.viewerName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{view.viewerName}</p>
                          <p className="text-xs text-gray-500">查看了你的档案</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">
                          {new Date(view.viewedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
