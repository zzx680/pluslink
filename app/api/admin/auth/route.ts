import { NextResponse } from 'next/server';
import { validateInviteCode, useInviteCode } from '@/lib/data';

// 验证管理员邀请码
export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: '请输入邀请码' }, { status: 400 });
    }

    // 验证是否为有效的 admin 类型邀请码
    const isValid = await validateInviteCode(code, 'admin');

    if (isValid) {
      // 标记邀请码为已使用
      await useInviteCode(code, 'admin', 'admin-user');

      // 返回成功，并设置 session token
      const response = NextResponse.json({
        valid: true,
        message: '验证成功'
      });

      // 设置 cookie 用于后续验证（7天有效期）
      response.cookies.set('admin_session', code, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 天
      });

      return response;
    } else {
      return NextResponse.json({
        valid: false,
        error: '邀请码无效或已使用'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Error validating admin code:', error);
    return NextResponse.json({
      error: '验证失败，请重试'
    }, { status: 500 });
  }
}

// 验证当前 session
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const adminSession = cookieHeader
      ?.split(';')
      .find(c => c.trim().startsWith('admin_session='))
      ?.split('=')[1];

    if (!adminSession) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // 这里可以添加更复杂的验证逻辑
    // 例如检查 session 是否在有效列表中
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// 登出
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
