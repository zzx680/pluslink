import { NextResponse } from 'next/server';
import { getAllProfileViews } from '@/lib/data';

export async function GET() {
  try {
    const views = await getAllProfileViews();
    return NextResponse.json(
      views.map(v => ({
        id: v.id,
        internName: v.internName || v.internId,
        viewerName: v.viewerName,
        viewedAt: v.viewedAt,
      }))
    );
  } catch (error) {
    console.error('Error fetching profile views:', error);
    return NextResponse.json({ error: 'Failed to fetch profile views' }, { status: 500 });
  }
}
