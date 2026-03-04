'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center px-8 py-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-[48px] font-bold text-black mb-4 tracking-tight">
          Pluslink
        </h1>
        <p className="text-[16px] text-[#666666] mb-16">
          奇绩创坛校友招聘平台
        </p>

        <div className="flex gap-8 justify-center mb-24">
          <button
            onClick={() => handleEnter('company')}
            className="px-12 py-6 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all duration-200"
          >
            企业端
          </button>
          <button
            onClick={() => handleEnter('intern')}
            className="px-12 py-6 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all duration-200"
          >
            实习生端
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-[16px] p-8 shadow-sm">
            <div className="w-12 h-12 bg-black rounded-[8px] mb-6"></div>
            <h3 className="text-[20px] font-semibold text-black mb-4">企业发布职位</h3>
            <ul className="text-left space-y-3 text-[16px] text-[#666666]">
              <li>• 发布招聘需求</li>
              <li>• 查看实习生简历</li>
              <li>• 直接联系候选人</li>
            </ul>
          </div>

          <div className="bg-white rounded-[16px] p-8 shadow-sm">
            <div className="w-12 h-12 bg-black rounded-[8px] mb-6"></div>
            <h3 className="text-[20px] font-semibold text-black mb-4">实习生提交简历</h3>
            <ul className="text-left space-y-3 text-[16px] text-[#666666]">
              <li>• 提交个人名片</li>
              <li>• 浏览职位机会</li>
              <li>• 获得工作推荐</li>
            </ul>
          </div>

          <div className="bg-white rounded-[16px] p-8 shadow-sm">
            <div className="w-12 h-12 bg-black rounded-[8px] mb-6"></div>
            <h3 className="text-[20px] font-semibold text-black mb-4">精准匹配</h3>
            <ul className="text-left space-y-3 text-[16px] text-[#666666]">
              <li>• 奇绩校友网络</li>
              <li>• 高质量人才库</li>
              <li>• 快速对接沟通</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <Link href="/admin" className="text-[16px] text-[#666666] hover:text-black transition-colors">
            管理后台
          </Link>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-8 z-50 animate-fade-in">
          <div className="bg-white rounded-[16px] p-12 max-w-md w-full shadow-xl">
            <h2 className="text-[32px] font-bold text-black mb-2">输入邀请码</h2>
            <p className="text-[16px] text-[#666666] mb-8">
              请输入6位邀请码访问{userType === 'company' ? '企业端' : '实习生端'}
            </p>

            <div className="space-y-6">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
                maxLength={6}
                className="w-full px-6 py-4 text-center text-2xl font-mono tracking-widest border-2 border-[#e5e5e5] rounded-[16px] focus:border-black focus:outline-none transition-all bg-[#f7f7f7] focus:bg-white"
                placeholder="••••••"
                autoFocus
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-[16px] text-red-600 px-4 py-3 text-[16px]">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleVerifyCode}
                  disabled={verifying || inviteCode.length !== 6}
                  className="flex-1 px-6 py-4 bg-black text-white text-[16px] font-semibold rounded-[16px] hover:bg-[#333] transition-all disabled:bg-[#e5e5e5] disabled:cursor-not-allowed"
                >
                  {verifying ? '验证中...' : '验证并进入'}
                </button>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteCode('');
                    setError('');
                  }}
                  className="flex-1 px-6 py-4 bg-white text-black text-[16px] font-semibold border-2 border-[#e5e5e5] rounded-[16px] hover:border-black transition-all"
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
