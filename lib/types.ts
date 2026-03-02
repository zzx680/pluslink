// 数据类型定义

export interface Intern {
  id: string;
  name: string;
  education: string;
  position: string;
  internshipPeriod: string;
  contact: string;
  createdAt: string;
}

export interface Job {
  id: string;
  companyName: string;
  title: string;
  description: string;
  requirements: string;
  contact: string;
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
