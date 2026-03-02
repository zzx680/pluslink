'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Intern } from '@/lib/types';

export default function CompanyPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [showPostJob, setShowPostJob] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobForm, setJobForm] = useState({ companyName: '', title: '', description: '', requirements: '', contact: '' });

  useEffect(() => { fetchInterns(); }, []);

  const fetchInterns = async () => {
    try { const response = await fetch('/api/interns'); const data = await response.json(); setInterns(data); }
    catch (error) { console.error('Failed to fetch interns:', error); }
    finally { setLoading(false); }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jobForm) });
      if (response.ok) { alert('职位发布成功！'); setJobForm({ companyName: '', title: '', description: '', requirements: '', contact: '' }); setShowPostJob(false); } else { alert('发布失败，请重试'); }
    } catch (error) { console.error('Failed to post job:', error); alert('发布失败，请重试'); }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200"><div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"><Link href="/" className="text-2xl font-bold text-black">Pluslink</Link><span className="text-gray-600">企业端</span></div></header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8"><button onClick={() => setShowPostJob(!showPostJob)} className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">{showPostJob ? '查看实习生' : '发布职位'}</button></div>
        {showPostJob ? (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">发布新职位</h2>
            <form onSubmit={handlePostJob} className="space-y-6">
              <div><label className="block text-sm font-medium mb-2">公司名称 *</label><input type="text" required value={jobForm.companyName} onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none" placeholder="请输入公司名称" /></div>
              <div><label className="block text-sm font-medium mb-2">职位名称 *</label><input type="text" required value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none" placeholder="例如：前端工程师" /></div>
              <div><label className="block text-sm font-medium mb-2">职位描述 *</label><textarea required value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} rows={6} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none" placeholder="请详细描述职位职责和工作内容" /></div>
              <div><label className="block text-sm font-medium mb-2">任职要求 *</label><textarea required value={jobForm.requirements} onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })} rows={4} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none resize-none" placeholder="请描述对候选人的要求和期望" /></div>
              <div><label className="block text-sm font-medium mb-2">联系方式 *</label><input type="text" required value={jobForm.contact} onChange={(e) => setJobForm({ ...jobForm, contact: e.target.value })} className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none" placeholder="邮箱或微信" /></div>
              <button type="submit" className="w-full px-6 py-4 bg-black text-white font-medium hover:bg-gray-800 transition-colors">发布职位</button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">实习生名片卡 ({interns.length})</h2>
            {loading ? (<p className="text-gray-600">加载中...</p>) : interns.length === 0 ? (<div className="text-center py-12"><p className="text-gray-600 mb-4">暂无实习生信息</p><p className="text-sm text-gray-400">等待实习生提交名片卡</p></div>) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interns.map((intern) => (
                  <div key={intern.id} className="border border-gray-200 p-6 hover:border-gray-400 transition-colors">
                    <h3 className="text-xl font-bold mb-4">{intern.name}</h3>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-gray-600">学历：</span><span className="font-medium">{intern.education}</span></div>
                      <div><span className="text-gray-600">实习岗位：</span><span className="font-medium">{intern.position}</span></div>
                      <div><span className="text-gray-600">实习时间：</span><span className="font-medium">{intern.internshipPeriod}</span></div>
                      <div><span className="text-gray-600">联系方式：</span><span className="font-medium">{intern.contact}</span></div>
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
