'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Job, Intern } from '@/lib/types';
import Button from '@/components/Button';

const WORK_TYPE_LABEL = { online: '线上', offline: '线下', hybrid: '混合' };
const EMPLOYMENT_TYPE_LABEL = { intern: '实习', 'full-time': '全职', both: '实习/全职' };

// 为每个公司生成一致的渐变色
const getCompanyGradient = (companyName: string) => {
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-cyan-500',
    'from-violet-500 to-purple-500',
    'from-amber-500 to-orange-500',
    'from-lime-500 to-green-500',
  ];
  const hash = companyName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

// Mercor 风格的职位卡片
function JobCardMercor({ job, onClick }: { job: Job; onClick: () => void }) {
  const gradient = getCompanyGradient(job.companyName);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      {/* 公司 Logo/首字母 */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg font-bold mb-4 shadow-lg`}>
        {job.companyName.charAt(0)}
      </div>

      {/* 公司名称 */}
      <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
        {job.companyName}
      </div>

      {/* 职位标题 */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
        {job.title}
      </h3>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
          job.employmentType === 'intern'
            ? 'bg-purple-100 text-purple-700'
            : job.employmentType === 'full-time'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-indigo-100 text-indigo-700'
        }`}>
          {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
        </span>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
          job.workType === 'online'
            ? 'bg-green-100 text-green-700'
            : job.workType === 'offline'
            ? 'bg-orange-100 text-orange-700'
            : 'bg-cyan-100 text-cyan-700'
        }`}>
          {WORK_TYPE_LABEL[job.workType]}
        </span>
      </div>

      {/* 地点 */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">{job.baseLocation}</span>
      </div>

      {/* 查看详情按钮 */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          <span>查看详情</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// 职位详情模态框
function JobDetailModal({ job, onClose }: { job: Job; onClose: () => void }) {
  const gradient = getCompanyGradient(job.companyName);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl animate-[modal-in_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 px-8 py-6 flex items-start justify-between">
          <div className="flex-1 pr-8">
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                {job.companyName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">{job.companyName}</div>
                <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-lg shadow-sm ${
                job.employmentType === 'intern'
                  ? 'bg-purple-100 text-purple-700'
                  : job.employmentType === 'full-time'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}>
                {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
              </span>
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-lg shadow-sm ${
                job.workType === 'online'
                  ? 'bg-green-100 text-green-700'
                  : job.workType === 'offline'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-cyan-100 text-cyan-700'
              }`}>
                {WORK_TYPE_LABEL[job.workType]}
              </span>
              <span className="px-3 py-1.5 bg-pink-100 text-pink-700 text-sm font-semibold rounded-lg flex items-center gap-1.5 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.baseLocation}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn w-10 h-10 flex items-center justify-center hover:bg-white/80 rounded-full transition-colors shrink-0"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] px-8 py-6">
          <div className="space-y-8">
            {/* 职位描述 */}
            {job.description && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                  职位描述
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                  {job.description}
                </div>
              </div>
            )}

            {/* 任职要求 */}
            {job.requirements && job.requirements !== job.description && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full"></span>
                  任职要求
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px]">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* 联系方式 */}
            <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg`}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                联系方式
              </h3>
              <div className="text-white text-lg font-semibold">{job.contact}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InternPageV2() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEmployment, setFilterEmployment] = useState<'all' | 'intern' | 'full-time'>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取所有地点
  const locations = Array.from(new Set(jobs.map(j => j.baseLocation))).filter(l => l !== '未指定');

  // 筛选职位
  const filteredJobs = jobs.filter(j => {
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase()) ||
      j.baseLocation.toLowerCase().includes(search.toLowerCase());
    const matchEmployment = filterEmployment === 'all' || j.employmentType === filterEmployment;
    const matchLocation = filterLocation === 'all' || j.baseLocation === filterLocation;
    return matchSearch && matchEmployment && matchLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all">
              Pluslink
            </Link>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-lg">
                实习生端
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            发现机会
          </h1>
          <p className="text-gray-600 text-lg">
            <span className="font-semibold text-blue-600">{filteredJobs.length}</span> 个职位正在招聘
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 p-6 mb-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索职位、公司或地点..."
                  className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none transition-all bg-white shadow-sm"
                />
              </div>
            </div>

            {/* 职位类型筛选 */}
            <div className="flex items-center gap-2">
              {[
                { value: 'all' as const, label: '全部', color: 'from-gray-600 to-gray-700' },
                { value: 'intern' as const, label: '实习', color: 'from-purple-500 to-pink-500' },
                { value: 'full-time' as const, label: '全职', color: 'from-blue-500 to-cyan-500' },
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setFilterEmployment(value)}
                  className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm ${
                    filterEmployment === value
                      ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 地点筛选 */}
            {locations.length > 0 && (
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-4 py-2 text-sm font-semibold border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none bg-white shadow-sm"
              >
                <option value="all">📍 所有地点</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* 职位网格 */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-700 text-lg font-semibold mb-2">未找到匹配的职位</p>
            <p className="text-gray-500 text-sm">试试调整搜索条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCardMercor
                key={job.id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 职位详情模态框 */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
