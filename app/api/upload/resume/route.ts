import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
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

    // 确保 public/resumes 目录存在
    const resumesDir = path.join(process.cwd(), 'public', 'resumes');
    if (!existsSync(resumesDir)) {
      await mkdir(resumesDir, { recursive: true });
    }

    // 生成文件名: {timestamp}-{random}.pdf
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const filename = `${timestamp}-${random}.pdf`;
    const filepath = path.join(resumesDir, filename);

    // 保存文件
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // 返回可访问的路径
    const resumeUrl = `/resumes/${filename}`;
    return NextResponse.json({ resumeUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
