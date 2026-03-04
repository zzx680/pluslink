// 数据类型定义

export interface Intern {
  id: string;
  name: string;
  education: string;
  position: string;
  internshipPeriod: string;
  contact: string;
  startDate: string; // 多久入职
  baseLocation: string; // base地点
  workType: 'online' | 'offline' | 'hybrid'; // 线上/线下/混合
  employmentType: 'intern' | 'full-time'; // 实习/全职
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
  employmentType: 'intern' | 'full-time'; // 实习/全职
  createdAt: string;
}

export interface InviteCode {
  code: string;
  type: 'company' | 'intern';
  used: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}
