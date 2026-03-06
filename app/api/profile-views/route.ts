import { NextRequest, NextResponse } from 'next/server';
import { addProfileView, getProfileViews } from '@/lib/data';

// 记录查看行为
export async function POST(request: NextRequest) {
  try {
    const { internId, viewerName } = await request.json();
    if (!internId || !viewerName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    await addProfileView(internId, viewerName);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error recording view:', error);
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 });
  }
}

// 获取某实习生的查看记录
export async function GET(request: NextRequest) {
  const internId = request.nextUrl.searchParams.get('internId');
  if (!internId) {
    return NextResponse.json({ error: 'Missing internId' }, { status: 400 });
  }
  try {
    const views = await getProfileViews(internId);
    return NextResponse.json(views);
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json({ error: 'Failed to fetch views' }, { status: 500 });
  }
}
