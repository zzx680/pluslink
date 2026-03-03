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
            <span className="px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white text-sm font-medium tracking-wide">管理后台</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 标题和操作区 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2 tracking-tight">邀请码管理</h1>
              <p className="text-gray-500">生成和管理企业端、实习生端访问邀请码</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                <span className="text-gray-500">总计：</span>
                <span className="font-bold text-black ml-2">{inviteCodes.length}</span>
              </div>
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-green-600">可用：</span>
                <span className="font-bold text-green-700 ml-2">{unusedCodes.length}</span>
              </div>
              <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <span className="text-gray-500">已用：</span>
                <span className="font-bold text-gray-700 ml-2">{usedCodes.length}</span>
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="flex gap-4">
            <button
              onClick={() => handleCreateCode('company')}
              className="group flex-1 px-8 py-6 bg-black text-white font-medium hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-lg">生成企业端邀请码</span>
              </div>
            </button>
            <button
              onClick={() => handleCreateCode('intern')}
              className="group flex-1 px-8 py-6 bg-white border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-lg">生成实习生端邀请码</span>
              </div>
            </button>
          </div>
        </div>

        {/* 邀请码列表 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-black">邀请码列表</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
          </div>

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
          ) : inviteCodes.length === 0 ? (
            <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg mb-2">暂无邀请码</p>
              <p className="text-sm text-gray-400">点击上方按钮生成新的邀请码</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-bold text-sm text-gray-900 tracking-wide">邀请码</th>
                      <th className="text-left py-4 px-6 font-bold text-sm text-gray-900 tracking-wide">类型</th>
                      <th className="text-left py-4 px-6 font-bold text-sm text-gray-900 tracking-wide">状态</th>
                      <th className="text-left py-4 px-6 font-bold text-sm text-gray-900 tracking-wide">使用人</th>
                      <th className="text-left py-4 px-6 font-bold text-sm text-gray-900 tracking-wide">创建时间</th>
                      <th className="text-left py-4 px-6 font-bold text-sm text-gray-900 tracking-wide">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inviteCodes.map((code, index) => (
                      <tr
                        key={code.code}
                        className="group hover:bg-gray-50 transition-colors duration-200"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                            </div>
                            <span className="font-mono font-bold text-xl text-black tracking-wider">{code.code}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium ${
                            code.type === 'company'
                              ? 'bg-black text-white'
                              : 'bg-white border-2 border-black text-black'
                          }`}>
                            {code.type === 'company' ? '企业端' : '实习生端'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {code.used ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              已使用
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-subtle"></div>
                              可使用
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {code.usedBy || '-'}
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-sm">
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
                            className="group/btn px-4 py-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 font-medium text-sm transition-all duration-200 transform hover:scale-105"
                          >
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              删除
                            </div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
