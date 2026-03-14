import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { username, oldPassword, newPassword } = await request.json();

    if (!username || !oldPassword || !newPassword) {
      return NextResponse.json({ error: '参数缺失' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码不能少于6位' }, { status: 400 });
    }

    // 验证旧密码
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .eq('password', oldPassword)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: '原密码错误' }, { status: 401 });
    }

    // 更新密码
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: '修改失败，请重试' }, { status: 500 });
  }
}
