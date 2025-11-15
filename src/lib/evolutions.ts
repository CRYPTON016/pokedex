// Evolution mapping keyed by National Dex index (the `index` field in DB).
// Each entry is an ordered array representing the evolution chain with optional trigger metadata.
// Chain items: { index: number, trigger?: string, value?: string | number }
export type EvolutionStep = {
  index: number;
  trigger?: 'level' | 'item' | 'trade' | 'friendship' | 'stone' | 'other';
  value?: string | number; // e.g., level number or item name
};

export const EVOLUTIONS: Record<number, EvolutionStep[]> = {
  // Kanto starters
  1: [
    { index: 1 },
    { index: 2, trigger: 'level', value: 16 },
    { index: 3, trigger: 'level', value: 32 },
  ],
  2: [ { index: 1 }, { index: 2, trigger: 'level', value: 16 }, { index: 3, trigger: 'level', value: 32 } ],
  3: [ { index: 1 }, { index: 2, trigger: 'level', value: 16 }, { index: 3, trigger: 'level', value: 32 } ],

  4: [ { index: 4 }, { index: 5, trigger: 'level', value: 16 }, { index: 6, trigger: 'level', value: 36 } ],
  5: [ { index: 4 }, { index: 5, trigger: 'level', value: 16 }, { index: 6, trigger: 'level', value: 36 } ],
  6: [ { index: 4 }, { index: 5, trigger: 'level', value: 16 }, { index: 6, trigger: 'level', value: 36 } ],

  7: [ { index: 7 }, { index: 8, trigger: 'level', value: 16 }, { index: 9, trigger: 'level', value: 36 } ],
  8: [ { index: 7 }, { index: 8, trigger: 'level', value: 16 }, { index: 9, trigger: 'level', value: 36 } ],
  9: [ { index: 7 }, { index: 8, trigger: 'level', value: 16 }, { index: 9, trigger: 'level', value: 36 } ],

  // Pikachu family
  172: [ { index: 172 }, { index: 25, trigger: 'friendship', value: 'high' }, { index: 26, trigger: 'stone', value: 'Thunder Stone' } ],
  25: [ { index: 172 }, { index: 25, trigger: 'friendship', value: 'high' }, { index: 26, trigger: 'stone', value: 'Thunder Stone' } ],
  26: [ { index: 172 }, { index: 25, trigger: 'friendship', value: 'high' }, { index: 26, trigger: 'stone', value: 'Thunder Stone' } ],

  // Eevee example
  133: [
    { index: 133 },
    { index: 134, trigger: 'stone', value: 'Water Stone' },
    { index: 135, trigger: 'stone', value: 'Thunder Stone' },
    { index: 136, trigger: 'stone', value: 'Fire Stone' },
  ],
  134: [ { index: 133 }, { index: 134, trigger: 'stone', value: 'Water Stone' } ],
  135: [ { index: 133 }, { index: 135, trigger: 'stone', value: 'Thunder Stone' } ],
  136: [ { index: 133 }, { index: 136, trigger: 'stone', value: 'Fire Stone' } ],

  // Caterpie chain
  10: [ { index: 10 }, { index: 11, trigger: 'level', value: 7 }, { index: 12, trigger: 'level', value: 10 } ],
};

export default EVOLUTIONS;
