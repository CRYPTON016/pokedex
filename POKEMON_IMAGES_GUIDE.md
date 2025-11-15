# 🎨 Pokémon Image Sourcing Guide

## Overview
The Pokédex Arcana uses a sophisticated image sourcing system that automatically fetches **high-quality, dynamic, and artistic** Pokémon artwork from official sources.

## Image Quality Philosophy
✨ **"The Art of Pokémon"** - Every image should be:
- **Dynamic**: Action poses, abilities in use, emotional expressions
- **Cinematic**: Dramatic lighting, environmental context, particle effects
- **High-Fidelity**: Detailed digital painting quality, vibrant colors
- **Form-Accurate**: Mega Evolutions, Regional Forms, and special variants

## Automatic Image Sources (Priority Order)

### 1. **Official High-Resolution Artwork** (Highest Priority)
**Source**: PokeAPI Official Artwork Collection
- ✅ Stunning, dynamic poses
- ✅ Professional quality (475x475px+)
- ✅ Used in official Pokémon media
- 🔗 `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{index}.png`

**Examples**:
- Charizard breathing fire mid-flight
- Gengar emerging from shadows
- Gyarados mid-roar with water effects

### 2. **Pokémon HOME Artwork** (Secondary)
**Source**: Pokémon HOME sprite collection
- ✅ Clean, modern style
- ✅ Consistent quality across all generations
- 🔗 `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/{index}.png`

### 3. **Dream World Artwork** (Tertiary)
**Source**: Pokémon Dream World collection
- ✅ Artistic, stylized vectors
- ✅ SVG format for perfect scaling
- 🔗 `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/{index}.svg`

### 4. **High-Res Sprite** (Fallback)
**Source**: Standard sprite collection
- 📊 96x96px sprites
- 🔧 Used only when official artwork unavailable

### 5. **Database Image** (Custom)
- Your uploaded custom images
- Preserved as final fallback

## Special Forms Support

### ✨ Mega Evolutions
**Auto-detected forms**: 
- Mega Venusaur, Mega Charizard X/Y, Mega Blastoise
- Automatically pulls Mega-specific artwork

### 🌴 Regional Forms
**Supported regions**:
- **Alolan**: Alolan Raichu, Alolan Vulpix, etc.
- **Galarian**: Galarian Ponyta, Galarian Farfetch'd, etc.
- **Hisuian**: Hisuian Zorua, Hisuian Growlithe, etc.
- **Paldean**: Paldean Tauros, Paldean Wooper, etc.

### ⚡ Other Special Forms
- **Gigantamax**: G-Max Charizard, G-Max Pikachu
- **Primal**: Primal Groudon, Primal Kyogre
- **Battle Forms**: Aegislash Blade/Shield

## Implementation

### Basic Usage
```tsx
import { PokemonImage } from "@/components/pokemon-image";

<PokemonImage
  name="Charizard"
  index={6}
  type1="Fire"
  width={300}
  height={300}
  priority
  showLoadingSpinner
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | Required | Pokémon name (handles form detection) |
| `index` | number | Required | National Pokédex number |
| `type1` | string | Required | Primary type (for placeholder color) |
| `existingImage` | string | Optional | Custom image URL from database |
| `width` | number | 200 | Image width in pixels |
| `height` | number | 200 | Image height in pixels |
| `className` | string | "" | Additional CSS classes |
| `priority` | boolean | false | Next.js priority loading |
| `showLoadingSpinner` | boolean | true | Show loading animation |

## Features

### 🔄 Automatic Fallback Cascade
If an image fails to load, the system automatically tries the next source:
```
Official Artwork → HOME Artwork → Dream World → Sprite → Database → Placeholder
```

### ⚡ Smart Loading States
- Smooth fade-in transitions
- Animated Poké Ball spinner during load
- Type-colored placeholder for failed loads

### 🏆 Quality Indicators
- **HD Badge**: Appears on official high-quality artwork
- Visible in top-right corner of images

### 🎭 Form-Specific Detection
The system intelligently detects special forms from the Pokémon name:
```tsx
// Automatically loads correct form
<PokemonImage name="Alolan Raichu" index={26} type1="Electric" />
<PokemonImage name="Mega Charizard X" index={6} type1="Fire" />
<PokemonImage name="Hisuian Zoroark" index={571} type1="Dark" />
```

## Image Quality Standards

### ✅ PREFERRED (What we use)
- **Dynamic action poses**: Pokémon using abilities, mid-motion
- **Cinematic composition**: Dramatic angles, depth of field
- **Environmental context**: Natural habitat backgrounds (even if blurred)
- **Particle effects**: Fire embers, water droplets, energy auras
- **Emotional expression**: Personality and character

### ❌ AVOIDED
- Static "T-pose" sprites
- Low-resolution pixel art (unless necessary)
- Overly cartoonish or abstract styles
- Generic forward-facing poses

## Technical Implementation

### Utility Functions
Located in `src/lib/pokemon-images.ts`:

#### `getBestPokemonImage(name, index, existingImage?)`
Returns the highest priority image URL for a Pokémon.

#### `getPokemonImageSources(name, index, existingImage?)`
Returns array of all available sources sorted by priority.

#### `getFormSpecificImage(name, index)`
Detects and returns form-specific artwork URLs.

#### `getPokemonPlaceholder(type1)`
Generates type-colored SVG placeholder for failed loads.

### Component Architecture
`<PokemonImage />` component handles:
- Automatic source cascading on error
- Loading state management
- Smooth transitions and animations
- Quality badge display
- Responsive sizing

## Performance Optimization

### Next.js Image Optimization
- Uses Next.js `<Image />` component
- Automatic lazy loading (except `priority` images)
- `unoptimized` flag for external CDN images

### Loading Strategies
- **Grid views**: Lazy load, no spinner (cleaner appearance)
- **Detail pages**: Priority load with spinner (better UX)
- **Staggered animations**: Cards animate in sequence

### Caching
- Browser automatically caches PokeAPI images
- CDN edge locations for fast global delivery
- No server-side image processing needed

## Customization

### Adding Custom Image Sources
Edit `src/lib/pokemon-images.ts`:

```typescript
export function getPokemonImageSources(...) {
  sources.push({
    url: 'your-custom-cdn-url',
    priority: 1, // Lower = higher priority
    source: 'official'
  });
}
```

### Styling Image Containers
Apply CSS classes to the component:

```tsx
<PokemonImage
  className="hover:scale-110 transition-transform duration-300"
  {...props}
/>
```

## Troubleshooting

### Image Not Loading?
1. **Check Network**: Verify PokeAPI CDN is accessible
2. **Verify Index**: Ensure Pokédex number is correct (1-1025+)
3. **Check Console**: Browser console shows which sources failed
4. **Form Names**: Verify special form names are spelled correctly

### Slow Loading?
- **Preload priority images**: Set `priority={true}` for above-fold images
- **Reduce grid size**: Show fewer Pokémon per page
- **Check network speed**: CDN may be slow in some regions

### Wrong Form Displayed?
- **Name accuracy**: Ensure form name exactly matches (e.g., "Alolan Raichu")
- **Index number**: Some forms have separate indices
- **Update function**: Edit `getFormSpecificImage()` to add missing forms

## Future Enhancements

### Potential Improvements
- 🎨 **AI-Generated Alternatives**: Fallback to AI-generated artistic renders
- 🌈 **Animated Sprites**: Support for GIF/video animations
- 🖼️ **Multiple Views**: Front/back/shiny variant toggle
- 📱 **WebP Format**: Use modern formats for better compression
- 🎭 **3D Models**: Integration of 3D Pokémon models

### Community Contributions
To add your own high-quality Pokémon artwork:
1. Host images on a reliable CDN
2. Update `getPokemonImageSources()` with your URLs
3. Maintain consistent naming conventions
4. Ensure proper form variant support

## Credits

### Image Sources
- **PokeAPI**: Primary image provider ([pokeapi.co](https://pokeapi.co))
- **The Pokémon Company International**: Original artwork copyright
- **Nintendo/Game Freak**: Pokémon franchise creators

### Legal Notice
All Pokémon images are © Nintendo/Creatures Inc./GAME FREAK inc.
This project is a fan-made educational tool and claims no ownership of Pokémon assets.

---

**Built with ❤️ for the Pokédex Arcana project**