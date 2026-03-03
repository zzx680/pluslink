'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/types';

export default function InternPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showSubmitCard, setShowSubmitCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardForm, setCardForm] = useState({ name: '', education: '', position: '', internshipPeriod: '', contact: '' });

  useEffect(() => { fetchJobs(); }, []);

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

  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/interns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardForm)
      });
      if (response.ok) {
        alert('名片卡提交成功！');
        setCardForm({ name: '', education: '', position: '', internshipPeriod: '', contact: '' });
        setShowSubmitCard(false);
      } else {
        alert('提交失败，请重试');
      }
    } catch (error) {
      console.error('Failed to submit card:', error);
      alert('提交失败，请重试');
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
            <span className="px-4 py-2 bg-white border-2 border-black text-black text-sm font-medium tracking-wide">实习生端</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 操作按钮 */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">
              {showSubmitCard ? '提交名片卡' : '招聘职位'}
            </h1>
            <p className="text-gray-500">
              {showSubmitCard ? '填写个人信息，让企业发现你' : `共 ${jobs.length} 个职位机会`}
            </p>
          </div>
          <button
            onClick={() => setShowSubmitCard(!showSubmitCard)}
            className="group px-8 py-4 bg-white border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center gap-3"
          >
            <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showSubmitCard ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
            </svg>
            <span>{showSubmitCard ? '返回查看' : '提交名片卡'}</span>
          </button>
        </div>

        {showSubmitCard ? (
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmitCard} className="bg-white shadow-xl border border-gray-100 p-10 space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">姓名 *</label>
                <input
                  type="text"
                  required
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">学历 *</label>
                <input
                  type="text"
                  required
                  value={cardForm.education}
                  onChange={(e) => setCardForm({ ...cardForm, education: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="例如：北京大学 计算机科学 本科"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">奇绩实习岗位 *</label>
                <input
                  type="text"
                  required
                  value={cardForm.position}
                  onChange={(e) => setCardForm({ ...cardForm, position: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="例如：前端开发实习生"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">实习时间 *</label>
                <input
                  type="text"
                  required
                  value={cardForm.internshipPeriod}
                  onChange={(e) => setCardForm({ ...cardForm, internshipPeriod: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="例如：2024年1月 - 2024年6月"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 tracking-wide">联系方式 *</label>
                <input
                  type="text"
                  required
                  value={cardForm.contact}
                  onChange={(e) => setCardForm({ ...cardForm, contact: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 text-lg bg-gray-50 focus:bg-white"
                  placeholder="邮箱或微信"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-5 bg-black text-white text-lg font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-xl"
              >
                提交名片卡
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
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-2">暂无招聘职位</p>
                <p className="text-sm text-gray-400">等待企业发布职位信息</p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="group bg-white border-2 border-gray-100 p-10 hover:border-black hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-3xl font-bold text-black group-hover:text-gray-900 transition-colors">
                            {job.title}
                          </h3>
                          <span className="px-3 py-1 bg-black text-white text-xs font-medium tracking-wider">
                            NEW
                          </span>
                        </div>
                        <p className="text-xl text-gray-600 font-medium">{job.companyName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">
                          {new Date(job.createdAt).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h4 className="font-bold text-lg">职位描述</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-7">
                          {job.description}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          <h4 className="font-bold text-lg">任职要求</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-7">
                          {job.requirements}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-black">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">联系方式</p>
                            <p className="font-semibold text-lg">{job.contact}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
