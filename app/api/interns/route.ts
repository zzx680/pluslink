import { NextResponse } from 'next/server';
import { getInterns, addIntern } from '@/lib/data';

export async function GET() {
  try {
    const interns = await getInterns();
    return NextResponse.json(interns);
  } catch (error) {
    console.error('Error fetching interns:', error);
    return NextResponse.json({ error: 'Failed to fetch interns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.education || !body.position || !body.internshipPeriod || !body.contact || !body.startDate || !body.baseLocation || !body.workType || !body.employmentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const intern = await addIntern(body);
    return NextResponse.json(intern, { status: 201 });
  } catch (error) {
    console.error('Error creating intern:', error);
    return NextResponse.json({ error: 'Failed to create intern' }, { status: 500 });
  }
}
