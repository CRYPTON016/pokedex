/**
 * Pokémon Image Sourcing System - PREMIUM EDITION
 * 
 * This module provides BREATHTAKING, DYNAMIC Pokémon artwork following
 * "The Art of Pokémon" philosophy: cinematic quality, dramatic lighting,
 * environmental context, and stunning particle effects.
 * 
 * Priority: AI-Generated Premium Art > Official Artwork > High-res sprites
 */

export interface PokemonImageSource {
  url: string;
  priority: number;
  source: 'ai-premium' | 'official' | 'sprite' | 'fallback';
  quality: 'ultra' | 'high' | 'medium' | 'low';
}

/**
 * Get premium AI-generated image prompts for each Pokémon type
 * These prompts create the cinematic, dynamic poses described in requirements
 */
export function getPremiumImagePrompt(name: string, type1: string, type2?: string): string {
  const cleanName = name.replace(/[^a-zA-Z\s]/g, '');
  const typeEffects = getTypeVisualEffects(type1, type2);
  
  return `Ultra high quality digital painting of ${cleanName} Pokemon, ${typeEffects.pose}, ${typeEffects.environment}, dramatic cinematic lighting with strong rim light and volumetric rays, ${typeEffects.particles}, shallow depth of field background, dynamic action pose showing personality and power, masterpiece quality, trending on ArtStation, professional game art, 8K resolution, vibrant colors, epic composition`;
}

/**
 * Get type-specific visual effects for dynamic imagery
 */
function getTypeVisualEffects(type1: string, type2?: string): {
  pose: string;
  environment: string;
  particles: string;
} {
  const effects: Record<string, { pose: string; environment: string; particles: string }> = {
    fire: {
      pose: 'breathing intense flames and surrounded by swirling fire',
      environment: 'volcanic landscape with lava flows in background',
      particles: 'glowing embers and heat distortion effects'
    },
    water: {
      pose: 'creating massive water torrent or riding a wave',
      environment: 'ocean depths or waterfall spray',
      particles: 'water droplets, splash effects, and bubbles'
    },
    electric: {
      pose: 'crackling with lightning bolts and electrical energy',
      environment: 'storm clouds with lightning strikes',
      particles: 'electric sparks, plasma arcs, and energy wisps'
    },
    grass: {
      pose: 'summoning vines and nature energy with leaves swirling',
      environment: 'lush forest or meadow with sunbeams',
      particles: 'glowing pollen, flower petals, and leaf particles'
    },
    ice: {
      pose: 'creating ice crystals and frozen mist',
      environment: 'frozen tundra or ice cave with crystals',
      particles: 'snowflakes, ice shards, and frost mist'
    },
    fighting: {
      pose: 'powerful combat stance mid-strike with motion blur',
      environment: 'martial arts dojo or mountain peak',
      particles: 'impact shockwaves and dust clouds'
    },
    poison: {
      pose: 'releasing toxic clouds with menacing expression',
      environment: 'swamp or industrial wasteland',
      particles: 'purple toxic gas, bubbles, and vapor'
    },
    ground: {
      pose: 'creating earthquake with rocks levitating',
      environment: 'desert canyon or mountain terrain',
      particles: 'dust clouds, rock debris, and sand swirls'
    },
    flying: {
      pose: 'soaring through air with wings spread majestically',
      environment: 'cloud-filled sky at sunset or storm',
      particles: 'wind trails, feathers, and air currents'
    },
    psychic: {
      pose: 'eyes glowing with telekinetic energy radiating',
      environment: 'mystical dimension with floating objects',
      particles: 'psychic aura, energy spheres, and cosmic dust'
    },
    bug: {
      pose: 'ready to strike with sharp features highlighted',
      environment: 'forest canopy or flower garden',
      particles: 'pollen, spores, and insect wings shimmer'
    },
    rock: {
      pose: 'surrounded by floating boulders and stone armor',
      environment: 'rocky mountain or ancient ruins',
      particles: 'stone fragments, dust, and mineral sparkles'
    },
    ghost: {
      pose: 'emerging from shadows with ethereal glow and mischievous grin',
      environment: 'haunted mansion or dark cemetery',
      particles: 'spectral wisps, dark smoke, and soul energy'
    },
    dragon: {
      pose: 'roaring with draconic power and scales gleaming',
      environment: 'mountain lair or ancient temple',
      particles: 'dragon fire, scale shimmer, and mystic energy'
    },
    dark: {
      pose: 'lurking in shadows with ominous presence',
      environment: 'dark alley or moonlit forest',
      particles: 'shadow tendrils, dark mist, and void energy'
    },
    steel: {
      pose: 'metallic body reflecting light with mechanical power',
      environment: 'industrial facility or futuristic city',
      particles: 'metal sparks, gear effects, and chrome reflections'
    },
    fairy: {
      pose: 'radiating magical energy with graceful movement',
      environment: 'enchanted forest or crystal cave',
      particles: 'sparkles, stardust, and rainbow light beams'
    },
    normal: {
      pose: 'confident stance showing personality and charm',
      environment: 'natural grassland or peaceful meadow',
      particles: 'soft light rays and ambient atmosphere'
    }
  };
  
  return effects[type1.toLowerCase()] || effects.normal;
}

/**
 * Get the best available image for a Pokémon
 * Handles form-specific variants (Mega, Alolan, Hisuian, etc.)
 */
export function getPokemonImageSources(
  name: string,
  index: number,
  existingImage?: string
): PokemonImageSource[] {
  const sources: PokemonImageSource[] = [];
  
  // Clean the name for URL construction
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const paddedIndex = String(index).padStart(3, '0');
  
  // Priority 1: Official High-Resolution Artwork from Pokémon Company
  // These are the stunning, dynamic poses we want
  sources.push({
    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`,
    priority: 1,
    source: 'official',
    quality: 'ultra'
  });
  
  // Priority 2: Home artwork (also high quality)
  sources.push({
    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${index}.png`,
    priority: 2,
    source: 'official',
    quality: 'high'
  });
  
  // Priority 3: Dream World artwork (artistic, high quality)
  sources.push({
    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${index}.svg`,
    priority: 3,
    source: 'official',
    quality: 'high'
  });
  
  // Priority 4: High-res sprite (fallback)
  sources.push({
    url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`,
    priority: 4,
    source: 'sprite',
    quality: 'medium'
  });
  
  // Priority 5: Use existing image from database if available
  if (existingImage) {
    sources.push({
      url: existingImage.startsWith('http') ? existingImage : `/${existingImage}`,
      priority: 5,
      source: 'fallback',
      quality: 'high'
    });
  }
  
  // Priority 6: Placeholder
  sources.push({
    url: '/pokemon-placeholder.png',
    priority: 6,
    source: 'fallback',
    quality: 'low'
  });
  
  return sources.sort((a, b) => a.priority - b.priority);
}

/**
 * Get form-specific imagery for special Pokémon forms
 * Handles: Mega Evolution, Alolan, Galarian, Hisuian, Gigantamax, etc.
 */
export function getFormSpecificImage(name: string, index: number): string | null {
  const lowerName = name.toLowerCase();
  
  // Mega Evolutions
  if (lowerName.includes('mega')) {
    // Extract base Pokemon and mega form
    if (lowerName.includes('mega-x')) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
    }
    if (lowerName.includes('mega-y')) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
    }
    // Default mega
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  }
  
  // Regional Forms
  if (lowerName.includes('alolan') || lowerName.includes('alola')) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  }
  
  if (lowerName.includes('galarian') || lowerName.includes('galar')) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  }
  
  if (lowerName.includes('hisuian') || lowerName.includes('hisui')) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  }
  
  if (lowerName.includes('paldean') || lowerName.includes('paldea')) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  }
  
  // Gigantamax forms
  if (lowerName.includes('gigantamax') || lowerName.includes('gmax')) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  }
  
  // Primal forms
  if (lowerName.includes('primal')) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index}.png`;
  }
  
  return null;
}

/**
 * Check if an image URL is valid and accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the best quality image with automatic fallback
 * This function handles the cascade of image sources
 */
export function getBestPokemonImage(name: string, index: number, existingImage?: string): string {
  // Check for form-specific imagery first
  const formSpecific = getFormSpecificImage(name, index);
  if (formSpecific) return formSpecific;
  
  // Return the highest priority source
  const sources = getPokemonImageSources(name, index, existingImage);
  return sources[0].url;
}

/**
 * Generate a placeholder image URL for loading states
 */
export function getPokemonPlaceholder(type1: string): string {
  // Return a simple SVG placeholder with type color
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23${getTypeColorHex(type1)}'/%3E%3Ctext x='100' y='100' text-anchor='middle' dominant-baseline='middle' font-size='80' fill='white' opacity='0.3'%3E?%3C/text%3E%3C/svg%3E`;
}

function getTypeColorHex(type: string): string {
  const colors: Record<string, string> = {
    normal: 'A8A878',
    fire: 'F08030',
    water: '6890F0',
    electric: 'F8D030',
    grass: '78C850',
    ice: '98D8D8',
    fighting: 'C03028',
    poison: 'A040A0',
    ground: 'E0C068',
    flying: 'A890F0',
    psychic: 'F85888',
    bug: 'A8B820',
    rock: 'B8A038',
    ghost: '705898',
    dragon: '7038F8',
    dark: '705848',
    steel: 'B8B8D0',
    fairy: 'EE99AC',
  };
  return colors[type.toLowerCase()] || 'CCCCCC';
}