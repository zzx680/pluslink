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
    <div className="min-h-screen bg-[#f7f7f7]">
      <header className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-[20px] font-semibold text-black">
            Pluslink
          </Link>
          <span className="px-4 py-2 bg-black text-white text-[16px] font-semibold rounded-[8px]">企业端</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h1 className="text-[48px] font-bold text-black mb-2">
              {showPostJob ? '发布新职位' : '实习生人才库'}
            </h1>
            <p className="text-[16px] text-[#666666]">
              {showPostJob ? '填写职位信息，吸引优秀人才' : `共 ${interns.length} 位奇绩创坛实习生`}
            </p>
          </div>
          <button
            onClick={() => setShowPostJob(!showPostJob)}
            className="px-8 py-4 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all"
          >
            {showPostJob ? '返回查看' : '发布职位'}
          </button>
        </div>

        {showPostJob ? (
          <div className="max-w-3xl">
            <form onSubmit={handlePostJob} className="bg-white rounded-[16px] p-12 shadow-sm space-y-8">
              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">公司名称</label>
                <input
                  type="text"
                  required
                  value={jobForm.companyName}
                  onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="请输入公司名称"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">职位名称</label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="例如：前端工程师"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">职位描述</label>
                <textarea
                  required
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] resize-none bg-[#f7f7f7] focus:bg-white"
                  placeholder="请详细描述职位职责和工作内容"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">任职要求</label>
                <textarea
                  required
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] resize-none bg-[#f7f7f7] focus:bg-white"
                  placeholder="请描述对候选人的要求和期望"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">Base地点</label>
                <input
                  type="text"
                  required
                  value={jobForm.baseLocation}
                  onChange={(e) => setJobForm({ ...jobForm, baseLocation: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="例如：北京、上海、深圳"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[16px] font-semibold text-black">工作方式</label>
                  <select
                    required
                    value={jobForm.workType}
                    onChange={(e) => setJobForm({ ...jobForm, workType: e.target.value as 'online' | 'offline' | 'hybrid' })}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  >
                    <option value="hybrid">混合办公</option>
                    <option value="online">线上</option>
                    <option value="offline">线下</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[16px] font-semibold text-black">职位类型</label>
                  <select
                    required
                    value={jobForm.employmentType}
                    onChange={(e) => setJobForm({ ...jobForm, employmentType: e.target.value as 'intern' | 'full-time' })}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  >
                    <option value="intern">实习</option>
                    <option value="full-time">全职</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">联系方式</label>
                <input
                  type="text"
                  required
                  value={jobForm.contact}
                  onChange={(e) => setJobForm({ ...jobForm, contact: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="邮箱或微信"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all"
              >
                发布职位
              </button>
            </form>
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-[16px] text-[#666666]">加载中...</div>
              </div>
            ) : interns.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[16px] border-2 border-dashed border-[#e5e5e5]">
                <p className="text-[16px] text-[#666666]">暂无实习生信息</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {interns.map((intern) => (
                  <div
                    key={intern.id}
                    onClick={() => setSelectedIntern(intern)}
                    className="bg-white rounded-[16px] p-8 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-[20px] font-bold">
                        {intern.name.charAt(0)}
                      </div>
                    </div>

                    <h3 className="text-[20px] font-semibold mb-2 text-black">
                      {intern.name}
                    </h3>

                    <p className="text-[16px] text-[#666666] mb-6">{intern.position}</p>

                    <div className="pt-4 border-t border-[#e5e5e5]">
                      <span className="text-[16px] text-black font-semibold">查看完整名片 →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {selectedIntern && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-8 animate-fade-in"
          onClick={() => setSelectedIntern(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-[16px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#e5e5e5] p-8 flex items-center justify-between rounded-t-[16px]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-[20px] font-bold">
                  {selectedIntern.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-[32px] font-bold text-black">{selectedIntern.name}</h2>
                  <p className="text-[16px] text-[#666666]">{selectedIntern.position}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIntern(null)}
                className="w-10 h-10 flex items-center justify-center hover:bg-[#f7f7f7] rounded-[8px] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[16px] text-[#666666] mb-2">学历</div>
                  <div className="text-[16px] text-black">{selectedIntern.education}</div>
                </div>

                <div>
                  <div className="text-[16px] text-[#666666] mb-2">实习时间</div>
                  <div className="text-[16px] text-black">{selectedIntern.internshipPeriod}</div>
                </div>

                <div>
                  <div className="text-[16px] text-[#666666] mb-2">可入职时间</div>
                  <div className="text-[16px] text-black">{selectedIntern.startDate}</div>
                </div>

                <div>
                  <div className="text-[16px] text-[#666666] mb-2">Base地点</div>
                  <div className="text-[16px] text-black">{selectedIntern.baseLocation}</div>
                </div>

                <div>
                  <div className="text-[16px] text-[#666666] mb-2">工作方式</div>
                  <div className="text-[16px] text-black">
                    {selectedIntern.workType === 'online' ? '线上' : selectedIntern.workType === 'offline' ? '线下' : '混合办公'}
                  </div>
                </div>

                <div>
                  <div className="text-[16px] text-[#666666] mb-2">职位类型</div>
                  <div className="text-[16px] text-black">
                    {selectedIntern.employmentType === 'intern' ? '实习' : '全职'}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#e5e5e5]">
                <div className="bg-[#f7f7f7] rounded-[16px] p-6">
                  <div className="text-[16px] text-[#666666] mb-2">联系方式</div>
                  <div className="text-[20px] font-semibold text-black">{selectedIntern.contact}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

