import { NextRequest, NextResponse } from 'next/server';
import { getInternByInviteCode } from '@/lib/data';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }
  try {
    const intern = await getInternByInviteCode(code.toUpperCase());
    return NextResponse.json(intern ?? null);
  } catch (error) {
    console.error('Error fetching intern by invite code:', error);
    return NextResponse.json({ error: 'Failed to fetch intern' }, { status: 500 });
  }
}
