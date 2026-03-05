import { NextRequest, NextResponse } from 'next/server';
import { updateIntern } from '@/lib/data';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateIntern(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Intern not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating intern:', error);
    return NextResponse.json({ error: 'Failed to update intern' }, { status: 500 });
  }
}
