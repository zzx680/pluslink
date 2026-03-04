'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/lib/types';

export default function InternPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showSubmitCard, setShowSubmitCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cardForm, setCardForm] = useState({
    name: '',
    education: '',
    position: '',
    internshipPeriod: '',
    contact: '',
    startDate: '',
    baseLocation: '',
    workType: 'hybrid' as 'online' | 'offline' | 'hybrid',
    employmentType: 'intern' as 'intern' | 'full-time'
  });

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
        setCardForm({ name: '', education: '', position: '', internshipPeriod: '', contact: '', startDate: '', baseLocation: '', workType: 'hybrid', employmentType: 'intern' });
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
    <div className="min-h-screen bg-[#f7f7f7]">
      <header className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-[20px] font-semibold text-black">
            Pluslink
          </Link>
          <span className="px-4 py-2 bg-black text-white text-[16px] font-semibold rounded-[8px]">实习生端</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h1 className="text-[48px] font-bold text-black mb-2">
              {showSubmitCard ? '提交名片卡' : '招聘职位'}
            </h1>
            <p className="text-[16px] text-[#666666]">
              {showSubmitCard ? '填写个人信息，让企业发现你' : `共 ${jobs.length} 个职位机会`}
            </p>
          </div>
          <button
            onClick={() => setShowSubmitCard(!showSubmitCard)}
            className="px-8 py-4 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all"
          >
            {showSubmitCard ? '返回查看' : '提交名片卡'}
          </button>
        </div>

        {showSubmitCard ? (
          <div className="max-w-3xl">
            <form onSubmit={handleSubmitCard} className="bg-white rounded-[16px] p-12 shadow-sm space-y-8">
              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">姓名</label>
                <input
                  type="text"
                  required
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">学历</label>
                <input
                  type="text"
                  required
                  value={cardForm.education}
                  onChange={(e) => setCardForm({ ...cardForm, education: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="例如：北京大学 计算机科学 本科"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">奇绩实习岗位</label>
                <input
                  type="text"
                  required
                  value={cardForm.position}
                  onChange={(e) => setCardForm({ ...cardForm, position: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="例如：前端开发实习生"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">实习时间</label>
                <input
                  type="text"
                  required
                  value={cardForm.internshipPeriod}
                  onChange={(e) => setCardForm({ ...cardForm, internshipPeriod: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="例如：2024年1月 - 2024年6月"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">可入职时间</label>
                <input
                  type="text"
                  required
                  value={cardForm.startDate}
                  onChange={(e) => setCardForm({ ...cardForm, startDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="例如：随时、1个月后、2026年4月"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[16px] font-semibold text-black">Base地点</label>
                <input
                  type="text"
                  required
                  value={cardForm.baseLocation}
                  onChange={(e) => setCardForm({ ...cardForm, baseLocation: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="例如：北京、上海、深圳"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[16px] font-semibold text-black">工作方式</label>
                  <select
                    required
                    value={cardForm.workType}
                    onChange={(e) => setCardForm({ ...cardForm, workType: e.target.value as 'online' | 'offline' | 'hybrid' })}
                    className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  >
                    <option value="hybrid">混合办公</option>
                    <option value="online">线上</option>
                    <option value="offline">线下</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[16px] font-semibold text-black">期望职位类型</label>
                  <select
                    required
                    value={cardForm.employmentType}
                    onChange={(e) => setCardForm({ ...cardForm, employmentType: e.target.value as 'intern' | 'full-time' })}
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
                  value={cardForm.contact}
                  onChange={(e) => setCardForm({ ...cardForm, contact: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all text-[16px] bg-[#f7f7f7] focus:bg-white"
                  placeholder="邮箱或微信"
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all"
              >
                提交名片卡
              </button>
            </form>
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-[16px] text-[#666666]">加载中...</div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-[16px] border-2 border-dashed border-[#e5e5e5]">
                <p className="text-[16px] text-[#666666]">暂无招聘职位</p>
              </div>
            ) : (
              <div className="space-y-8">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-[16px] p-12 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-[32px] font-bold text-black">
                            {job.title}
                          </h3>
                          <span className={`px-3 py-1 text-[16px] font-semibold rounded-[8px] ${job.employmentType === 'intern' ? 'bg-[#f7f7f7] text-black' : 'bg-black text-white'}`}>
                            {job.employmentType === 'intern' ? '实习' : '全职'}
                          </span>
                        </div>
                        <p className="text-[20px] text-[#666666] font-semibold mb-4">{job.companyName}</p>
                        <div className="flex items-center gap-6 text-[16px] text-[#666666]">
                          <span>{job.baseLocation}</span>
                          <span>·</span>
                          <span>{job.workType === 'online' ? '线上' : job.workType === 'offline' ? '线下' : '混合办公'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h4 className="text-[20px] font-semibold text-black mb-4">职位描述</h4>
                        <p className="text-[16px] text-[#666666] leading-relaxed whitespace-pre-wrap">
                          {job.description}
                        </p>
                      </div>

                      <div className="border-t border-[#e5e5e5] pt-8">
                        <h4 className="text-[20px] font-semibold text-black mb-4">任职要求</h4>
                        <p className="text-[16px] text-[#666666] leading-relaxed whitespace-pre-wrap">
                          {job.requirements}
                        </p>
                      </div>

                      <div className="pt-8 border-t border-[#e5e5e5]">
                        <div className="bg-[#f7f7f7] rounded-[16px] p-6">
                          <div className="text-[16px] text-[#666666] mb-2">联系方式</div>
                          <div className="text-[20px] font-semibold text-black">{job.contact}</div>
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

