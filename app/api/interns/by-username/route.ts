import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getInternByInviteCode } from '@/lib/data';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username) {
    return NextResponse.json({ error: 'Missing username' }, { status: 400 });
  }

  try {
    // 通过 username 查 invite_code，再查实习生信息
    const { data: user, error } = await supabase
      .from('users')
      .select('invite_code')
      .eq('username', username)
      .single();

    if (error || !user) {
      return NextResponse.json(null);
    }

    const intern = await getInternByInviteCode(user.invite_code);
    return NextResponse.json(intern ?? null);
  } catch (error) {
    console.error('Error fetching intern by username:', error);
    return NextResponse.json({ error: 'Failed to fetch intern' }, { status: 500 });
  }
}
