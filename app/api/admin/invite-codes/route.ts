import { NextResponse } from 'next/server';
import { getInviteCodes, createInviteCode, deleteInviteCode } from '@/lib/data';

export async function GET() {
  try {
    const codes = await getInviteCodes();
    return NextResponse.json(codes);
  } catch (error) {
    console.error('Error fetching invite codes:', error);
    return NextResponse.json({ error: 'Failed to fetch invite codes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { type } = await request.json();
    if (!type || (type !== 'company' && type !== 'intern' && type !== 'admin')) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    const newCode = await createInviteCode(type);
    return NextResponse.json(newCode, { status: 201 });
  } catch (error) {
    console.error('Error creating invite code:', error);
    return NextResponse.json({ error: 'Failed to create invite code' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }
    const success = await deleteInviteCode(code);
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invite code not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting invite code:', error);
    return NextResponse.json({ error: 'Failed to delete invite code' }, { status: 500 });
  }
}
