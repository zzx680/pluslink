import { NextResponse } from 'next/server';
import { getJobs, addJob, useInviteCode, getInviteCodes } from '@/lib/data';

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.companyName || !body.title || !body.description || !body.requirements || !body.contact || !body.baseLocation || !body.workType || !body.employmentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 从 sessionStorage 获取邀请码（前端需要传递）
    const inviteCode = body.inviteCode;
    if (inviteCode) {
      // 检查邀请码是否已使用，如果未使用则标记为已使用
      const codes = await getInviteCodes();
      const code = codes.find(c => c.code === inviteCode && c.type === 'company');
      if (code && !code.used) {
        await useInviteCode(inviteCode, 'company', body.companyName);
      }
    }

    const job = await addJob(body);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
