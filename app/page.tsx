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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-black mb-4">Pluslink</h1>
        <p className="text-xl text-gray-600 mb-16">奇绩创坛校友招聘平台</p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <button onClick={() => handleEnter('company')} className="group px-12 py-6 bg-black text-white text-lg font-medium hover:bg-gray-800 transition-all">
            <div className="flex items-center gap-3"><span>企业端</span></div>
          </button>
          <button onClick={() => handleEnter('intern')} className="group px-12 py-6 bg-white text-black text-lg font-medium border-2 border-black hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3"><span>实习生端</span></div>
          </button>
        </div>
        <div className="text-sm text-gray-400 space-y-2">
          <p>内测版本 · 需要邀请码才能访问</p>
          <Link href="/admin" className="text-gray-600 hover:text-black underline">管理后台</Link>
        </div>
      </div>
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-2">输入邀请码</h2>
            <p className="text-gray-600 mb-6">请输入6位邀请码访问{userType === 'company' ? '企业端' : '实习生端'}</p>
            <input type="text" value={inviteCode} onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setError(''); }} onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()} maxLength={6} className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 focus:border-black focus:outline-none mb-4" placeholder="XXXXXX" autoFocus />
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <div className="flex gap-4">
              <button onClick={handleVerifyCode} disabled={verifying || inviteCode.length !== 6} className="flex-1 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">{verifying ? '验证中...' : '验证'}</button>
              <button onClick={() => { setShowInviteModal(false); setInviteCode(''); setError(''); }} className="flex-1 px-6 py-3 bg-white text-black border border-gray-300 font-medium hover:bg-gray-50 transition-colors">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
