"use client";

import { Pokemon } from "@/lib/types";
import { getTypeClass } from "@/lib/pokemon-types";
import { motion } from "framer-motion";
import Link from "next/link";
import { PokemonImage } from "@/components/pokemon-image";
import { Star } from "lucide-react";

interface PokemonCardProps {
  pokemon: Pokemon;
  index: number;
}

export const PokemonCard = ({ pokemon, index }: PokemonCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.03, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -16, scale: 1.04 }}
      className="group"
    >
      <Link href={`/pokedex/${pokemon.id}`}>
        <div className="relative glass-strong rounded-3xl p-7 h-full transition-all duration-500 hover:shadow-2xl overflow-hidden border-2 border-border/50 hover:border-primary/60 pokemon-card">
          {/* Animated glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-3xl -z-10"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${getTypeClass(pokemon.type1)}60, transparent 70%)`,
            }}
          />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pokemon-card-shimmer pointer-events-none" />
          
          <div className="relative z-10">
            {/* Number & Star */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-black text-muted-foreground bg-muted/60 px-4 py-1.5 rounded-full border border-border/50">
                #{String(pokemon.index).padStart(4, "0")}
              </span>
              <Star className="h-5 w-5 text-secondary opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            
            {/* Pokemon Image */}
            <div className="mb-6 flex items-center justify-center group-hover:scale-115 transition-transform duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl scale-75 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <PokemonImage
                name={pokemon.name}
                index={pokemon.index}
                type1={pokemon.type1}
                existingImage={pokemon.image}
                width={150}
                height={150}
                showLoadingSpinner={false}
              />
            </div>
            
            {/* Pokemon Name */}
            <h3 className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors duration-300 line-clamp-1 text-center">
              {pokemon.name}
            </h3>
            
            {/* Type Badges */}
            <div className="flex gap-2 flex-wrap justify-center">
              <span
                className={`${getTypeClass(pokemon.type1)} text-white text-sm font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-lg transition-all duration-300 group-hover:scale-110`}
              >
                {pokemon.type1}
              </span>
              {pokemon.type2 && (
                <span
                  className={`${getTypeClass(pokemon.type2)} text-white text-sm font-black px-5 py-2 rounded-full uppercase tracking-wider shadow-lg transition-all duration-300 group-hover:scale-110`}
                >
                  {pokemon.type2}
                </span>
              )}
            </div>
          </div>
          
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/30 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.div>
  );
};