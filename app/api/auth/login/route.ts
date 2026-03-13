import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 查询用户
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password) // TODO: 应该比较加密后的密码
      .single();

    if (error || !user) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    // 返回用户信息（不包含密码)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        userType: user.user_type,
        displayName: user.display_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
