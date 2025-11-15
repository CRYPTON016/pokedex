export interface Pokemon {
  id: number;
  pokemon: string;
  type: string;
  species: string;
  height: string;
  weight: string;
  abilities: string;
  evYield: string;
  catchRate: string;
  baseFriendship: string;
  baseExp: string;
  growthRate: string;
  eggGroups: string;
  gender: string;
  eggCycles: string;
  hpBase: number;
  hpMin: number;
  hpMax: number;
  attackBase: number;
  attackMin: number;
  attackMax: number;
  defenseBase: number;
  defenseMin: number;
  defenseMax: number;
  specialAttackBase: number;
  specialAttackMin: number;
  specialAttackMax: number;
  specialDefenseBase: number;
  specialDefenseMin: number;
  specialDefenseMax: number;
  speedBase: number;
  speedMin: number;
  speedMax: number;
  unnamed32: string | null;
  unnamed33: string | null;
  image: string;
  index: number;
  name: string;
  type1: string;
  type2: string | null;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
  createdAt: string;
  updatedAt: string;
}

export interface PokemonListResponse {
  data: Pokemon[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}