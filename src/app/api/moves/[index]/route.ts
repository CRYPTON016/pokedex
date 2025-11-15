import { NextRequest, NextResponse } from 'next/server';
import MOVES from '@/lib/moves';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ index: string }> }
) {
  try {
    const { index } = await params;
    const dex = parseInt(index, 10);
    const moves = MOVES[dex] || [];

    return NextResponse.json({ data: moves }, { status: 200, headers: { 'Cache-Control': 'public, max-age=3600' } });
  } catch (err) {
    console.error('Error fetching moves', err);
    return NextResponse.json({ data: [] }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
