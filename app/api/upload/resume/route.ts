import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    // 检查 Supabase 是否配置
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase 未配置，请检查环境变量' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: '未找到文件' }, { status: 400 });
    }

    // 校验文件类型
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: '只支持 PDF 文件' }, { status: 400 });
    }

    // 校验文件大小 (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: '文件大小不能超过 5MB' }, { status: 400 });
    }

    // 生成文件名: {timestamp}-{random}.pdf
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const filename = `${timestamp}-${random}.pdf`;

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 上传到 Supabase Storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filename, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);

      // 如果 bucket 不存在，给出友好提示
      if (error.message.includes('Bucket not found')) {
        return NextResponse.json(
          { error: 'Storage bucket "resumes" 不存在，请在 Supabase 控制台创建' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: `上传失败: ${error.message}` },
        { status: 500 }
      );
    }

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filename);

    return NextResponse.json({
      resumeUrl: urlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '上传失败，请重试' },
      { status: 500 }
    );
  }
}
