import { NextResponse } from 'next/server';
import { validateInviteCode } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { code, type } = await request.json();
    if (!code || !type) {
      return NextResponse.json({ error: 'Missing code or type' }, { status: 400 });
    }
    const isValid = await validateInviteCode(code, type);
    if (isValid) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false, error: '邀请码无效或已使用' });
    }
  } catch (error) {
    console.error('Error validating invite code:', error);
    return NextResponse.json({ error: 'Failed to validate invite code' }, { status: 500 });
  }
}
