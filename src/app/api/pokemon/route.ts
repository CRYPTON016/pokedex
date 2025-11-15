import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pokemon } from '@/db/schema';
import { sql, and, or, eq, gte, lte, like } from 'drizzle-orm';
import { getCache, setCache } from '@/lib/server-cache';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const offset = (page - 1) * limit;
    
    // Search
    const search = searchParams.get('search') || '';
    
    // Filters
    const type1 = searchParams.get('type1') || '';
    const type2 = searchParams.get('type2') || '';
    const eggGroup = searchParams.get('eggGroup') || '';
    
    // Stat filters
    const minHp = searchParams.get('minHp') ? parseInt(searchParams.get('minHp')!) : null;
    const maxHp = searchParams.get('maxHp') ? parseInt(searchParams.get('maxHp')!) : null;
    const minAttack = searchParams.get('minAttack') ? parseInt(searchParams.get('minAttack')!) : null;
    const maxAttack = searchParams.get('maxAttack') ? parseInt(searchParams.get('maxAttack')!) : null;
    const minDefense = searchParams.get('minDefense') ? parseInt(searchParams.get('minDefense')!) : null;
    const maxDefense = searchParams.get('maxDefense') ? parseInt(searchParams.get('maxDefense')!) : null;
    const minSpeed = searchParams.get('minSpeed') ? parseInt(searchParams.get('minSpeed')!) : null;
    const maxSpeed = searchParams.get('maxSpeed') ? parseInt(searchParams.get('maxSpeed')!) : null;
    
    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(pokemon.name, `%${search}%`),
          like(pokemon.pokemon, `%${search}%`)
        )
      );
    }
    
    if (type1) {
      conditions.push(eq(pokemon.type1, type1));
    }
    
    if (type2) {
      conditions.push(eq(pokemon.type2, type2));
    }
    
    if (eggGroup) {
      conditions.push(like(pokemon.eggGroups, `%${eggGroup}%`));
    }
    
    // Stat range filters
    if (minHp !== null) conditions.push(gte(pokemon.hp, minHp));
    if (maxHp !== null) conditions.push(lte(pokemon.hp, maxHp));
    if (minAttack !== null) conditions.push(gte(pokemon.attack, minAttack));
    if (maxAttack !== null) conditions.push(lte(pokemon.attack, maxAttack));
    if (minDefense !== null) conditions.push(gte(pokemon.defense, minDefense));
    if (maxDefense !== null) conditions.push(lte(pokemon.defense, maxDefense));
    if (minSpeed !== null) conditions.push(gte(pokemon.speed, minSpeed));
    if (maxSpeed !== null) conditions.push(lte(pokemon.speed, maxSpeed));
    
    // Cache key is the full search/sort/filters signature
    const cacheKey = `pokemon:list:${search}:${type1}:${type2}:${eggGroup}:${minHp}:${maxHp}:${minAttack}:${maxAttack}:${minDefense}:${maxDefense}:${minSpeed}:${maxSpeed}:page=${page}:limit=${limit}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: { 'Cache-Control': 'public, max-age=10, stale-while-revalidate=30' },
      });
    }

    // Get total count
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(pokemon)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    const total = Number(totalResult[0].count);
    
    // Get paginated data
    const data = await db
      .select()
      .from(pokemon)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(pokemon.index)
      .limit(limit)
      .offset(offset);
    
    const payload = {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // cache short-lived (10s) to reduce hot-DB churn for identical queries
    setCache(cacheKey, payload, 10);

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Error fetching pokemon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pokemon' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}