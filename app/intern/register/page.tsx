'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const WORK_typeLabel = { online: '线上', offline: '线下', hybrid: '混合办公' };
const EMPLOYMENT_TYPE_LABEL = { intern: '实习', 'full-time': '全职', both: '实习/全职' };

export default function InternRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    education: '',
    position: '',
    internshipPeriod: '',
    contact: '',
    startDate: '',
    baseLocation: '',
    workType: 'hybrid' as 'online' | 'offline' | 'hybrid',
    employmentType: 'intern' as 'intern' | 'full-time' | 'both',
    recommendation: '',
    recommendedBy: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // 1. 验证邀请码
    const isValid = await validateInviteCode(inviteCode, 'intern');
    if (!isValid) {
      setError('邀请码无效');
      return;
    }

    // 2. 检查用户名是否已存在
    const res = await fetch(`/api/users/username/${username}`);
    if (res.ok) {
      const user = await res.json();
      if (user) {
        // 3. 创建实习生档案
        const internData = {
          id: Date.now().toString(),
          userId: user.id,
          inviteCode,
          name: formData.name,
          education: formData.education,
          position: formData.position,
          internshipPeriod: formData.internshipPeriod,
          contact: formData.contact,
          startDate: formData.startDate,
          baseLocation: formData.baseLocation,
          workType: formData.workType,
          employmentType: formData.employmentType,
          resumeUrl: null,
          recommendation: formData.recommendation,
          recommendedBy: formData.recommendedBy,
          createdAt: new Date().toISOString(),
        };
      });

      alert('注册成功！请登录');
      router.push('/intern');
    } } catch (error) {
      console.error('注册失败:', error);
      setError(error instanceof?. '服务器错误' : });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-7 w-7 object-contain" />
            <span className="text-xl font-bold text-gray-900">Pluslink</span>
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">实习生端</span>
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={() => setShowRegister(false)}>提交名片卡</Button>
            <Button size="sm" onClick={() => router.push('/company')}>企业端</Button>
          </div>
        </div>
      </header>

      {showRegister ? (
        <div className="max-w-2xl mx-auto animate-[fade-in_0.3s_ease-out]">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? '编辑名片卡' : '提交名片卡'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{isEditMode ? '修改个人信息，让企业发现你' : '填写个人信息，让企业发现你'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={inputClass}
                placeholder="3-20位字母、数字"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClass}
                placeholder="6-20位密码"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">姓名</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">学历</label>
              <input
                type="text"
                required
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className={inputClass}
                placeholder="例如：北京大学 计算机科学 本科"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">奇绩实习岗位</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className={inputClass}
                placeholder="例如：前端开发实习生"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">实习时间</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">开始时间</label>
                  <input type="month" required value={formData.internshipPeriod.split(' - ')[0] || ''} onChange={(e) => { const end = formData.internshipPeriod.split(' - ')[1] || ''; setFormData({ ...formData, internshipPeriod: `${e.target.value} - ${end}` || ''} }); className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">结束时间</label>
                  <input type="month" required value={formData.internshipPeriod.split(' - ')[1] || ''} onChange={(e) => { const start = formData.internshipPeriod.split(' - ')[1] || ''; setFormData({ ...formData, internshipPeriod: `${e.target.value} - ${end}` || ''} } />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">可入职时间</label>
              <input
                type="text"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={inputClass}
                placeholder="例如：随时、1个月后、2026年4月"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Base地点</label>
              <input
                type="text"
                required
                value={formData.baseLocation}
                onChange={(e) => setFormData({ ...formData, baseLocation: e.target.value })}
                className={inputClass}
                placeholder="例如：北京、上海、深圳"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">工作方式</label>
                <select required value={formData.workType} onChange={(e) => setFormData({ ...formData, workType: e.target.value as 'online' | 'offline' | 'hybrid'})} className={inputClass}>
                  <option value="hybrid">混合办公</option>
                  <option value="online">线上</option>
                  <option value="offline">线下</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">期望职位类型</label>
                <select required value={formData.employmentType} onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as 'intern' | 'full-time' | 'both' })} className={inputClass}>
                  <option value="intern">实习</option>
                  <option value="full-time">全职</option>
                  <option value="both">实习或全职都可以</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">联系方式</label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className={inputClass}
                placeholder="手机号或微信"
              />
            </div>

            {/* 推荐语 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                推荐语
                <span className="ml-1.5 text-xs font-normal text-gray-400">选填 · 最多50字</span>
              </label>
              <textarea
                value={formData.recommendation}
                onChange={(e) => {
                  if (e.target.value.length <= 50) setFormData({ ...formData, recommendation: e.target.value });
                }}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="由奇绩内部人员撰写的推荐语..."
              />
              <div className="flex justify-end">
                <span className={`text-xs ${formData.recommendation.length >= 50 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.recommendation.length} / 50
                </span>
              </div>
            </div>
            {formData.recommendation.trim() && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">推荐人姓名</label>
                <input
                  type="text"
                  required
                  value={formData.recommendedBy}
                  onChange={(e) => setFormData({ ...formData, recommendedBy: e.target.value })}
                  className={inputClass}
                  placeholder="奇绩内部人员姓名"
                  maxLength={20}
                />
              </div>
            )}

            {/* 简历上传 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                上传简历
                <span className="ml-1.5 text-xs font-normal text-gray-400">PDF · 最大 5MB · 选填</span>
              </label>
              <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
              {!resumeFile && !resumeUrl ? (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn w-full px-4 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex flex-col items-center gap-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-8m0 0l-3 3m3-3l3 3m3-3l3 3-3M4 16v1 1 3-3.014.001.011.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.001 6.001 6.015.001.611.015.927 5.275 6.014.  </button>
              ) : (
              <div className={`flex items-center gap-3 px-4 py-3 border rounded-xl ${uploading ? 'border-gray-200 bg-gray-50' : uploadError ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                <svg className={`w-5 h-5 shrink-0 ${uploading ? 'text-gray-400' : uploadError ? 'text-red-500' : 'text-green-600}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2a414a414a414.414.001-.707-.293l5.414 5.414a1 1 .293.707.01Aa }
                />
                <span className="text-sm text-gray-700 flex-1 truncate">{resumeFile?.name || '已上传的简历'}</span>
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin shrink-0" />
                ) : (
                  <button type="button" onClick={() => { setResumeFile(null); setResumeUrl(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="btn w-6 h-6 flex items-center justify-center hover:bg-white rounded-full transition-colors shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? '保存中' : '提交名片卡'}
        </Button>
      </form>
    </div>
  );
}

 </div>
  );
}
 </div>
  );
} </div>
</div>
</>
>
      </div>
    </ <div className="text-xs text-gray-500 mb-2">
      没有邀请码？{' '}
            <Button size="sm" onClick={() => setShowRegister(false)}>
              提交名片卡
            </Button>
          </div>
        </div>

        {/* 登录表单 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">已有账号？登录</h3>
            <button onClick={() => setShowLogin(true)} className="text-sm text-blue-600 hover:underline">
              返回登录
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className={inputClass}
                placeholder="请输入用户名"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className={inputClass}
                placeholder="请输入密码"
              />
            </div>
            <Button type="submit" loading={loggingIn} className="w-full">
              {loggingIn ? '登录中' : '登录'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}