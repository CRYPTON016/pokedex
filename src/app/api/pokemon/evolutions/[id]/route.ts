import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pokemon } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import EVOLUTIONS from '@/lib/evolutions';
import { getCache, setCache } from '@/lib/server-cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbId = parseInt(id, 10);
    const cacheKey = `pokemon:evolutions:${dbId}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { status: 200, headers: { 'Cache-Control': 'public, max-age=3600' } });
    }

    // Fetch current pokemon to read its pokedex `index` field
    const current = await db
      .select()
      .from(pokemon)
      .where(eq(pokemon.id, dbId))
      .limit(1);

    if (!current || current.length === 0) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } }
      );
    }

    const currentPoke = current[0];
    const dexIndex = Number(currentPoke.index);

    const chainSteps = EVOLUTIONS[dexIndex] || [];

    if (chainSteps.length === 0) {
      const empty = { data: [] };
      setCache(cacheKey, empty, 3600);
      return NextResponse.json(empty, { status: 200, headers: { 'Cache-Control': 'public, max-age=3600' } });
    }

    // Extract numeric indices for DB query
    const indices = chainSteps.map((s) => s.index);

    // Build OR conditions for the query: where pokemon.index = idx1 OR idx2 ...
    const conditions = indices.map((i) => eq(pokemon.index, i));

    const rows = await db
      .select()
      .from(pokemon)
      .where(or(...conditions));

    // Map chain steps (with triggers) to the full pokemon rows
    const mapped = chainSteps
      .map((step) => {
        const row = rows.find((r) => Number(r.index) === step.index);
        if (!row) return null;
        return { step, pokemon: row };
      })
      .filter(Boolean);

    const payload = { data: mapped };
    setCache(cacheKey, payload, 3600);
    return NextResponse.json(payload, {
      status: 200,
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' }
    });
  } catch (error) {
    console.error('Error fetching evolutions:', error);
    return NextResponse.json({ error: 'Failed to fetch evolutions' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
