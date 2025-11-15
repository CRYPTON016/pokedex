import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pokemon } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getCache, setCache } from '@/lib/server-cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stat = searchParams.get('stat') || 'attack';
    const limit = parseInt(searchParams.get('limit') || '10');
    
    let orderColumn;
    switch (stat.toLowerCase()) {
      case 'hp':
        orderColumn = pokemon.hp;
        break;
      case 'attack':
        orderColumn = pokemon.attack;
        break;
      case 'defense':
        orderColumn = pokemon.defense;
        break;
      case 'spatk':
      case 'sp_atk':
        orderColumn = pokemon.spAtk;
        break;
      case 'spdef':
      case 'sp_def':
        orderColumn = pokemon.spDef;
        break;
      case 'speed':
        orderColumn = pokemon.speed;
        break;
      case 'total':
        orderColumn = pokemon.total;
        break;
      default:
        orderColumn = pokemon.attack;
    }
    
    const cacheKey = `pokemon:top:${stat}:limit=${limit}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { status: 200, headers: { 'Cache-Control': 'public, max-age=300' } });
    }

    const result = await db
      .select()
      .from(pokemon)
      .orderBy(desc(orderColumn))
      .limit(limit);

    setCache(cacheKey, result, 300);

    return NextResponse.json(result, {
      status: 200,
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' }
    });
  } catch (error) {
    console.error('Error fetching top pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top pokemon' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}