"use client";

import { useState } from "react";
import Image from "next/image";
import { getBestPokemonImage, getPokemonImageSources, getPokemonPlaceholder } from "@/lib/pokemon-images";
import { Loader2 } from "lucide-react";

interface PokemonImageProps {
  name: string;
  index: number;
  type1: string;
  existingImage?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  showLoadingSpinner?: boolean;
}

/**
 * Smart Pokémon Image Component
 * Automatically handles fallback to multiple high-quality sources
 * with proper loading and error states
 */
export function PokemonImage({
  name,
  index,
  type1,
  existingImage,
  width = 200,
  height = 200,
  className = "",
  priority = false,
  showLoadingSpinner = true,
}: PokemonImageProps) {
  const [imageUrl, setImageUrl] = useState(() => getBestPokemonImage(name, index, existingImage));
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  
  const sources = getPokemonImageSources(name, index, existingImage);
  
  const handleImageError = () => {
    // Try next source in the cascade
    const nextIndex = currentSourceIndex + 1;
    if (nextIndex < sources.length) {
      setCurrentSourceIndex(nextIndex);
      setImageUrl(sources[nextIndex].url);
      setImageError(false);
    } else {
      // All sources failed, use placeholder
      setImageUrl(getPokemonPlaceholder(type1));
      setImageError(true);
    }
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  return (
    <div className={`relative pokemon-image-container ${className}`} style={{ width, height }}>
      {/* Loading Spinner */}
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-lg backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary pokeball-spinner" />
        </div>
      )}
      
      {/* Image */}
      <Image
        src={imageUrl}
        alt={`${name} - Official Pokémon Artwork`}
        width={width}
        height={height}
        className={`object-contain transition-all duration-500 ${
          isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority={priority}
        unoptimized
      />
      
      {/* Subtle shimmer effect on hover */}
      <div className="absolute inset-0 pokemon-card-shimmer opacity-0 hover:opacity-100 transition-opacity pointer-events-none rounded-lg" />
    </div>
  );
}