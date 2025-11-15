import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pokemon } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCache, setCache } from '@/lib/server-cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pokemonId = parseInt(id);
    const cacheKey = `pokemon:id:${pokemonId}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { status: 200, headers: { 'Cache-Control': 'public, max-age=60' } });
    }
    
    const result = await db
      .select()
      .from(pokemon)
      .where(eq(pokemon.id, pokemonId))
      .limit(1);
    
    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } }
      );
    }
    
    const resBody = result[0];
    setCache(cacheKey, resBody, 60);
    return NextResponse.json(resBody, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=3600'
      }
    });
  } catch (error) {
    console.error('Error fetching pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pokemon' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}