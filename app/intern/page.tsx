'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job, Intern } from '@/lib/types';
import Button from '@/components/Button';

const WORK_TYPE_LABEL = { online: '线上', offline: '线下', hybrid: '混合' };
const EMPLOYMENT_TYPE_LABEL = { intern: '实习', 'full-time': '全职', both: '实习/全职' };

function JobCardSimple({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 hover:shadow-sm transition-all duration-150 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-medium text-gray-500 mb-0.5">{job.companyName}{job.cohort ? ` · ${job.cohort}届` : ''}</div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] rounded">{EMPLOYMENT_TYPE_LABEL[job.employmentType]}</span>
        <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] rounded">{WORK_TYPE_LABEL[job.workType]}</span>
        <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] rounded">{job.baseLocation}</span>
      </div>
    </div>
  );
}

function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden animate-[modal-in_0.25s_ease-out]" onClick={e => e.stopPropagation()}>
        <div className="bg-gray-900 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-400 text-sm mb-1">{job.companyName} {job.cohort ? `· ${job.cohort}届` : ''}</div>
              <h2 className="text-2xl font-bold text-white">{job.title}</h2>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-2.5 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">{EMPLOYMENT_TYPE_LABEL[job.employmentType]}</span>
                <span className="px-2.5 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">{WORK_TYPE_LABEL[job.workType]}</span>
                <span className="px-2.5 py-1 bg-white/10 text-white text-xs font-medium rounded-lg">{job.baseLocation}</span>
              </div>
            </div>
            <button onClick={onClose} className="btn w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-8 py-6 space-y-6">
          {job.description && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">职位描述</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">{job.description}</p>
            </div>
          )}
          {job.requirements && job.requirements !== job.description && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">任职要求</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">{job.requirements}</p>
            </div>
          )}
            {job.website && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">公司网址</h3>
              <a href={job.website.startsWith('http') ? job.website : `https://${job.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">{job.website}</a>
            </div>
          )}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3">联系方式</h3>
            <div className="text-white text-lg font-semibold">{job.contact}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InternPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEmployment, setFilterEmployment] = useState<'all' | 'intern' | 'full-time'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  // 名片卡相关状态
  const [showCardForm, setShowCardForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentIntern, setCurrentIntern] = useState<Intern | null>(null);
  const [checkingIntern, setCheckingIntern] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cardForm, setCardForm] = useState({
    name: '',
    education: '',
    position: '',
    internshipPeriod: '',
    contact: '',
    startDate: '',
    baseLocation: '',
    workType: 'hybrid' as 'online' | 'offline' | 'hybrid',
    employmentType: 'intern' as 'intern' | 'full-time' | 'both',
    recommendation: '',
    recommendedBy: '',
  });

  useEffect(() => {
    fetchJobs();
    checkExistingIntern();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      setJobs(await res.json());
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingIntern = async () => {
    const inviteCode = sessionStorage.getItem('inviteCode');
    if (!inviteCode) { setCheckingIntern(false); return; }
    try {
      const res = await fetch(`/api/interns/by-invite?code=${inviteCode}`);
      const intern: Intern | null = await res.json();
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
          employmentType: intern.employmentType,
          recommendation: intern.recommendation || '',
          recommendedBy: intern.recommendedBy || '',
        });
        if (intern.resumeUrl) setResumeUrl(intern.resumeUrl);
      }
    } catch (error) {
      console.error('Failed to check intern:', error);
    } finally {
      setCheckingIntern(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setUploadError('只支持 PDF 文件'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('文件大小不能超过 5MB'); return; }
    setUploadError('');
    setResumeFile(file);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/resume', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) { setResumeUrl(data.resumeUrl); }
      else { setUploadError(data.error || '上传失败'); setResumeFile(null); }
    } catch { setUploadError('上传失败，请重试'); setResumeFile(null); }
    finally { setUploading(false); }
  };

  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const inviteCode = sessionStorage.getItem('inviteCode');
    if (!inviteCode) { alert('邀请码信息丢失，请重新登录'); router.push('/'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...cardForm,
        resumeUrl: resumeUrl || undefined,
        recommendation: cardForm.recommendation.trim() || undefined,
        recommendedBy: cardForm.recommendation.trim() ? cardForm.recommendedBy.trim() || undefined : undefined,
      };
      if (isEditMode && currentIntern) {
        const res = await fetch(`/api/interns/${currentIntern.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) { alert('名片卡更新成功！'); setShowCardForm(false); }
        else alert('更新失败，请重试');
      } else {
        const res = await fetch('/api/interns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, inviteCode }),
        });
        if (res.ok) {
          const newIntern = await res.json();
          setCurrentIntern(newIntern);
          setIsEditMode(true);
          alert('名片卡提交成功！');
          setShowCardForm(false);
        } else alert('提交失败，请重试');
      }
    } catch { alert('操作失败，请重试'); }
    finally { setSubmitting(false); }
  };

  const locations = Array.from(new Set(jobs.map(j => j.baseLocation))).filter(Boolean);
  const filteredJobs = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.companyName.toLowerCase().includes(search.toLowerCase()) || j.baseLocation.toLowerCase().includes(search.toLowerCase());
    const matchEmployment = filterEmployment === 'all' || j.employmentType === filterEmployment;
    const matchLocation = filterLocation === 'all' || j.baseLocation === filterLocation;
    return matchSearch && matchEmployment && matchLocation;
  });

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-900 hover:border-gray-300 bg-white";

  if (checkingIntern) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-7 w-7 object-contain" />
            <span className="text-xl font-bold text-gray-900">Pluslink</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={() => setShowCardForm(!showCardForm)}>
              {showCardForm ? '返回职位' : (isEditMode ? '编辑名片卡' : '提交名片卡')}
            </Button>
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">实习生端</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {showCardForm ? (
          <div className="max-w-2xl mx-auto animate-[fade-in_0.3s_ease-out]">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">{isEditMode ? '编辑名片卡' : '提交名片卡'}</h1>
              <p className="text-sm text-gray-500 mt-1">{isEditMode ? '修改个人信息，让企业发现你' : '填写个人信息，让企业发现你'}</p>
            </div>
            <form onSubmit={handleSubmitCard} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">姓名</label>
                <input type="text" required value={cardForm.name} onChange={e => setCardForm({ ...cardForm, name: e.target.value })} className={inputClass} placeholder="请输入您的姓名" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">学历</label>
                <input type="text" required value={cardForm.education} onChange={e => setCardForm({ ...cardForm, education: e.target.value })} className={inputClass} placeholder="例如：北京大学 计算机科学 本科" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">奇绩实习岗位</label>
                <input type="text" required value={cardForm.position} onChange={e => setCardForm({ ...cardForm, position: e.target.value })} className={inputClass} placeholder="例如：前端开发实习生" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">实习时间</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">开始时间</label>
                    <input type="month" required value={cardForm.internshipPeriod.split(' - ')[0] || ''} onChange={e => { const end = cardForm.internshipPeriod.split(' - ')[1] || ''; setCardForm({ ...cardForm, internshipPeriod: `${e.target.value}${end ? ' - ' + end : ''}` }); }} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">结束时间</label>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="untilNow"
                          checked={cardForm.internshipPeriod.split(' - ')[1] === '至今'}
                          onChange={e => {
                            const start = cardForm.internshipPeriod.split(' - ')[0] || '';
                            setCardForm({ ...cardForm, internshipPeriod: `${start} - ${e.target.checked ? '至今' : ''}` });
                          }}
                          className="w-4 h-4 rounded border-gray-300 accent-gray-900"
                        />
                        <label htmlFor="untilNow" className="text-xs text-gray-600 cursor-pointer">至今</label>
                      </div>
                      {cardForm.internshipPeriod.split(' - ')[1] !== '至今' && (
                        <input type="month" required value={cardForm.internshipPeriod.split(' - ')[1] || ''} onChange={e => { const start = cardForm.internshipPeriod.split(' - ')[0] || ''; setCardForm({ ...cardForm, internshipPeriod: `${start} - ${e.target.value}` }); }} className={inputClass} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">可入职时间</label>
                <input type="text" required value={cardForm.startDate} onChange={e => setCardForm({ ...cardForm, startDate: e.target.value })} className={inputClass} placeholder="例如：随时、1个月后、2026年4月" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Base地点</label>
                <input type="text" required value={cardForm.baseLocation} onChange={e => setCardForm({ ...cardForm, baseLocation: e.target.value })} className={inputClass} placeholder="例如：北京、上海、深圳" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">工作方式</label>
                  <select required value={cardForm.workType} onChange={e => setCardForm({ ...cardForm, workType: e.target.value as 'online' | 'offline' | 'hybrid' })} className={inputClass}>
                    <option value="hybrid">混合办公</option>
                    <option value="online">线上</option>
                    <option value="offline">线下</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">期望职位类型</label>
                  <select required value={cardForm.employmentType} onChange={e => setCardForm({ ...cardForm, employmentType: e.target.value as 'intern' | 'full-time' | 'both' })} className={inputClass}>
                    <option value="intern">实习</option>
                    <option value="full-time">全职</option>
                    <option value="both">实习或全职都可以</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">联系方式</label>
                <input type="text" required value={cardForm.contact} onChange={e => setCardForm({ ...cardForm, contact: e.target.value })} className={inputClass} placeholder="手机号或微信" />
              </div>

              {/* 推荐语 */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  推荐语
                  <span className="ml-1.5 text-xs font-normal text-gray-400">选填 · 最多50字</span>
                </label>
                <textarea
                  value={cardForm.recommendation}
                  onChange={e => {
                    if (e.target.value.length <= 50) setCardForm({ ...cardForm, recommendation: e.target.value });
                  }}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="由奇绩内部人员撰写的推荐语..."
                />
                <div className="flex justify-end">
                  <span className={`text-xs ${cardForm.recommendation.length >= 50 ? 'text-red-500' : 'text-gray-400'}`}>
                    {cardForm.recommendation.length} / 50
                  </span>
                </div>
              </div>
              {cardForm.recommendation.trim() && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">推荐人姓名</label>
                  <input
                    type="text"
                    required
                    value={cardForm.recommendedBy}
                    onChange={e => setCardForm({ ...cardForm, recommendedBy: e.target.value })}
                    className={inputClass}
                    placeholder="奇绩内部人员姓名"
                    maxLength={20}
                  />
                </div>
              )}

              {/* 简历上传 */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  上传简历
                  <span className="ml-1.5 text-xs font-normal text-gray-400">PDF · 最大 5MB · 选填</span>
                </label>
                <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                {!resumeFile && !resumeUrl ? (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="btn w-full px-4 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center gap-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
                    </svg>
                    <span className="text-sm text-gray-500">点击选择 PDF 文件</span>
                  </button>
                ) : (
                  <div className={`flex items-center gap-3 px-4 py-3 border rounded-xl ${uploading ? 'border-gray-200 bg-gray-50' : uploadError ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                    <svg className={`w-5 h-5 shrink-0 ${uploading ? 'text-gray-400' : uploadError ? 'text-red-500' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 flex-1 truncate">{resumeFile?.name || '已上传的简历'}</span>
                    {uploading ? (
                      <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin shrink-0" />
                    ) : (
                      <button type="button" onClick={() => { setResumeFile(null); setResumeUrl(''); setUploadError(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="btn w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors shrink-0">
                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
              </div>

              <Button type="submit" loading={submitting} className="w-full">
                {submitting ? (isEditMode ? '保存中' : '提交中') : (isEditMode ? '保存修改' : '提交名片卡')}
              </Button>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">发现机会</h1>
              <p className="text-gray-600">{filteredJobs.length} 个职位正在招聘</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="搜索职位、公司或地点..." className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[{ value: 'all' as const, label: '全部' }, { value: 'intern' as const, label: '实习' }, { value: 'full-time' as const, label: '全职' }].map(({ value, label }) => (
                    <button key={value} onClick={() => setFilterEmployment(value)} className={`btn px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${filterEmployment === value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{label}</button>
                  ))}
                </div>
                {locations.length > 0 && (
                  <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none bg-gray-50 text-gray-700">
                    <option value="all">全部地点</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <span className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                <p className="text-sm text-gray-500">{jobs.length === 0 ? '暂无招聘职位' : '没有符合条件的职位'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => <JobCardSimple key={job.id} job={job} onClick={() => setSelectedJob(job)} />)}
              </div>
            )}
          </>
        )}
      </main>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}
