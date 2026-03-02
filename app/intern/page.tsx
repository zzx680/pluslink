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
    try { const response = await fetch('/api/jobs'); const data = await response.json(); setJobs(data); }
    catch (error) { console.error('Failed to fetch jobs:', error); }
    finally { setLoading(false); }
  };

  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/interns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cardForm) });
      if (response.ok) { alert('名片卡提交成功！'); setCardForm({ name: '', education: '', position: '', internshipPeriod: '', contact: '' }); setShowSubmitCard(false); } else { alert('提交失败，请重试'); }
    } catch (error) { console.error('Failed to submit card:', error); alert('提交失败，请重试'); }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200"><div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-black">Pluslink</Link><span className="text-gray-600">实习生端</span></div></header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8"><button onClick={() => setShowSubmitCard(!showSubmitCard)} className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">{showSubmitCard ? '查看职位' : '提交名片卡'}</button></div>
        {showSubmitCard ? (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">提交个人名片卡</h2>
            <form onSubmit={handleSubmitCard} className="space-y-6">
              <div><label className="block text-sm font-medium mb-2">姓名 *</label><input type="text" required value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none" placeholder="请输入您的姓名" /></div>
              <div><label className="block text-sm font-medium mb-2">学历 *</label><input type="text" required value={cardForm.education} onChange={(e) => setCardForm({ ...cardForm, education: e.target.value })} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none" placeholder="例如：北京大学 计算机科学 本科" /></div>
              <div><label className="block text-sm font-medium mb-2">奇绩实习岗位 *</label><input type="text" required value={cardForm.position} onChange={(e) => setCardForm({ ...cardForm, position: e.target.value })} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none" placeholder="例如：前端开发实习生" /></div>
              <div><label className="block text-sm font-medium mb-2">实习时间 *</label><input type="text" required value={cardForm.internshipPeriod} onChange={(e) => setCardForm({ ...cardForm, internshipPeriod: e.target.value })} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none" placeholder="例如：2024年1月 - 2024年6月" /></div>
              <div><label className="block text-sm font-medium mb-2">联系方式 *</label><input type="text" required value={cardForm.contact} onChange={(e) => setCardForm({ ...cardForm, contact: e.target.value })} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none" placeholder="邮箱或微信" /></div>
              <button type="submit" className="w-full px-6 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors">提交名片卡</button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">招聘职位 ({jobs.length})</h2>
            {loading ? (<p className="text-gray-600">加载中...</p>) : jobs.length === 0 ? (<div className="text-center py-12"><p className="text-gray-600 mb-4">暂无招聘职位</p><p className="text-sm text-gray-400">等待企业发布职位信息</p></div>) : (
              <div className="space-y-6">
                {jobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 p-8 hover:border-gray-400 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div><h3 className="text-2xl font-bold mb-2">{job.title}</h3><p className="text-gray-600 font-medium">{job.companyName}</p></div>
                      <span className="text-sm text-gray-400 whitespace-nowrap">{new Date(job.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <div className="space-y-4">
                      <div><h4 className="font-bold mb-2">职位描述</h4><p className="text-gray-700 whitespace-pre-wrap">{job.description}</p></div>
                      <div><h4 className="font-bold mb-2">任职要求</h4><p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p></div>
                      <div className="pt-4 border-t border-gray-200"><span className="text-sm text-gray-600">联系方式：{job.contact}</span></div>
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
