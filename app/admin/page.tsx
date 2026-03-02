'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InviteCode } from '@/lib/types';

export default function AdminPage() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInviteCodes(); }, []);

  const fetchInviteCodes = async () => {
    try {
      const response = await fetch('/api/admin/invite-codes');
      const data = await response.json();
      setInviteCodes(data);
    } catch (error) {
      console.error('Failed to fetch invite codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async (type: 'company' | 'intern') => {
    try {
      const response = await fetch('/api/admin/invite-codes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) });
      if (response.ok) {
        const newCode = await response.json();
        alert('邀请码创建成功：' + newCode.code);
        fetchInviteCodes();
      } else {
        alert('创建失败，请重试');
      }
    } catch (error) {
      console.error('Failed to create code:', error);
      alert('创建失败，请重试');
    }
  };

  const handleDeleteCode = async (code: string) => {
    if (!confirm('确定要删除邀请码 ' + code + ' 吗？')) return;
    try {
      const response = await fetch('/api/admin/invite-codes?code=' + code, { method: 'DELETE' });
      if (response.ok) {
        fetchInviteCodes();
      } else {
        alert('删除失败，请重试');
      }
    } catch (error) {
      console.error('Failed to delete code:', error);
      alert('删除失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-black">Pluslink</Link>
          <span className="text-gray-600">管理后台</span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-8">邀请码管理</h1>
          <div className="flex gap-4 mb-8">
            <button onClick={() => handleCreateCode('company')} className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">生成企业端邀请码</button>
            <button onClick={() => handleCreateCode('intern')} className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">生成实习生端邀请码</button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">邀请码列表 ({inviteCodes.length})</h2>
          {loading ? (<p className="text-gray-600">加载中...</p>) : inviteCodes.length === 0 ? (<div className="text-center py-12"><p className="text-gray-600">暂无邀请码</p></div>) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold">邀请码</th>
                    <th className="text-left py-3 px-4 font-bold">类型</th>
                    <th className="text-left py-3 px-4 font-bold">状态</th>
                    <th className="text-left py-3 px-4 font-bold">使用人</th>
                    <th className="text-left py-3 px-4 font-bold">创建时间</th>
                    <th className="text-left py-3 px-4 font-bold">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {inviteCodes.map((code) => (
                    <tr key={code.code} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-mono font-bold text-lg">{code.code}</td>
                      <td className="py-3 px-4">{code.type === 'company' ? '企业端' : '实习生端'}</td>
                      <td className="py-3 px-4">{code.used ? (<span className="px-2 py-1 bg-gray-200 text-gray-700 text-sm">已使用</span>) : (<span className="px-2 py-1 bg-black text-white text-sm">未使用</span>)}</td>
                      <td className="py-3 px-4 text-gray-600">{code.usedBy || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{new Date(code.createdAt).toLocaleString('zh-CN')}</td>
                      <td className="py-3 px-4"><button onClick={() => handleDeleteCode(code.code)} className="text-red-600 hover:text-red-800 font-medium">删除</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
