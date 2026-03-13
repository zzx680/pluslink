// 数据类型定义

// 用户账号（用于登录）
export interface User {
  id: string;
  username: string;
  password: string;              // TODO: 应该加密存储
  userType: 'intern' | 'company' | 'admin';
  inviteCode: string;            // 使用的邀请码
  displayName: string;           // 实习生姓名或公司名称
  createdAt: string;
}

export interface Intern {
  id: string;
  userId: string;                // 关联 User 表
  inviteCode: string;
  name: string;
  education: string;
  position: string;
  internshipPeriod: string;
  contact: string;
  startDate: string;
  baseLocation: string;
  workType: 'online' | 'offline' | 'hybrid';
  employmentType: 'intern' | 'full-time' | 'both';
  resumeUrl?: string;
  recommendation?: string;
  recommendedBy?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  companyName: string;
  username: string;              // 登录用户名
  password: string;              // 登录密码
  cohort?: string; // 届数，例如 'S23', 'F24'
  website?: string; // 公司网址
  title: string;
  description: string;
  requirements: string;
  contact: string;
  baseLocation: string; // base地点
  workType: 'online' | 'offline' | 'hybrid'; // 线上/线下/混合
  employmentType: 'intern' | 'full-time' | 'both'; // 实习/全职/都可以
  createdAt: string;
}

export interface InviteCode {
  code: string;
  type: 'company' | 'intern' | 'admin'; // 添加 admin 类型
  used: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

export interface ProfileView {
  id: string;
  internId: string;        // 被查看的实习生ID
  viewerName: string;      // 查看者名称（公司名）
  viewedAt: string;        // 查看时间
}
