import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const { username, password, userType, inviteCode, displayName } = await request.json();

    // 1. 验证邀请码
    const { data: inviteCodeData, error: inviteError } = await supabase
      .from('invite_codes')
      .select('*')
      .eq('code', inviteCode)
      .eq('type', userType)
      .single();

    if (inviteError || !inviteCodeData) {
      return NextResponse.json({ error: '邀请码无效' }, { status: 400 });
    }

    // 管理员邀请码不检查 used 状态
    if (userType !== 'admin' && inviteCodeData.used) {
      return NextResponse.json({ error: '邀请码已被使用' }, { status: 400 });
    }

    // 2. 检查用户名是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 400 });
    }

    // 3. 创建用户
    const userId = Date.now().toString();
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        username,
        password, // TODO: 应该加密
        user_type: userType,
        invite_code: inviteCode,
        display_name: displayName,
        created_at: new Date().toISOString(),
      });

    if (userError) {
      throw userError;
    }

    // 4. 标记邀请码为已使用（管理员除外）
    if (userType !== 'admin') {
      await supabase
        .from('invite_codes')
        .update({
          used: true,
          used_by: displayName,
          used_at: new Date().toISOString(),
        })
        .eq('code', inviteCode);
    }

    return NextResponse.json({
      success: true,
      userId,
      username,
      userType,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
