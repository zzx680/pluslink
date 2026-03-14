import { Intern, Job, InviteCode, ProfileView, User } from './types';

// 检查是否使用 Supabase
const USE_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 动态导入 Supabase 数据层
async function getSupabaseData() {
  const supabaseData = await import('./supabase-data');
  return supabaseData;
}

// 用户注册
export async function registerUser(
  username: string,
  password: string,
  userType: 'intern' | 'company' | 'admin',
  inviteCode: string,
  displayName: string
): Promise<{ userId: string; username: string }> {
  if (USE_SUPABASE) {
    const { registerUser: supabaseRegisterUser } = await getSupabaseData();
    return supabaseRegisterUser(username, password, userType, inviteCode, displayName);
  }
  throw new Error('仅支持 Supabase 模式');
}

// 用户登录
export async function loginUser(
  username: string,
  password: string
): Promise<{ userId: string; username: string; userType: string; displayName: string }> {
  if (USE_SUPABASE) {
    const { loginUser: supabaseLoginUser } = await getSupabaseData();
    return supabaseLoginUser(username, password);
  }
  throw new Error('仅支持 Supabase 模式');
}

// 数据存储路径（JSON 模式）
const DATA_DIR = '/data';
const INTERNS_FILE = `${DATA_DIR}/interns.json`;
const JOBS_FILE = `${DATA_DIR}/jobs.json`;
const INVITE_CODES_FILE = `${DATA_DIR}/invite-codes.json`;

// 初始化数据文件
export async function initializeData() {
  if (USE_SUPABASE) {
    // Supabase 通过 SQL schema 初始化
    return;
  }

  if (typeof window === 'undefined') {
    const fs = await import('fs/promises');
    const path = await import('path');

    const dataDir = path.join(process.cwd(), 'data');
    const internsPath = path.join(dataDir, 'interns.json');
    const jobsPath = path.join(dataDir, 'jobs.json');
    const inviteCodesPath = path.join(dataDir, 'invite-codes.json');

    try {
      await fs.mkdir(dataDir, { recursive: true });

      try {
        await fs.access(internsPath);
      } catch {
        await fs.writeFile(internsPath, JSON.stringify([], null, 2));
      }

      try {
        await fs.access(jobsPath);
      } catch {
        await fs.writeFile(jobsPath, JSON.stringify([], null, 2));
      }

      try {
        await fs.access(inviteCodesPath);
      } catch {
        const defaultCodes: InviteCode[] = [
          { code: 'COMP25', type: 'company', used: false, createdAt: new Date().toISOString() },
          { code: 'INT25A', type: 'intern', used: false, createdAt: new Date().toISOString() },
          { code: 'ADM25A', type: 'admin', used: false, createdAt: new Date().toISOString() }, // 默认管理员邀请码
        ];
        await fs.writeFile(inviteCodesPath, JSON.stringify(defaultCodes, null, 2));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }
}

export async function getInterns(): Promise<Intern[]> {
  if (USE_SUPABASE) {
    const { getInterns: supabaseGetInterns } = await getSupabaseData();
    return supabaseGetInterns();
  }

  if (typeof window !== 'undefined') return [];
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'interns.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function addIntern(intern: Omit<Intern, 'id' | 'createdAt'>): Promise<Intern> {
  if (USE_SUPABASE) {
    const { addIntern: supabaseAddIntern } = await getSupabaseData();
    return supabaseAddIntern(intern);
  }

  if (typeof window !== 'undefined') throw new Error('Cannot add intern on client');
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'data', 'interns.json');
  const interns = await getInterns();
  const newIntern: Intern = { ...intern, id: Date.now().toString(), createdAt: new Date().toISOString() };
  interns.push(newIntern);
  await fs.writeFile(filePath, JSON.stringify(interns, null, 2));
  return newIntern;
}

export async function getInternByInviteCode(inviteCode: string): Promise<Intern | null> {
  if (USE_SUPABASE) {
    const { getInternByInviteCode: supabaseGetInternByInviteCode } = await getSupabaseData();
    return supabaseGetInternByInviteCode(inviteCode);
  }

  const interns = await getInterns();
  return interns.find(i => i.inviteCode === inviteCode) ?? null;
}

export async function updateIntern(id: string, updates: Partial<Omit<Intern, 'id' | 'inviteCode' | 'createdAt'>>): Promise<Intern | null> {
  if (USE_SUPABASE) {
    const { updateIntern: supabaseUpdateIntern } = await getSupabaseData();
    return supabaseUpdateIntern(id, updates);
  }

  if (typeof window !== 'undefined') throw new Error('Cannot update intern on client');
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'data', 'interns.json');
  const interns = await getInterns();
  const index = interns.findIndex(i => i.id === id);
  if (index === -1) return null;
  interns[index] = { ...interns[index], ...updates };
  await fs.writeFile(filePath, JSON.stringify(interns, null, 2));
  return interns[index];
}

export async function getJobs(): Promise<Job[]> {
  if (USE_SUPABASE) {
    const { getJobs: supabaseGetJobs } = await getSupabaseData();
    return supabaseGetJobs();
  }

  if (typeof window !== 'undefined') return [];
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'jobs.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function addJob(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
  if (USE_SUPABASE) {
    const { addJob: supabaseAddJob } = await getSupabaseData();
    return supabaseAddJob(job);
  }

  if (typeof window !== 'undefined') throw new Error('Cannot add job on client');
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'data', 'jobs.json');
  const jobs = await getJobs();
  const newJob: Job = { ...job, id: Date.now().toString(), createdAt: new Date().toISOString() };
  jobs.push(newJob);
  await fs.writeFile(filePath, JSON.stringify(jobs, null, 2));
  return newJob;
}

export async function getInviteCodes(): Promise<InviteCode[]> {
  if (USE_SUPABASE) {
    const { getInviteCodes: supabaseGetInviteCodes } = await getSupabaseData();
    return supabaseGetInviteCodes();
  }

  if (typeof window !== 'undefined') return [];
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'invite-codes.json');
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function validateInviteCode(code: string, type: 'company' | 'intern' | 'admin'): Promise<boolean> {
  if (USE_SUPABASE) {
    const { validateInviteCode: supabaseValidateInviteCode } = await getSupabaseData();
    return supabaseValidateInviteCode(code, type);
  }

  const codes = await getInviteCodes();
  const inviteCode = codes.find(c => c.code === code && c.type === type);
  // 管理员邀请码可重复使用，不检查 used 状态
  if (type === 'admin') {
    return inviteCode !== undefined;
  }
  return inviteCode !== undefined && !inviteCode.used;
}

export async function useInviteCode(code: string, type: 'company' | 'intern' | 'admin', usedBy: string): Promise<boolean> {
  if (USE_SUPABASE) {
    const { useInviteCode: supabaseUseInviteCode } = await getSupabaseData();
    return supabaseUseInviteCode(code, type, usedBy);
  }

  if (typeof window !== 'undefined') throw new Error('Cannot use invite code on client');
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'data', 'invite-codes.json');
  const codes = await getInviteCodes();
  const codeIndex = codes.findIndex(c => c.code === code && c.type === type && !c.used);
  if (codeIndex === -1) return false;
  codes[codeIndex].used = true;
  codes[codeIndex].usedBy = usedBy;
  codes[codeIndex].usedAt = new Date().toISOString();
  await fs.writeFile(filePath, JSON.stringify(codes, null, 2));
  return true;
}

export async function createInviteCode(type: 'company' | 'intern' | 'admin'): Promise<InviteCode> {
  if (USE_SUPABASE) {
    const { createInviteCode: supabaseCreateInviteCode } = await getSupabaseData();
    return supabaseCreateInviteCode(type);
  }

  if (typeof window !== 'undefined') throw new Error('Cannot create invite code on client');
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'data', 'invite-codes.json');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const newCode: InviteCode = { code, type, used: false, createdAt: new Date().toISOString() };
  const codes = await getInviteCodes();
  codes.push(newCode);
  await fs.writeFile(filePath, JSON.stringify(codes, null, 2));
  return newCode;
}

export async function deleteInviteCode(code: string): Promise<boolean> {
  if (USE_SUPABASE) {
    const { deleteInviteCode: supabaseDeleteInviteCode } = await getSupabaseData();
    return supabaseDeleteInviteCode(code);
  }

  if (typeof window !== 'undefined') throw new Error('Cannot delete invite code on client');
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'data', 'invite-codes.json');
  const codes = await getInviteCodes();
  const filteredCodes = codes.filter(c => c.code !== code);
  if (filteredCodes.length === codes.length) return false;
  await fs.writeFile(filePath, JSON.stringify(filteredCodes, null, 2));
  return true;
}

export async function getProfileViews(internId: string): Promise<ProfileView[]> {
  if (USE_SUPABASE) {
    const { getProfileViews: supabaseGetProfileViews } = await getSupabaseData();
    return supabaseGetProfileViews(internId);
  }

  if (typeof window !== 'undefined') return [];
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'profile-views.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const all: ProfileView[] = JSON.parse(content);
    return all.filter(v => v.internId === internId).sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());
  } catch {
    return [];
  }
}

export async function getAllProfileViews(): Promise<(ProfileView & { internName?: string })[]> {
  if (USE_SUPABASE) {
    const { getAllProfileViews: supabaseGetAllProfileViews } = await getSupabaseData();
    return supabaseGetAllProfileViews();
  }
  return [];
}

export async function addProfileView(internId: string, viewerName: string): Promise<{ created: boolean }> {
  if (USE_SUPABASE) {
    const { addProfileView: supabaseAddProfileView } = await getSupabaseData();
    return supabaseAddProfileView(internId, viewerName);
  }

  if (typeof window !== 'undefined') return { created: false };
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'data', 'profile-views.json');
  let views: ProfileView[] = [];
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    views = JSON.parse(content);
  } catch {
    // 文件不存在则从空数组开始
  }
  if (views.some(v => v.internId === internId && v.viewerName === viewerName)) {
    return { created: false };
  }
  const newView: ProfileView = {
    id: Date.now().toString(),
    internId,
    viewerName,
    viewedAt: new Date().toISOString(),
  };
  views.push(newView);
  await fs.writeFile(filePath, JSON.stringify(views, null, 2));
  return { created: true };
}

export async function getUnreadViewCount(internId: string, since: string): Promise<number> {
  if (USE_SUPABASE) {
    const { getUnreadViewCount: supabaseGetUnreadViewCount } = await getSupabaseData();
    return supabaseGetUnreadViewCount(internId, since);
  }

  const views = await getProfileViews(internId);
  return views.filter(v => new Date(v.viewedAt) > new Date(since)).length;
}
