'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    userType: 'intern' as 'intern' | 'company',
    inviteCode: '',
    displayName: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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

        if (data.user.userType === 'intern') {
          router.push('/intern');
        } else if (data.user.userType === 'company') {
          router.push('/company');
        }
      } else {
        setError(data.error || '登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('userId', data.userId);
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('userType', data.userType);

        if (data.userType === 'intern') {
          router.push('/intern');
        } else if (data.userType === 'company') {
          router.push('/company');
        }
      } else {
        setError(data.error || '注册失败');
      }
    } catch (error) {
      console.error('注册失败:', error);
      setError('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">
              {isLogin ? '登录' : '注册'}
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="请输入用户名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="请输入密码"
                />
              </div>
              <Button type="submit" loading={loading} className="w-full">
                {loading ? '登录中' : '登录'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  required
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="3-20位字母、数字"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  required
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="6-20位密码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                <input
                  type="password"
                  required
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="再次输入密码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户类型</label>
                <select
                  required
                  value={registerForm.userType}
                  onChange={(e) => setRegisterForm({ ...registerForm, userType: e.target.value as 'intern' | 'company' })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                >
                  <option value="intern">实习生</option>
                  <option value="company">企业/校友</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邀请码</label>
                <input
                  type="text"
                  required
                  value={registerForm.inviteCode}
                  onChange={(e) => setRegisterForm({ ...registerForm, inviteCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder="6位邀请码"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {registerForm.userType === 'intern' ? '姓名' : '公司名称'}
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.displayName}
                  onChange={(e) => setRegisterForm({ ...registerForm, displayName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  placeholder={registerForm.userType === 'intern' ? '请输入姓名' : '请输入公司名称'}
                />
              </div>
              <Button type="submit" loading={loading} className="w-full">
                {loading ? '注册中' : '注册'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? '还没有账号？' : '已有账号？'}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-1 text-blue-600 hover:underline font-medium"
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
