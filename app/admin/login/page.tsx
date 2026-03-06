'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase() })
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        // 验证成功，跳转到管理后台
        router.push('/admin');
      } else {
        setError(data.error || '邀请码无效');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('验证失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 justify-center mb-8 hover:opacity-80 transition-opacity">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-10 w-10 object-contain" />
            <h1 className="text-[32px] font-bold text-black">Pluslink</h1>
          </Link>
          <h2 className="text-[24px] font-semibold text-black mb-2">管理后台登录</h2>
          <p className="text-[16px] text-[#666666]">请输入管理员邀请码</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[16px] p-8 shadow-sm">
          <div className="mb-6">
            <label className="block text-[16px] font-semibold text-black mb-3">
              管理员邀请码
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              maxLength={12}
              className="w-full px-4 py-4 text-center text-[20px] font-mono tracking-widest border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all bg-[#f7f7f7] focus:bg-white uppercase"
              placeholder="输入邀请码"
              autoFocus
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[16px] text-red-600 text-[16px]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full px-8 py-4 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all disabled:bg-[#e5e5e5] disabled:cursor-not-allowed"
          >
            {loading ? '验证中...' : '登录'}
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[16px] text-[#666666] hover:text-black transition-colors"
            >
              返回首页
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
