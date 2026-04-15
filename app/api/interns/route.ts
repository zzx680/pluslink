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
    if (!body.name || !body.education || !body.position || !body.contact || !body.baseLocation || !body.workType || !body.employmentType || !body.username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 通过 username 查询用户的 inviteCode
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: user } = await supabase
      .from('users')
      .select('invite_code')
      .eq('username', body.username)
      .single();

    if (!user || !user.invite_code) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const intern = await addIntern({ ...body, inviteCode: user.invite_code });
    return NextResponse.json(intern, { status: 201 });
  } catch (error) {
    console.error('Error creating intern:', error);
    return NextResponse.json({ error: 'Failed to create intern' }, { status: 500 });
  }
}
