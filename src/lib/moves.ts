export type MoveMethod = 'level-up' | 'tm' | 'egg' | 'tutor' | 'machine' | 'other';

export type PokemonMove = {
  name: string;
  method: MoveMethod;
  level?: number;
  detail?: string;
};

// Minimal example learnsets keyed by National Dex index
export const MOVES: Record<number, PokemonMove[]> = {
  1: [
    { name: 'Tackle', method: 'level-up', level: 1 },
    { name: 'Growl', method: 'level-up', level: 3 },
    { name: 'Leech Seed', method: 'level-up', level: 7 },
    { name: 'Vine Whip', method: 'level-up', level: 9 },
  ],
  4: [
    { name: 'Scratch', method: 'level-up', level: 1 },
    { name: 'Ember', method: 'level-up', level: 7 },
    { name: 'Smokescreen', method: 'level-up', level: 10 },
    { name: 'Flamethrower', method: 'tm', detail: 'TM35' },
  ],
  7: [
    { name: 'Tackle', method: 'level-up', level: 1 },
    { name: 'Bubble', method: 'level-up', level: 4 },
    { name: 'Withdraw', method: 'level-up', level: 7 },
    { name: 'Surf', method: 'tm', detail: 'HM03/TM??' },
  ],
  25: [
    { name: 'Thunder Shock', method: 'level-up', level: 1 },
    { name: 'Quick Attack', method: 'level-up', level: 11 },
    { name: 'Thunderbolt', method: 'tm', detail: 'TM24' },
  ],
  133: [
    { name: 'Tackle', method: 'level-up', level: 1 },
    { name: 'Bite', method: 'level-up', level: 5 },
    { name: 'Swift', method: 'tm', detail: 'TM??' },
  ],
};

export default MOVES;
