'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Intern } from '@/lib/types';

export default function CompanyPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [showPostJob, setShowPostJob] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [jobForm, setJobForm] = useState({
    companyName: '',
    title: '',
    description: '',
    requirements: '',
    contact: '',
    baseLocation: '',
    workType: 'hybrid' as 'online' | 'offline' | 'hybrid',
    employmentType: 'intern' as 'intern' | 'full-time'
  });

  useEffect(() => { fetchInterns(); }, []);

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

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobForm)
      });
      if (response.ok) {
        alert('职位发布成功！');
        setJobForm({ companyName: '', title: '', description: '', requirements: '', contact: '', baseLocation: '', workType: 'hybrid', employmentType: 'intern' });
        setShowPostJob(false);
      } else {
        alert('发布失败，请重试');
      }
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('发布失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <div className="w-6 h-6 border-2 border-white rounded"></div>
            </div>
            <span className="text-2xl font-bold text-black tracking-tight">Pluslink</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-black text-white text-sm font-medium tracking-wide">企业端</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 操作按钮 */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
              {showPostJob ? '发布新职位' : '实习生人才库'}
            </h1>
            <p className="text-gray-500">
              {showPostJob ? '填写职位信息，吸引优秀人才' : `共 ${interns.length} 位奇绩创坛实习生`}
            </p>
          </div>
          <button
            onClick={() => setShowPostJob(!showPostJob)}
            className="group px-8 py-4 bg-black text-white font-medium hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center gap-3"
          >
            <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPostJob ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
            </svg>
            <span>{showPostJob ? '返回查看' : '发布职位'}</span>
          </button>
        </div>

        {showPostJob ? (
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handlePostJob} className="bg-white shadow-xl border border-gray-100 p-10 space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">公司名称 *</label>
                <input
                  type="text"
                  required
                  value={jobForm.companyName}
                  onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="请输入公司名称"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">职位名称 *</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="例如：前端工程师"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">职位描述 *</label>
                <textarea
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  rows={6}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 resize-none bg-gray-50 focus:bg-white"
                  placeholder="请详细描述职位职责和工作内容"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">任职要求 *</label>
                <textarea
                  required
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  rows={5}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 resize-none bg-gray-50 focus:bg-white"
                  placeholder="请描述对候选人的要求和期望"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">Base地点 *</label>
                <input
                  type="text"
                  required
                  value={jobForm.baseLocation}
                  onChange={(e) => setJobForm({ ...jobForm, baseLocation: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="例如：北京、上海、深圳"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">工作方式 *</label>
                <select
                  required
                  value={jobForm.workType}
                  onChange={(e) => setJobForm({ ...jobForm, workType: e.target.value as 'online' | 'offline' | 'hybrid' })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                >
                  <option value="hybrid">混合办公</option>
                  <option value="online">线上</option>
                  <option value="offline">线下</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">职位类型 *</label>
                <select
                  required
                  value={jobForm.employmentType}
                  onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value as 'intern' | 'full-time' })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                >
                  <option value="intern">实习</option>
                  <option value="full-time">全职</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">联系方式 *</label>
                <input
                  type="text"
                  required
                  value={jobForm.contact}
                  onChange={(e) => setJobForm({ ...jobForm, contact: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="邮箱或微信"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-5 bg-black text-white text-lg font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-xl"
              >
                发布职位
              </button>
            </form>
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <svg className="animate-spin h-12 w-12 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-500">加载中...</p>
                </div>
              </div>
            ) : interns.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-2">暂无实习生信息</p>
                <p className="text-sm text-gray-400">等待实习生提交名片卡</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interns.map((intern, index) => (
                  <div
                    key={intern.id}
                    onClick={() => setSelectedIntern(intern)}
                    className="group bg-white border-2 border-gray-100 p-8 hover:border-black hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                        {intern.name.charAt(0)}
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle"></div>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-black group-hover:text-gray-900 transition-colors">
                      {intern.name}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{intern.position}</span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <button className="text-sm text-black font-medium group-hover:underline flex items-center gap-2">
                        查看完整名片
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Intern Detail Modal */}
      {selectedIntern && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setSelectedIntern(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedIntern.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-black">{selectedIntern.name}</h2>
                  <p className="text-gray-600">{selectedIntern.position}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIntern(null)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-semibold">学历</span>
                  </div>
                  <p className="text-lg text-black pl-6">{selectedIntern.education}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">实习时间</span>
                  </div>
                  <p className="text-lg text-black pl-6">{selectedIntern.internshipPeriod}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">可入职时间</span>
                  </div>
                  <p className="text-lg text-black pl-6">{selectedIntern.startDate}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-semibold">Base地点</span>
                  </div>
                  <p className="text-lg text-black pl-6">{selectedIntern.baseLocation}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">工作方式</span>
                  </div>
                  <p className="text-lg text-black pl-6">
                    {selectedIntern.workType === 'online' ? '线上' : selectedIntern.workType === 'offline' ? '线下' : '混合办公'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold">职位类型</span>
                  </div>
                  <p className="text-lg text-black pl-6">
                    {selectedIntern.employmentType === 'intern' ? '实习' : '全职'}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-gray-100">
                <div className="flex items-center gap-3 p-6 bg-gray-50 border-2 border-gray-200">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">联系方式</p>
                    <p className="text-xl font-semibold text-black">{selectedIntern.contact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
