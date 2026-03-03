'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [userType, setUserType] = useState<'company' | 'intern' | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleEnter = (type: 'company' | 'intern') => {
    setUserType(type);
    setShowInviteModal(true);
    setInviteCode('');
    setError('');
  };

  const handleVerifyCode = async () => {
    if (!inviteCode.trim()) {
      setError('请输入邀请码');
      return;
    }
    setVerifying(true);
    setError('');
    try {
      const response = await fetch('/api/invite/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCode.toUpperCase(), type: userType }),
      });
      const data = await response.json();
      if (data.valid) {
        setShowInviteModal(false);
        router.push(`/${userType}`);
      } else {
        setError(data.error || '邀请码无效或已使用');
      }
    } catch (error) {
      console.error('验证失败:', error);
      setError('验证失败，请重试');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-black opacity-[0.02] rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-[0.02] rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Logo 区域 */}
        <div className="mb-12 flex justify-center">
          <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center shadow-2xl shadow-black/10 hover:shadow-black/20 transition-all duration-500 hover:scale-105">
            {/* 这里放置logo图片，暂时用占位符 */}
            <div className="w-16 h-16 border-4 border-white rounded-xl"></div>
          </div>
        </div>

        {/* 标题区域 */}
        <div className="mb-16 space-y-4">
          <h1 className="text-7xl font-bold text-black tracking-tight mb-6 animate-fade-in">
            Pluslink
          </h1>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-black to-transparent mx-auto mb-6"></div>
          <p className="text-2xl text-gray-500 font-light tracking-wide">
            奇绩创坛校友招聘平台
          </p>
        </div>

        {/* 按钮区域 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <button
            onClick={() => handleEnter('company')}
            className="group relative px-14 py-7 bg-black text-white text-lg font-medium overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-3">
              <span className="tracking-wide">企业端</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </button>

          <button
            onClick={() => handleEnter('intern')}
            className="group relative px-14 py-7 bg-white text-black text-lg font-medium border-2 border-black overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-black/20"
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-3">
              <span className="tracking-wide">实习生端</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </button>
        </div>

        {/* 底部信息 */}
        <div className="text-sm text-gray-400 space-y-3">
          <p className="tracking-wider">内测版本 · 需要邀请码才能访问</p>
          <Link href="/admin" className="inline-block text-gray-500 hover:text-black transition-colors duration-300 border-b border-gray-300 hover:border-black pb-1">
            管理后台
          </Link>
        </div>
      </div>
      {/* 邀请码验证弹窗 */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white p-10 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.01]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">输入邀请码</h2>
              <p className="text-gray-500 text-sm tracking-wide">
                请输入6位邀请码访问{userType === 'company' ? '企业端' : '实习生端'}
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
                  maxLength={6}
                  className="w-full px-6 py-4 text-center text-3xl font-mono tracking-widest border-2 border-gray-200 focus:border-black focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  placeholder="••••••"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm animate-shake">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleVerifyCode}
                  disabled={verifying || inviteCode.length !== 6}
                  className="flex-1 px-6 py-4 bg-black text-white font-medium hover:bg-gray-900 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:transform-none"
                >
                  {verifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      验证中
                    </span>
                  ) : '验证并进入'}
                </button>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteCode('');
                    setError('');
                  }}
                  className="flex-1 px-6 py-4 bg-white text-black border-2 border-gray-200 font-medium hover:border-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
