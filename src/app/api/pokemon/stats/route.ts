import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pokemon } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';
import { getCache, setCache } from '@/lib/server-cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    
    if (type) {
      // Get average stats for a specific type
      const result = await db
        .select({
          avgHp: sql<number>`CAST(AVG(${pokemon.hp}) AS REAL)`,
          avgAttack: sql<number>`CAST(AVG(${pokemon.attack}) AS REAL)`,
          avgDefense: sql<number>`CAST(AVG(${pokemon.defense}) AS REAL)`,
          avgSpAtk: sql<number>`CAST(AVG(${pokemon.spAtk}) AS REAL)`,
          avgSpDef: sql<number>`CAST(AVG(${pokemon.spDef}) AS REAL)`,
          avgSpeed: sql<number>`CAST(AVG(${pokemon.speed}) AS REAL)`,
        })
        .from(pokemon)
        .where(eq(pokemon.type1, type));
      
      const cacheKey = `pokemon:stats:type:${type}`;
      setCache(cacheKey, result[0], 3600);
      return NextResponse.json(result[0], {
        status: 200,
        headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' }
      });
    }
    
    // Get type distribution
    const typeDistribution = await db
      .select({
        type: pokemon.type1,
        count: sql<number>`count(*)`,
      })
      .from(pokemon)
      .groupBy(pokemon.type1);
    
    const cacheKey = `pokemon:stats:distribution`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { status: 200, headers: { 'Cache-Control': 'public, max-age=3600' } });
    }

    setCache(cacheKey, { typeDistribution }, 3600);
    return NextResponse.json({ typeDistribution }, {
      status: 200,
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}