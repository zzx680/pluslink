'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Intern } from '@/lib/types';
import Button from '@/components/Button';

const WORK_TYPE_LABEL = { online: '线上', offline: '线下', hybrid: '混合办公' };
const EMPLOYMENT_LABEL = { intern: '实习', 'full-time': '全职', both: '实习/全职' };

type FilterWorkType = 'all' | 'online' | 'offline' | 'hybrid';
type FilterEmployment = 'all' | 'intern' | 'full-time' | 'both';

export default function CompanyPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [showPostJob, setShowPostJob] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterWork, setFilterWork] = useState<FilterWorkType>('all');
  const [filterEmployment, setFilterEmployment] = useState<FilterEmployment>('all');
  const [weeklyDigest, setWeeklyDigest] = useState<{ newThisWeek: number; total: number } | null>(null);
  const [showDigestBanner, setShowDigestBanner] = useState(false);
  const [revealedContacts, setRevealedContacts] = useState<Set<string>>(new Set());
  const [jobForm, setJobForm] = useState({
    companyName: '',
    cohort: '',
    website: '',
    title: '',
    description: '',
    requirements: '',
    contact: '',
    baseLocation: '',
    workType: 'hybrid' as 'online' | 'offline' | 'hybrid',
    employmentType: 'intern' as 'intern' | 'full-time'
  });

  useEffect(() => {
    fetchInterns();
    fetchWeeklyDigest();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await fetch('/api/interns');
      const data = await response.json();
      setInterns(data);
    } catch (error) {
      console.error('Failed to fetch interns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyDigest = async () => {
    const inviteCode = sessionStorage.getItem('inviteCode');
    if (!inviteCode) return;

    // 检查本周是否已经展示过通知
    const lastShown = localStorage.getItem('weeklyDigestShown');
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    if (lastShown && Number(lastShown) > oneWeekAgo) return;

    try {
      const res = await fetch(`/api/company/weekly-digest?inviteCode=${inviteCode}`);
      const data = await res.json();
      if (data.newThisWeek > 0) {
        setWeeklyDigest(data);
        setShowDigestBanner(true);
      }
    } catch (error) {
      console.error('Failed to fetch weekly digest:', error);
    }
  };

  const dismissDigest = () => {
    setShowDigestBanner(false);
    localStorage.setItem('weeklyDigestShown', String(Date.now()));
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...jobForm, inviteCode: sessionStorage.getItem('inviteCode') || undefined })
      });
      if (response.ok) {
        sessionStorage.setItem('companyName', jobForm.companyName);
        alert('职位发布成功！');
        setJobForm({ companyName: '', cohort: '', website: '', title: '', description: '', requirements: '', contact: '', baseLocation: '', workType: 'hybrid', employmentType: 'intern' });
        setShowPostJob(false);
      } else {
        alert('发布失败，请重试');
      }
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('发布失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const PINNED_ID = '1773887162898'; // 李秦置顶

  const filtered = interns.filter(i => {
    const matchSearch = !search || i.name.includes(search) || i.position.includes(search) || i.baseLocation.includes(search) || i.education.includes(search);
    const matchWork = filterWork === 'all' || i.workType === filterWork;
    const matchEmployment = filterEmployment === 'all' || i.employmentType === filterEmployment;
    return matchSearch && matchWork && matchEmployment;
  }).sort((a, b) => {
    if (a.id === PINNED_ID) return -1;
    if (b.id === PINNED_ID) return 1;
    if (a.resumeUrl && !b.resumeUrl) return -1;
    if (!a.resumeUrl && b.resumeUrl) return 1;
    return 0;
  });

  const handleViewIntern = (intern: Intern) => {
    setSelectedIntern(intern);
  };

  const handleRevealContact = async (intern: Intern, e: React.MouseEvent) => {
    e.stopPropagation();
    const companyName = sessionStorage.getItem('companyName') || sessionStorage.getItem('displayName');
    setRevealedContacts(prev => new Set(prev).add(intern.id));
    if (companyName) {
      try {
        await fetch('/api/profile-views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ internId: intern.id, viewerName: companyName }),
        });
      } catch (e) {
        console.error('Failed to record match:', e);
      }
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-900 hover:border-gray-300";

  const FilterChip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`btn px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-150 ${
        active ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-7 w-7 object-contain" />
            <span className="text-xl font-semibold text-gray-900">Pluslink</span>
          </Link>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">校友端</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        {showPostJob ? (
          <div className="animate-[fade-in_0.3s_ease-out]">
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={() => setShowPostJob(false)}
                className="btn w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">发布新职位</h1>
                <p className="text-sm text-gray-500 mt-0.5">填写职位信息，吸引优秀人才</p>
              </div>
            </div>
            <div className="max-w-2xl">
              <form onSubmit={handlePostJob} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">公司名称</label>
                    <input type="text" required value={jobForm.companyName}
                      onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                      className={inputClass} placeholder="请输入公司名称" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">届数</label>
                    <select
                      required
                      value={jobForm.cohort}
                      onChange={(e) => setJobForm({ ...jobForm, cohort: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">请选择届数</option>
                      {['S22', 'F22', 'S23', 'F23', 'S24', 'F24', 'S25', 'F25', 'S26', 'F26'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    公司网址
                    <span className="ml-1.5 text-xs font-normal text-gray-400">选填</span>
                  </label>
                  <input type="url" value={jobForm.website}
                    onChange={(e) => setJobForm({ ...jobForm, website: e.target.value })}
                    className={inputClass} placeholder="https://example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">职位名称</label>
                  <input type="text" required value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className={inputClass} placeholder="例如：前端工程师" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">职位描述</label>
                  <textarea required value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    rows={5} className={`${inputClass} resize-none`} placeholder="请详细描述职位职责和工作内容" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">任职要求</label>
                  <textarea required value={jobForm.requirements}
                    onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                    rows={4} className={`${inputClass} resize-none`} placeholder="请描述对候选人的要求和期望" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Base地点</label>
                    <input type="text" required value={jobForm.baseLocation}
                      onChange={(e) => setJobForm({ ...jobForm, baseLocation: e.target.value })}
                      className={inputClass} placeholder="北京、上海..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">工作方式</label>
                    <select required value={jobForm.workType}
                      onChange={(e) => setJobForm({ ...jobForm, workType: e.target.value as 'online' | 'offline' | 'hybrid' })}
                      className={inputClass}>
                      <option value="hybrid">混合办公</option>
                      <option value="online">线上</option>
                      <option value="offline">线下</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">职位类型</label>
                    <select required value={jobForm.employmentType}
                      onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value as 'intern' | 'full-time' })}
                      className={inputClass}>
                      <option value="intern">实习</option>
                      <option value="full-time">全职</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">联系方式</label>
                  <input type="text" required value={jobForm.contact}
                    onChange={(e) => setJobForm({ ...jobForm, contact: e.target.value })}
                    className={inputClass} placeholder="邮箱或微信" />
                </div>
                <Button type="submit" loading={submitting} className="w-full">
                  {submitting ? '发布中' : '发布职位'}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <div className="animate-[fade-in_0.4s_ease-out]">
            {/* 每周简历通知 banner */}
            {showDigestBanner && weeklyDigest && (
              <div className="mb-6 flex items-center justify-between bg-gray-900 text-white px-5 py-3.5 rounded-2xl animate-[fade-in_0.3s_ease-out]">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📬</span>
                  <span className="text-sm font-medium">
                    本周新增 <span className="font-bold text-white">{weeklyDigest.newThisWeek}</span> 份实习生简历，共 {weeklyDigest.total} 份
                  </span>
                </div>
                <button
                  onClick={dismissDigest}
                  className="btn w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors shrink-0"
                >
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">实习生人才库</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loading ? '加载中...' : `${filtered.length} / ${interns.length} 位奇绩创坛实习生`}
                </p>
              </div>
              <Button onClick={() => setShowPostJob(true)}>发布职位</Button>
            </div>

            {/* 搜索 + 筛选栏 */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="relative flex-1 min-w-48">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索姓名、岗位、城市..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none transition-all duration-200 text-gray-900"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">工作方式</span>
                <FilterChip active={filterWork === 'all'} onClick={() => setFilterWork('all')}>全部</FilterChip>
                <FilterChip active={filterWork === 'online'} onClick={() => setFilterWork('online')}>线上</FilterChip>
                <FilterChip active={filterWork === 'offline'} onClick={() => setFilterWork('offline')}>线下</FilterChip>
                <FilterChip active={filterWork === 'hybrid'} onClick={() => setFilterWork('hybrid')}>混合</FilterChip>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">职位类型</span>
                <FilterChip active={filterEmployment === 'all'} onClick={() => setFilterEmployment('all')}>全部</FilterChip>
                <FilterChip active={filterEmployment === 'intern'} onClick={() => setFilterEmployment('intern')}>实习</FilterChip>
                <FilterChip active={filterEmployment === 'full-time'} onClick={() => setFilterEmployment('full-time')}>全职</FilterChip>
                <FilterChip active={filterEmployment === 'both'} onClick={() => setFilterEmployment('both')}>均可</FilterChip>
              </div>
            </div>

            {/* 人才卡片网格 */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <span className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-sm text-gray-500">{interns.length === 0 ? '暂无实习生信息' : '没有符合条件的实习生'}</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((intern) => {
                  return (
                    <div
                      key={intern.id}
                      onClick={() => handleViewIntern(intern)}
                      className="group rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all duration-150 bg-white flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{intern.name}</h3>
                        </div>
                        {intern.resumeUrl && (
                          <span className="shrink-0 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded">简历</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 -mt-1.5 line-clamp-1">{intern.position}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{intern.education}</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] rounded">{intern.baseLocation}</span>
                        <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] rounded">{WORK_TYPE_LABEL[intern.workType]}</span>
                        <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-600 text-[11px] rounded">{EMPLOYMENT_LABEL[intern.employmentType]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 详情弹窗 */}
      {selectedIntern && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setSelectedIntern(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-2xl shadow-xl animate-[modal-in_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedIntern.name}</h2>
                <p className="text-sm text-gray-500">{selectedIntern.position}</p>
              </div>
              <button
                onClick={() => setSelectedIntern(null)}
                className="btn w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* 基本信息网格 */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '学历', value: selectedIntern.education },
                  { label: '奇绩实习岗位', value: selectedIntern.position },
                  { label: '实习时间', value: selectedIntern.internshipPeriod },
                  { label: '可入职时间', value: selectedIntern.startDate },
                  { label: 'Base地点', value: selectedIntern.baseLocation },
                  { label: '工作方式', value: WORK_TYPE_LABEL[selectedIntern.workType] },
                  { label: '期望职位类型', value: EMPLOYMENT_LABEL[selectedIntern.employmentType] },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                    <div className="text-xs text-gray-400 mb-1">{label}</div>
                    <div className="text-sm font-medium text-gray-900">{value}</div>
                  </div>
                ))}
                {/* 联系方式占满一行 */}
                <div className="col-span-2 bg-gray-900 rounded-xl px-4 py-3">
                  <div className="text-xs text-gray-400 mb-1">联系方式</div>
                  {revealedContacts.has(selectedIntern.id) ? (
                    <div className="text-sm font-semibold text-white">{selectedIntern.contact}</div>
                  ) : (
                    <button
                      onClick={(e) => handleRevealContact(selectedIntern, e)}
                      className="btn text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-150 flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      点击显示联系方式
                    </button>
                  )}
                </div>
              </div>

              {/* 推荐语 */}
              {selectedIntern.recommendation && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedIntern.recommendation}</p>
                      <p className="text-xs text-blue-500 font-medium mt-2">— {selectedIntern.recommendedBy} 推荐</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 简历预览 */}
              {selectedIntern.resumeUrl && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">个人简历</span>
                    <a
                      href={selectedIntern.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
                    >
                      新窗口打开
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <iframe src={selectedIntern.resumeUrl} className="w-full h-96" title="简历预览" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
