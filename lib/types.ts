// 数据类型定义

export interface Intern {
  id: string;
  inviteCode: string; // 关联的邀请码
  name: string;
  education: string;
  position: string;
  internshipPeriod: string;
  contact: string;
  startDate: string; // 多久入职
  baseLocation: string; // base地点
  workType: 'online' | 'offline' | 'hybrid'; // 线上/线下/混合
  employmentType: 'intern' | 'full-time' | 'both'; // 实习/全职/都可以
  resumeUrl?: string; // 简历文件路径
  createdAt: string;
}

export interface Job {
  id: string;
  companyName: string;
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
