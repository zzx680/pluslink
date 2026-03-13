import { NextRequest, NextResponse } from 'next/server';
import { getInterns } from '@/lib/data';

export async function GET(request: NextRequest) {
  const inviteCode = request.nextUrl.searchParams.get('inviteCode');
  if (!inviteCode) {
    return NextResponse.json({ error: 'Missing inviteCode' }, { status: 400 });
  }

  try {
    const interns = await getInterns();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newThisWeek = interns.filter(i => new Date(i.createdAt) > oneWeekAgo).length;

    return NextResponse.json({ newThisWeek, total: interns.length });
  } catch (error) {
    console.error('Weekly digest error:', error);
    return NextResponse.json({ error: 'Failed to fetch digest' }, { status: 500 });
  }
}
