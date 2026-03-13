'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InviteCode } from '@/lib/types';
import Button from '@/components/Button';

interface DashboardData {
  totalInterns: number;
  totalJobs: number;
  newInternsThisWeek: number;
  newJobsThisWeek: number;
  totalInviteCodes: number;
  usedInviteCodes: number;
  weeklyInterns: { week: string; count: number }[];
  recentInterns: { id: string; name: string; position: string; baseLocation: string; createdAt: string }[];
  recentJobs: { id: string; companyName: string; title: string; baseLocation: string; createdAt: string }[];
}

type Tab = 'dashboard' | 'codes';

function StatCard({ label, value, sub, accent }: { label: string; value: number; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 transition-all duration-200 hover:shadow-sm ${accent ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-200'}`}>
      <div className={`text-xs font-medium uppercase tracking-wide mb-3 ${accent ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
      <div className={`text-4xl font-semibold mb-1 ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      {sub && <div className={`text-xs ${accent ? 'text-gray-400' : 'text-gray-400'}`}>{sub}</div>}
    </div>
  );
}

function MiniBarChart({ data }: { data: { week: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-gray-900 rounded-sm transition-all duration-500"
            style={{ height: `${Math.max((d.count / max) * 52, d.count > 0 ? 4 : 0)}px` }}
          />
        </div>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  if (days < 30) return `${Math.floor(days / 7)}周前`;
  return `${Math.floor(days / 30)}个月前`;
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<'company' | 'intern' | 'admin' | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth');
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthenticated(true);
        fetchAll();
      } else {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    }
  };

  const fetchAll = async () => {
    try {
      const [codesRes, dashRes] = await Promise.all([
        fetch('/api/admin/invite-codes'),
        fetch('/api/admin/dashboard'),
      ]);
      setInviteCodes(await codesRes.json());
      setDashboard(await dashRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async (type: 'company' | 'intern' | 'admin') => {
    setCreating(type);
    try {
      const res = await fetch('/api/admin/invite-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const newCode = await res.json();
        alert('邀请码创建成功：' + newCode.code);
        fetchAll();
      } else {
        alert('创建失败，请重试');
      }
    } catch {
      alert('创建失败，请重试');
    } finally {
      setCreating(null);
    }
  };

  const handleDeleteCode = async (code: string) => {
    if (!confirm('确定要删除邀请码 ' + code + ' 吗？')) return;
    try {
      const res = await fetch('/api/admin/invite-codes?code=' + code, { method: 'DELETE' });
      if (res.ok) fetchAll();
      else alert('删除失败，请重试');
    } catch {
      alert('删除失败，请重试');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const unusedCodes = inviteCodes.filter(c => !c.used);
  const usedCodes = inviteCodes.filter(c => c.used);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <img src="/pluslink logo.png" alt="PlusLink" className="h-7 w-7 object-contain" />
            <span className="text-xl font-semibold text-gray-900">Pluslink</span>
          </Link>
          <div className="flex items-center gap-6">
            {/* Tab 切换 */}
            <nav className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {([
                { key: 'dashboard', label: 'Dashboard' },
                { key: 'codes', label: '邀请码管理' },
              ] as { key: Tab; label: string }[]).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`btn px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">管理后台</span>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ── Dashboard Tab ── */}
        {tab === 'dashboard' && (
          <div className="animate-[fade-in_0.4s_ease-out]">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">数据概览</h1>
              <p className="text-sm text-gray-500 mt-1">PlusLink 平台实时数据</p>
            </div>

            {loading || !dashboard ? (
              <div className="flex items-center justify-center py-32">
                <span className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* 核心指标 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="实习生总数" value={dashboard.totalInterns} sub="累计注册" accent />
                  <StatCard label="职位总数" value={dashboard.totalJobs} sub="累计发布" />
                  <StatCard label="本周新增实习生" value={dashboard.newInternsThisWeek} sub="过去7天" />
                  <StatCard label="本周新增职位" value={dashboard.newJobsThisWeek} sub="过去7天" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 实习生增长趋势 */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-base font-semibold text-gray-900">实习生增长趋势</h2>
                        <p className="text-xs text-gray-400 mt-0.5">过去8周</p>
                      </div>
                      <span className="text-2xl font-semibold text-gray-900">{dashboard.totalInterns}</span>
                    </div>
                    <MiniBarChart data={dashboard.weeklyInterns} />
                    <div className="flex justify-between mt-2">
                      {dashboard.weeklyInterns.map((d, i) => (
                        <span key={i} className="text-[10px] text-gray-400 flex-1 text-center">{d.week}</span>
                      ))}
                    </div>
                  </div>

                  {/* 邀请码使用情况 */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-6">邀请码使用情况</h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-500">已使用</span>
                          <span className="font-medium text-gray-900">{usedCodes.length}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-900 rounded-full transition-all duration-700"
                            style={{ width: `${dashboard.totalInviteCodes > 0 ? (usedCodes.length / dashboard.totalInviteCodes) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-gray-500">可使用</span>
                          <span className="font-medium text-gray-900">{unusedCodes.length}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-700"
                            style={{ width: `${dashboard.totalInviteCodes > 0 ? (unusedCodes.length / dashboard.totalInviteCodes) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">总计</span>
                          <span className="font-semibold text-gray-900">{dashboard.totalInviteCodes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 最近注册实习生 */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-5">最近注册实习生</h2>
                    {dashboard.recentInterns.length === 0 ? (
                      <p className="text-sm text-gray-400 py-8 text-center">暂无数据</p>
                    ) : (
                      <div className="space-y-3">
                        {dashboard.recentInterns.map((intern) => (
                          <div key={intern.id} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                              {intern.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{intern.name}</p>
                              <p className="text-xs text-gray-400 truncate">{intern.position} · {intern.baseLocation}</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">{timeAgo(intern.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 最近发布职位 */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-5">最近发布职位</h2>
                    {dashboard.recentJobs.length === 0 ? (
                      <p className="text-sm text-gray-400 py-8 text-center">暂无数据</p>
                    ) : (
                      <div className="space-y-3">
                        {dashboard.recentJobs.map((job) => (
                          <div key={job.id} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 text-sm font-semibold shrink-0">
                              {job.companyName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                              <p className="text-xs text-gray-400 truncate">{job.companyName} · {job.baseLocation}</p>
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">{timeAgo(job.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 邀请码管理 Tab ── */}
        {tab === 'codes' && (
          <div className="animate-[fade-in_0.4s_ease-out]">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">邀请码管理</h1>
              <p className="text-sm text-gray-500 mt-1">生成和管理各端访问邀请码</p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: '总计', value: inviteCodes.length },
                { label: '可用', value: unusedCodes.length },
                { label: '已用', value: usedCodes.length },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
                  <div className="text-xs text-gray-500 mb-2">{label}</div>
                  <div className="text-3xl font-semibold text-gray-900">{value}</div>
                </div>
              ))}
            </div>

            {/* 生成按钮 */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              <Button loading={creating === 'company'} onClick={() => handleCreateCode('company')}>
                {creating === 'company' ? '生成中' : '生成校友端邀请码'}
              </Button>
              <Button loading={creating === 'intern'} onClick={() => handleCreateCode('intern')}>
                {creating === 'intern' ? '生成中' : '生成实习生端邀请码'}
              </Button>
              <Button loading={creating === 'admin'} onClick={() => handleCreateCode('admin')} className="bg-red-600 hover:bg-red-700">
                {creating === 'admin' ? '生成中' : '生成管理员邀请码'}
              </Button>
            </div>

            {/* 邀请码列表 */}
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <span className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
              </div>
            ) : inviteCodes.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                <p className="text-sm text-gray-500">暂无邀请码</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['邀请码', '类型', '状态', '使用人', '创建时间', '操作'].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
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
                          {code.used
                            ? <span className="inline-flex px-2.5 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">已使用</span>
                            : <span className="inline-flex px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">可使用</span>
                          }
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{code.usedBy || '-'}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(code.createdAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => handleDeleteCode(code.code)} className="btn text-sm text-gray-400 hover:text-red-600 transition-colors duration-150">
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
        )}
      </main>
    </div>
  );
}
