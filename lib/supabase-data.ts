import { Intern, Job, InviteCode, ProfileView } from './types';
import { supabase } from './supabase';

// 获取 Supabase 客户端
function getClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
  }
  return supabase;
}

// 获取所有实习生
export async function getInterns(): Promise<Intern[]> {
  const { data, error } = await getClient()
    .from('interns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching interns:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    inviteCode: item.invite_code,
    name: item.name,
    education: item.education,
    position: item.position,
    internshipPeriod: item.internship_period,
    contact: item.contact,
    startDate: item.start_date,
    baseLocation: item.base_location,
    workType: item.work_type,
    employmentType: item.employment_type,
    resumeUrl: item.resume_url,
    recommendation: item.recommendation,
    recommendedBy: item.recommended_by,
    createdAt: item.created_at,
  }));
}

// 添加实习生
export async function addIntern(intern: Omit<Intern, 'id' | 'createdAt'>): Promise<Intern> {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  const { error } = await getClient()
    .from('interns')
    .insert({
      id,
      invite_code: intern.inviteCode,
      name: intern.name,
      education: intern.education,
      position: intern.position,
      internship_period: intern.internshipPeriod,
      contact: intern.contact,
      start_date: intern.startDate,
      base_location: intern.baseLocation,
      work_type: intern.workType,
      employment_type: intern.employmentType,
      resume_url: intern.resumeUrl,
      recommendation: intern.recommendation,
      recommended_by: intern.recommendedBy,
      created_at: createdAt,
    });

  if (error) {
    throw new Error(`Failed to add intern: ${error.message}`);
  }

  return { ...intern, id, createdAt };
}

// 通过邀请码获取实习生
export async function getInternByInviteCode(inviteCode: string): Promise<Intern | null> {
  const { data, error } = await getClient()
    .from('interns')
    .select('*')
    .eq('invite_code', inviteCode)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    inviteCode: data.invite_code,
    name: data.name,
    education: data.education,
    position: data.position,
    internshipPeriod: data.internship_period,
    contact: data.contact,
    startDate: data.start_date,
    baseLocation: data.base_location,
    workType: data.work_type,
    employmentType: data.employment_type,
    resumeUrl: data.resume_url,
    recommendation: data.recommendation,
    recommendedBy: data.recommended_by,
    createdAt: data.created_at,
  };
}

// 更新实习生信息
export async function updateIntern(id: string, updates: Partial<Omit<Intern, 'id' | 'inviteCode' | 'createdAt'>>): Promise<Intern | null> {
  const updateData: Record<string, unknown> = {};

  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.education !== undefined) updateData.education = updates.education;
  if (updates.position !== undefined) updateData.position = updates.position;
  if (updates.internshipPeriod !== undefined) updateData.internship_period = updates.internshipPeriod;
  if (updates.contact !== undefined) updateData.contact = updates.contact;
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate;
  if (updates.baseLocation !== undefined) updateData.base_location = updates.baseLocation;
  if (updates.workType !== undefined) updateData.work_type = updates.workType;
  if (updates.employmentType !== undefined) updateData.employment_type = updates.employmentType;
  if (updates.resumeUrl !== undefined) updateData.resume_url = updates.resumeUrl;
  if (updates.recommendation !== undefined) updateData.recommendation = updates.recommendation;
  if (updates.recommendedBy !== undefined) updateData.recommended_by = updates.recommendedBy;

  const { error } = await getClient()
    .from('interns')
    .update(updateData)
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update intern: ${error.message}`);
  }

  const interns = await getInterns();
  return interns.find(i => i.id === id) ?? null;
}

// 获取所有职位
export async function getJobs(): Promise<Job[]> {
  const { data, error } = await getClient()
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    companyName: item.company_name,
    cohort: item.cohort,
    website: item.website,
    title: item.title,
    description: item.description,
    requirements: item.requirements,
    contact: item.contact,
    baseLocation: item.base_location,
    workType: item.work_type,
    employmentType: item.employment_type,
    createdAt: item.created_at,
  }));
}

// 添加职位
export async function addJob(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();

  const { error } = await getClient()
    .from('jobs')
    .insert({
      id,
      company_name: job.companyName,
      cohort: job.cohort,
      website: job.website,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      contact: job.contact,
      base_location: job.baseLocation,
      work_type: job.workType,
      employment_type: job.employmentType,
      created_at: createdAt,
    });

  if (error) {
    throw new Error(`Failed to add job: ${error.message}`);
  }

  return { ...job, id, createdAt };
}

// 获取所有邀请码
export async function getInviteCodes(): Promise<InviteCode[]> {
  const { data, error } = await getClient()
    .from('invite_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invite codes:', error);
    return [];
  }

  return data.map(item => ({
    code: item.code,
    type: item.type,
    used: item.used,
    usedBy: item.used_by,
    usedAt: item.used_at,
    createdAt: item.created_at,
  }));
}

// 验证邀请码
export async function validateInviteCode(code: string, type: 'company' | 'intern' | 'admin'): Promise<boolean> {
  const { data, error } = await getClient()
    .from('invite_codes')
    .select('*')
    .eq('code', code)
    .eq('type', type)
    .single();

  if (error || !data) {
    return false;
  }

  // 管理员邀请码可重复使用
  if (type === 'admin') {
    return true;
  }

  return !data.used;
}

// 使用邀请码
export async function useInviteCode(code: string, type: 'company' | 'intern' | 'admin', usedBy: string): Promise<boolean> {
  const { error } = await getClient()
    .from('invite_codes')
    .update({
      used: true,
      used_by: usedBy,
      used_at: new Date().toISOString(),
    })
    .eq('code', code)
    .eq('type', type)
    .eq('used', false);

  return !error;
}

// 创建邀请码
export async function createInviteCode(type: 'company' | 'intern' | 'admin'): Promise<InviteCode> {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const createdAt = new Date().toISOString();

  const { error } = await getClient()
    .from('invite_codes')
    .insert({
      code,
      type,
      used: false,
      created_at: createdAt,
    });

  if (error) {
    throw new Error(`Failed to create invite code: ${error.message}`);
  }

  return { code, type, used: false, createdAt };
}

// 删除邀请码
export async function deleteInviteCode(code: string): Promise<boolean> {
  const { error } = await getClient()
    .from('invite_codes')
    .delete()
    .eq('code', code);

  return !error;
}

// 获取简历查看记录
export async function getProfileViews(internId: string): Promise<ProfileView[]> {
  const { data, error } = await getClient()
    .from('profile_views')
    .select('*')
    .eq('intern_id', internId)
    .order('viewed_at', { ascending: false });

  if (error) {
    console.error('Error fetching profile views:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    internId: item.intern_id,
    viewerName: item.viewer_name,
    viewedAt: item.viewed_at,
  }));
}

// 添加简历查看记录
export async function addProfileView(internId: string, viewerName: string): Promise<void> {
  const id = Date.now().toString();

  const { error } = await getClient()
    .from('profile_views')
    .insert({
      id,
      intern_id: internId,
      viewer_name: viewerName,
      viewed_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error adding profile view:', error);
  }
}

// 获取未读查看数
export async function getUnreadViewCount(internId: string, since: string): Promise<number> {
  const { count, error } = await getClient()
    .from('profile_views')
    .select('*', { count: 'exact', head: true })
    .eq('intern_id', internId)
    .gt('viewed_at', since);

  if (error) {
    console.error('Error counting profile views:', error);
    return 0;
  }

  return count || 0;
}

// 数据初始化（Supabase 版本不需要，由 SQL schema 处理）
export async function initializeData() {
  // Supabase 版本通过 SQL schema 初始化
  // 此函数保留以保持兼容性
}
