import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { pokemon } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    // Get the uploaded file from FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Read the CSV file content
    const text = await file.text();
    
    // Parse CSV with proper handling of quoted fields
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const lines = text.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file is empty or invalid' },
        { status: 400 }
      );
    }

    // Parse CSV header and rows
    const headers = parseCSVLine(lines[0]);
    const pokemonData = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const record: any = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      
      pokemonData.push(record);
    }

    // Clear existing pokemon data
    await db.delete(pokemon);

    // Prepare pokemon records with timestamps
    const timestamp = new Date().toISOString();
    const pokemonRecords = pokemonData.map((p: any) => ({
      pokemon: p.pokemon || p.Pokemon || '',
      type: p.type || p.Type || '',
      species: p.species || p.Species || '',
      height: p.height || p.Height || '',
      weight: p.weight || p.Weight || '',
      abilities: p.abilities || p.Abilities || '',
      evYield: p.evYield || p['EV Yield'] || '',
      catchRate: p.catchRate || p['Catch Rate'] || '',
      baseFriendship: p.baseFriendship || p['Base Friendship'] || '',
      baseExp: p.baseExp || p['Base Exp'] || '',
      growthRate: p.growthRate || p['Growth Rate'] || '',
      eggGroups: p.eggGroups || p['Egg Groups'] || '',
      gender: p.gender || p.Gender || '',
      eggCycles: p.eggCycles || p['Egg Cycles'] || '',
      hpBase: parseInt(p.hpBase || p['HP Base'] || '0') || 0,
      hpMin: parseInt(p.hpMin || p['HP Min'] || '0') || 0,
      hpMax: parseInt(p.hpMax || p['HP Max'] || '0') || 0,
      attackBase: parseInt(p.attackBase || p['Attack Base'] || '0') || 0,
      attackMin: parseInt(p.attackMin || p['Attack Min'] || '0') || 0,
      attackMax: parseInt(p.attackMax || p['Attack Max'] || '0') || 0,
      defenseBase: parseInt(p.defenseBase || p['Defense Base'] || '0') || 0,
      defenseMin: parseInt(p.defenseMin || p['Defense Min'] || '0') || 0,
      defenseMax: parseInt(p.defenseMax || p['Defense Max'] || '0') || 0,
      specialAttackBase: parseInt(p.specialAttackBase || p['Special Attack Base'] || '0') || 0,
      specialAttackMin: parseInt(p.specialAttackMin || p['Special Attack Min'] || '0') || 0,
      specialAttackMax: parseInt(p.specialAttackMax || p['Special Attack Max'] || '0') || 0,
      specialDefenseBase: parseInt(p.specialDefenseBase || p['Special Defense Base'] || '0') || 0,
      specialDefenseMin: parseInt(p.specialDefenseMin || p['Special Defense Min'] || '0') || 0,
      specialDefenseMax: parseInt(p.specialDefenseMax || p['Special Defense Max'] || '0') || 0,
      speedBase: parseInt(p.speedBase || p['Speed Base'] || '0') || 0,
      speedMin: parseInt(p.speedMin || p['Speed Min'] || '0') || 0,
      speedMax: parseInt(p.speedMax || p['Speed Max'] || '0') || 0,
      unnamed32: p.unnamed32 || p['Unnamed: 32'] || null,
      unnamed33: p.unnamed33 || p['Unnamed: 33'] || null,
      image: p.image || p.Image || '',
      index: parseInt(p.index || p.Index || p['#'] || '0') || 0,
      name: p.name || p.Name || '',
      type1: p.type1 || p.Type1 || p['Type 1'] || '',
      type2: p.type2 || p.Type2 || p['Type 2'] || null,
      total: parseInt(p.total || p.Total || '0') || 0,
      hp: parseInt(p.hp || p.HP || '0') || 0,
      attack: parseInt(p.attack || p.Attack || '0') || 0,
      defense: parseInt(p.defense || p.Defense || '0') || 0,
      spAtk: parseInt(p.spAtk || p['Sp. Atk'] || p.SpAtk || '0') || 0,
      spDef: parseInt(p.spDef || p['Sp. Def'] || p.SpDef || '0') || 0,
      speed: parseInt(p.speed || p.Speed || '0') || 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    }));

    // Insert in batches of 100
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < pokemonRecords.length; i += batchSize) {
      const batch = pokemonRecords.slice(i, i + batchSize);
      await db.insert(pokemon).values(batch);
      totalInserted += batch.length;
    }

    return NextResponse.json(
      {
        success: true,
        count: totalInserted,
        message: `Successfully imported ${totalInserted} Pokemon`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { 
        error: `Internal server error: ${error instanceof Error ? error.message : 'Import failed'}`
      },
      { status: 500 }
    );
  }
}