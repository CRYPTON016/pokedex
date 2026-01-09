// Client-side PokeAPI service for static site

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }

  const data = await response.json();
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}

// Types for PokeAPI responses
export interface PokemonListResult {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
}

export interface PokeAPIPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
  moves: PokemonMove[];
}

export interface PokemonSpecies {
  id: number;
  name: string;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  growth_rate: {
    name: string;
    url: string;
  };
  egg_groups: Array<{ name: string; url: string }>;
  evolution_chain: { url: string };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }>;
  genera: Array<{
    genus: string;
    language: { name: string };
  }>;
}

// Simplified Pokemon type for our app
export interface Pokemon {
  id: number;
  index: number;
  name: string;
  pokemon: string;
  type1: string;
  type2: string | null;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  total: number;
  height: number;
  weight: number;
  abilities: string;
  image: string | null;
}

// Convert PokeAPI Pokemon to our format
function convertPokemon(pokemon: PokeAPIPokemon): Pokemon {
  const stats = pokemon.stats.reduce((acc, stat) => {
    const name = stat.stat.name.replace("-", "");
    acc[name] = stat.base_stat;
    return acc;
  }, {} as Record<string, number>);

  return {
    id: pokemon.id,
    index: pokemon.id,
    name: pokemon.name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    pokemon: pokemon.name,
    type1: pokemon.types[0]?.type.name.charAt(0).toUpperCase() + pokemon.types[0]?.type.name.slice(1) || "",
    type2: pokemon.types[1] ? pokemon.types[1].type.name.charAt(0).toUpperCase() + pokemon.types[1].type.name.slice(1) : null,
    hp: stats.hp || 0,
    attack: stats.attack || 0,
    defense: stats.defense || 0,
    spAttack: stats.specialattack || 0,
    spDefense: stats.specialdefense || 0,
    speed: stats.speed || 0,
    total: (stats.hp || 0) + (stats.attack || 0) + (stats.defense || 0) + (stats.specialattack || 0) + (stats.specialdefense || 0) + (stats.speed || 0),
    height: pokemon.height / 10, // Convert to meters
    weight: pokemon.weight / 10, // Convert to kg
    abilities: pokemon.abilities.map(a => a.ability.name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")).join(", "),
    image: pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
  };
}

// Fetch list of Pokemon
export async function fetchPokemonList(limit = 24, offset = 0): Promise<{ data: Pokemon[]; total: number }> {
  const response = await fetchWithCache<PokemonListResponse>(
    `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`
  );

  // Fetch details for each Pokemon in parallel (with batching)
  const pokemonDetails = await Promise.all(
    response.results.map(async (result) => {
      try {
        const pokemon = await fetchWithCache<PokeAPIPokemon>(result.url);
        return convertPokemon(pokemon);
      } catch {
        return null;
      }
    })
  );

  return {
    data: pokemonDetails.filter((p): p is Pokemon => p !== null),
    total: response.count,
  };
}

// Fetch single Pokemon by ID or name
export async function fetchPokemon(idOrName: string | number): Promise<Pokemon | null> {
  try {
    const pokemon = await fetchWithCache<PokeAPIPokemon>(
      `${POKEAPI_BASE}/pokemon/${idOrName}`
    );
    return convertPokemon(pokemon);
  } catch {
    return null;
  }
}

// Fetch Pokemon species data
export async function fetchPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies | null> {
  try {
    return await fetchWithCache<PokemonSpecies>(
      `${POKEAPI_BASE}/pokemon-species/${idOrName}`
    );
  } catch {
    return null;
  }
}

// Search Pokemon by name (client-side filtering)
export async function searchPokemon(
  query: string,
  type1Filter: string | null,
  type2Filter: string | null,
  limit = 24,
  offset = 0
): Promise<{ data: Pokemon[]; total: number }> {
  // First get a larger list to filter from (up to 1025 Pokemon)
  // For better performance, we could pre-load all Pokemon data
  const allPokemon = await fetchPokemonList(200, 0);

  let filtered = allPokemon.data;

  // Apply search filter
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.pokemon.toLowerCase().includes(q) ||
        p.id.toString() === q
    );
  }

  // Apply type filters
  if (type1Filter && type1Filter !== "all") {
    filtered = filtered.filter((p) => p.type1.toLowerCase() === type1Filter.toLowerCase());
  }

  if (type2Filter && type2Filter !== "all") {
    filtered = filtered.filter((p) => p.type2?.toLowerCase() === type2Filter.toLowerCase());
  }

  // Return paginated results
  const total = filtered.length;
  const data = filtered.slice(offset, offset + limit);

  return { data, total };
}

// Get Pokemon type list
export async function fetchTypes(): Promise<string[]> {
  try {
    const response = await fetchWithCache<{ results: Array<{ name: string }> }>(
      `${POKEAPI_BASE}/type`
    );
    return response.results
      .map((t) => t.name.charAt(0).toUpperCase() + t.name.slice(1))
      .filter((t) => t !== "Unknown" && t !== "Shadow");
  } catch {
    return [];
  }
}
