'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function Home() {
  const router = useRouter();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [userType, setUserType] = useState<'company' | 'intern' | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [shakeError, setShakeError] = useState(false);

  // 登录表单
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loggingIn, setLoggingIn] = useState(false);

  // 注册表单
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [registering, setRegistering] = useState(false);

  const handleStartClick = () => setShowRoleModal(true);

  // 处理登录
  const handleLogin = async () => {
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError('请输入用户名和密码');
      triggerShake();
      return;
    }

    setLoggingIn(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('userId', data.user.userId);
        sessionStorage.setItem('username', data.user.username);
        sessionStorage.setItem('userType', data.user.userType);
        sessionStorage.setItem('displayName', data.user.displayName);
        setShowLoginModal(false);

        // 根据用户类型跳转
        if (data.user.userType === 'intern') {
          router.push('/intern');
        } else if (data.user.userType === 'company') {
          router.push('/company');
        } else if (data.user.userType === 'admin') {
          router.push('/admin');
        }
      } else {
        setError(data.error || '登录失败');
        triggerShake();
      }
    } catch (error) {
      console.error('登录失败:', error);
      setError('登录失败，请重试');
      triggerShake();
    } finally {
      setLoggingIn(false);
    }
  };

  // 处理注册
  const handleRegister = async () => {
    if (!registerForm.username.trim() || !registerForm.password.trim()) {
      setError('请输入用户名和密码');
      triggerShake();
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('两次输入的密码不一致');
      triggerShake();
      return;
    }

    if (!registerForm.displayName.trim()) {
      setError('请输入姓名');
      triggerShake();
      return;
    }

    setRegistering(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registerForm,
          userType,
          inviteCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('userType', userType!);
        sessionStorage.setItem('displayName', registerForm.displayName);
        sessionStorage.setItem('inviteCode', inviteCode.toUpperCase());
        setShowRegisterModal(false);

        // 跳转到填写个人资料页面
        if (userType === 'intern') {
          router.push('/intern');
        } else if (userType === 'company') {
          router.push('/company');
        }
      } else {
        setError(data.error || '注册失败');
        triggerShake();
      }
    } catch (error) {
      console.error('注册失败:', error);
      setError('注册失败，请重试');
      triggerShake();
    } finally {
      setRegistering(false);
    }
  };

  const handleRoleSelect = (type: 'company' | 'intern') => {
    setUserType(type);
    setShowRoleModal(false);
    setShowInviteModal(true);
    setInviteCode('');
    setError('');
  };

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 400);
  };

  const handleVerifyCode = async () => {
    if (!inviteCode.trim()) {
      setError('请输入邀请码');
      triggerShake();
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
        // 验证通过后显示注册表单
        setShowRegisterModal(true);
      } else {
        setError(data.error || '邀请码无效或已使用');
        triggerShake();
      }
    } catch (error) {
      console.error('验证失败:', error);
      setError('验证失败，请重试');
      triggerShake();
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-7 w-7 object-contain" />
            <span className="text-xl font-semibold text-gray-900">PlusLink</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
              登录
            </Link>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">
              管理后台
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center py-16 animate-[fade-in_0.5s_ease-out]">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-16 w-16 object-contain" />
            <h1 className="text-5xl font-semibold text-gray-900">奇绩创坛 PlusLink</h1>
          </div>
          <p className="text-xl text-gray-500 mb-12">一个低噪音的校友招聘系统</p>
          <button
            onClick={handleStartClick}
            className="group relative px-8 py-3.5 bg-black/80 backdrop-blur-xl text-white text-base font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-105 active:scale-95 border border-white/10"
          >
            <span className="relative z-10">开始使用</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>

        <div className="py-16">
          <h2 className="text-xl font-medium text-gray-900 mb-8 text-center">如何使用</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '1', title: '校友创建职位', desc: '奇绩校友企业发布招聘需求，寻找优秀人才' },
              { n: '2', title: '实习生提交简历', desc: '离职实习生提交个人信息，展示工作经历' },
              { n: '3', title: '快速匹配对接', desc: '基于校友信任网络，高效完成人才对接' },
            ].map(({ n, title, desc }) => (
              <div
                key={n}
                className="rounded-2xl border border-gray-200 p-8 hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gray-900 rounded-xl mb-6 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{n}</span>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showRoleModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-8 z-50 backdrop-blur-sm"
          onClick={() => setShowRoleModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl animate-[modal-in_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">请选择您的身份</h2>
            <div className="space-y-3">
              {[
                { type: 'company' as const, label: '我是校友' },
                { type: 'intern' as const, label: '我是实习生' },
              ].map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => handleRoleSelect(type)}
                  className="btn w-full p-4 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-150 text-left"
                >
                  <h3 className="text-base font-medium text-gray-900">{label}</h3>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setShowRoleModal(false)}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-8 z-50 backdrop-blur-sm"
          onClick={() => { setShowLoginModal(false); setError(''); }}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl animate-[modal-in_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">登录</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => { setLoginForm({ ...loginForm, username: e.target.value }); setError(''); }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="请输入用户名"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="请输入密码"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl text-red-600 px-4 py-2 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={handleLogin} loading={loggingIn} className="flex-1">
                  {loggingIn ? '登录中' : '登录'}
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => { setShowLoginModal(false); setError(''); }}>
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-8 z-50 backdrop-blur-sm"
          onClick={() => { setShowRegisterModal(false); setError(''); }}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl animate-[modal-in_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">创建账号</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">邀请码验证通过，请设置登录信息</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {userType === 'intern' ? '姓名' : '公司名称'}
                </label>
                <input
                  type="text"
                  value={registerForm.displayName}
                  onChange={(e) => {
                    setRegisterForm({
                      ...registerForm,
                      displayName: e.target.value,
                      username: e.target.value
                    });
                    setError('');
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder={userType === 'intern' ? '请输入姓名' : '请输入公司名称'}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => { setRegisterForm({ ...registerForm, password: e.target.value }); setError(''); }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="6-20位密码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => { setRegisterForm({ ...registerForm, confirmPassword: e.target.value }); setError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="再次输入密码"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl text-red-600 px-4 py-2 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={handleRegister} loading={registering} className="flex-1">
                  {registering ? '注册中' : '完成注册'}
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => { setShowRegisterModal(false); setError(''); }}>
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-8 z-50 backdrop-blur-sm"
          onClick={() => { setShowInviteModal(false); setInviteCode(''); setError(''); }}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl animate-[modal-in_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">输入邀请码</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              请输入6位邀请码访问{userType === 'company' ? '校友端' : '实习生端'}
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                maxLength={6}
                className={`w-full px-4 py-3 text-center text-xl font-mono tracking-widest border rounded-xl focus:outline-none transition-all duration-200 text-gray-900 ${
                  error ? 'border-red-300 bg-red-50 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'
                } ${shakeError ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
                placeholder="••••••"
                autoFocus
              />
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl text-red-600 px-4 py-2 text-sm text-center animate-[fade-in_0.2s_ease-out]">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={handleVerifyCode}
                  loading={verifying}
                  disabled={verifying || inviteCode.length !== 6}
                  className="flex-1"
                >
                  {verifying ? '验证中' : '验证并进入'}
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => { setShowInviteModal(false); setInviteCode(''); setError(''); }}
                >
                  取消
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
