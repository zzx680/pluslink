import { Intern, Job, InviteCode, ProfileView } from './types';

// 数据存储路径
const DATA_DIR = '/data';
const INTERNS_FILE = `${DATA_DIR}/interns.json`;
const JOBS_FILE = `${DATA_DIR}/jobs.json`;
const INVITE_CODES_FILE = `${DATA_DIR}/invite-codes.json`;

// 初始化数据文件
export async function initializeData() {
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
          { code: 'COMPANY2025', type: 'company', used: false, createdAt: new Date().toISOString() },
          { code: 'INTERN2025', type: 'intern', used: false, createdAt: new Date().toISOString() },
          { code: 'ADMIN2025', type: 'admin', used: false, createdAt: new Date().toISOString() }, // 默认管理员邀请码
        ];
        await fs.writeFile(inviteCodesPath, JSON.stringify(defaultCodes, null, 2));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }
}

export async function getInterns(): Promise<Intern[]> {
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
  const interns = await getInterns();
  return interns.find(i => i.inviteCode === inviteCode) ?? null;
}

export async function updateIntern(id: string, updates: Partial<Omit<Intern, 'id' | 'inviteCode' | 'createdAt'>>): Promise<Intern | null> {
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
  const codes = await getInviteCodes();
  const inviteCode = codes.find(c => c.code === code && c.type === type);
  // 管理员邀请码可重复使用，不检查 used 状态
  if (type === 'admin') {
    return inviteCode !== undefined;
  }
  return inviteCode !== undefined && !inviteCode.used;
}

export async function useInviteCode(code: string, type: 'company' | 'intern' | 'admin', usedBy: string): Promise<boolean> {
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

export async function addProfileView(internId: string, viewerName: string): Promise<void> {
  if (typeof window !== 'undefined') return;
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
  const newView: ProfileView = {
    id: Date.now().toString(),
    internId,
    viewerName,
    viewedAt: new Date().toISOString(),
  };
  views.push(newView);
  await fs.writeFile(filePath, JSON.stringify(views, null, 2));
}

export async function getUnreadViewCount(internId: string, since: string): Promise<number> {
  const views = await getProfileViews(internId);
  return views.filter(v => new Date(v.viewedAt) > new Date(since)).length;
}
