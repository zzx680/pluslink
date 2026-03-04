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
      const response = await fetch('/api/admin/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
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

  const unusedCodes = inviteCodes.filter(c => !c.used);
  const usedCodes = inviteCodes.filter(c => c.used);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <header className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="text-[20px] font-semibold text-black">
            Pluslink
          </Link>
          <span className="px-4 py-2 bg-black text-white text-[16px] font-semibold rounded-[8px]">管理后台</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h1 className="text-[48px] font-bold text-black mb-2">邀请码管理</h1>
              <p className="text-[16px] text-[#666666]">生成和管理企业端、实习生端访问邀请码</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-[16px] px-6 py-3 shadow-sm">
                <div className="text-[16px] text-[#666666]">总计</div>
                <div className="text-[32px] font-bold text-black">{inviteCodes.length}</div>
              </div>
              <div className="bg-white rounded-[16px] px-6 py-3 shadow-sm">
                <div className="text-[16px] text-[#666666]">可用</div>
                <div className="text-[32px] font-bold text-black">{unusedCodes.length}</div>
              </div>
              <div className="bg-white rounded-[16px] px-6 py-3 shadow-sm">
                <div className="text-[16px] text-[#666666]">已用</div>
                <div className="text-[32px] font-bold text-black">{usedCodes.length}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <button
              onClick={() => handleCreateCode('company')}
              className="flex-1 px-8 py-6 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all"
            >
              生成企业端邀请码
            </button>
            <button
              onClick={() => handleCreateCode('intern')}
              className="flex-1 px-8 py-6 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all"
            >
              生成实习生端邀请码
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-[32px] font-bold text-black mb-8">邀请码列表</h2>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-[16px] text-[#666666]">加载中...</div>
            </div>
          ) : inviteCodes.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[16px] border-2 border-dashed border-[#e5e5e5]">
              <p className="text-[16px] text-[#666666] mb-2">暂无邀请码</p>
              <p className="text-[16px] text-[#666666]">点击上方按钮生成新的邀请码</p>
            </div>
          ) : (
            <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#f7f7f7] border-b border-[#e5e5e5]">
                  <tr>
                    <th className="text-left py-4 px-6 text-[16px] font-semibold text-black">邀请码</th>
                    <th className="text-left py-4 px-6 text-[16px] font-semibold text-black">类型</th>
                    <th className="text-left py-4 px-6 text-[16px] font-semibold text-black">状态</th>
                    <th className="text-left py-4 px-6 text-[16px] font-semibold text-black">使用人</th>
                    <th className="text-left py-4 px-6 text-[16px] font-semibold text-black">创建时间</th>
                    <th className="text-left py-4 px-6 text-[16px] font-semibold text-black">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e5e5]">
                  {inviteCodes.map((code) => (
                    <tr
                      key={code.code}
                      className="hover:bg-[#f7f7f7] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-[20px] font-bold text-black">{code.code}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 text-[16px] font-semibold rounded-[8px] ${
                          code.type === 'company'
                            ? 'bg-black text-white'
                            : 'bg-[#f7f7f7] text-black'
                        }`}>
                          {code.type === 'company' ? '企业端' : '实习生端'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {code.used ? (
                          <span className="inline-flex px-3 py-1 bg-[#f7f7f7] text-[#666666] text-[16px] font-semibold rounded-[8px]">
                            已使用
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 bg-black text-white text-[16px] font-semibold rounded-[8px]">
                            可使用
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-[16px] text-[#666666]">
                        {code.usedBy || '-'}
                      </td>
                      <td className="py-4 px-6 text-[16px] text-[#666666]">
                        {new Date(code.createdAt).toLocaleString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDeleteCode(code.code)}
                          className="px-4 py-2 text-[16px] text-[#666666] hover:text-black font-semibold transition-colors"
                        >
                          删除
                        </button>
                      </td>
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
