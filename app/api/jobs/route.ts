import { NextResponse } from 'next/server';
import { getJobs, addJob } from '@/lib/data';

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
    const job = await addJob(body);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
