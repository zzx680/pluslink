'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InviteCode } from '@/lib/types';
import Button from '@/components/Button';

export default function AdminPage() {
  const router = useRouter();
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<'company' | 'intern' | 'admin' | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setAuthenticated(true);
          fetchInviteCodes();
        } else {
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

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

  const handleCreateCode = async (type: 'company' | 'intern' | 'admin') => {
    setCreating(type);
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
    } finally {
      setCreating(null);
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

  const handleLogout = async () => {
    if (!confirm('确定要退出登录吗？')) return;
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">验证中...</p>
        </div>
      </div>
    );
  }

  const unusedCodes = inviteCodes.filter(c => !c.used);
  const usedCodes = inviteCodes.filter(c => c.used);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-8 w-8 object-contain" />
            <span className="text-xl font-semibold text-gray-900">Pluslink</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">管理后台</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-12 animate-[fade-in_0.4s_ease-out]">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">PlusLink 管理后台</h1>
          <p className="text-sm text-gray-500">生成和管理校友端、实习生端、管理员访问邀请码</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 animate-[fade-in_0.5s_ease-out]">
          {[
            { label: '总计', value: inviteCodes.length },
            { label: '可用', value: unusedCodes.length },
            { label: '已用', value: usedCodes.length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-gray-200 px-6 py-5 hover:border-gray-300 transition-all duration-200">
              <div className="text-xs text-gray-500 mb-2">{label}</div>
              <div className="text-3xl font-semibold text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-12 animate-[fade-in_0.6s_ease-out]">
          <Button
            loading={creating === 'company'}
            onClick={() => handleCreateCode('company')}
          >
            {creating === 'company' ? '生成中' : '生成校友端邀请码'}
          </Button>
          <Button
            loading={creating === 'intern'}
            onClick={() => handleCreateCode('intern')}
          >
            {creating === 'intern' ? '生成中' : '生成实习生端邀请码'}
          </Button>
          <Button
            loading={creating === 'admin'}
            onClick={() => handleCreateCode('admin')}
            className="bg-red-600 hover:bg-red-700"
          >
            {creating === 'admin' ? '生成中' : '生成管理员邀请码'}
          </Button>
        </div>

        <div className="animate-[fade-in_0.7s_ease-out]">
          <h2 className="text-xl font-medium text-gray-900 mb-6">邀请码列表</h2>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <span className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
            </div>
          ) : inviteCodes.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-sm text-gray-500 mb-1">暂无邀请码</p>
              <p className="text-xs text-gray-400">点击上方按钮生成新的邀请码</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['邀请码', '类型', '状态', '使用人', '创建时间', '操作'].map((header) => (
                      <th key={header} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inviteCodes.map((code) => (
                    <tr key={code.code} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">{code.code}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          code.type === 'company' ? 'bg-gray-900 text-white' :
                          code.type === 'admin' ? 'bg-red-600 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {code.type === 'company' ? '校友端' : code.type === 'admin' ? '管理员' : '实习生端'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {code.used ? (
                          <span className="inline-flex px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">已使用</span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">可使用</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{code.usedBy || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(code.createdAt).toLocaleString('zh-CN', {
                          year: 'numeric', month: '2-digit', day: '2-digit',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteCode(code.code)}
                          className="btn text-sm text-gray-400 hover:text-red-600 transition-colors duration-150"
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
