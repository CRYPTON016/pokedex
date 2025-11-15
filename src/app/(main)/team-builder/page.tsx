"use client";

import { useState, useEffect } from "react";
import { Pokemon } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Search, Loader2, Shield, Swords, Zap } from "lucide-react";
import Image from "next/image";
import { getTypeClass, POKEMON_TYPES } from "@/lib/pokemon-types";
import { motion, AnimatePresence } from "framer-motion";

// Type effectiveness chart (simplified)
const TYPE_EFFECTIVENESS: Record<string, { weakTo: string[]; resistantTo: string[]; immuneTo: string[] }> = {
  Normal: { weakTo: ["Fighting"], resistantTo: [], immuneTo: ["Ghost"] },
  Fire: { weakTo: ["Water", "Ground", "Rock"], resistantTo: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"], immuneTo: [] },
  Water: { weakTo: ["Electric", "Grass"], resistantTo: ["Fire", "Water", "Ice", "Steel"], immuneTo: [] },
  Electric: { weakTo: ["Ground"], resistantTo: ["Electric", "Flying", "Steel"], immuneTo: [] },
  Grass: { weakTo: ["Fire", "Ice", "Poison", "Flying", "Bug"], resistantTo: ["Water", "Electric", "Grass", "Ground"], immuneTo: [] },
  Ice: { weakTo: ["Fire", "Fighting", "Rock", "Steel"], resistantTo: ["Ice"], immuneTo: [] },
  Fighting: { weakTo: ["Flying", "Psychic", "Fairy"], resistantTo: ["Bug", "Rock", "Dark"], immuneTo: [] },
  Poison: { weakTo: ["Ground", "Psychic"], resistantTo: ["Grass", "Fighting", "Poison", "Bug", "Fairy"], immuneTo: [] },
  Ground: { weakTo: ["Water", "Grass", "Ice"], resistantTo: ["Poison", "Rock"], immuneTo: ["Electric"] },
  Flying: { weakTo: ["Electric", "Ice", "Rock"], resistantTo: ["Grass", "Fighting", "Bug"], immuneTo: ["Ground"] },
  Psychic: { weakTo: ["Bug", "Ghost", "Dark"], resistantTo: ["Fighting", "Psychic"], immuneTo: [] },
  Bug: { weakTo: ["Fire", "Flying", "Rock"], resistantTo: ["Grass", "Fighting", "Ground"], immuneTo: [] },
  Rock: { weakTo: ["Water", "Grass", "Fighting", "Ground", "Steel"], resistantTo: ["Normal", "Fire", "Poison", "Flying"], immuneTo: [] },
  Ghost: { weakTo: ["Ghost", "Dark"], resistantTo: ["Poison", "Bug"], immuneTo: ["Normal", "Fighting"] },
  Dragon: { weakTo: ["Ice", "Dragon", "Fairy"], resistantTo: ["Fire", "Water", "Electric", "Grass"], immuneTo: [] },
  Dark: { weakTo: ["Fighting", "Bug", "Fairy"], resistantTo: ["Ghost", "Dark"], immuneTo: ["Psychic"] },
  Steel: { weakTo: ["Fire", "Fighting", "Ground"], resistantTo: ["Normal", "Grass", "Ice", "Flying", "Psychic", "Bug", "Rock", "Dragon", "Steel", "Fairy"], immuneTo: ["Poison"] },
  Fairy: { weakTo: ["Poison", "Steel"], resistantTo: ["Fighting", "Bug", "Dark"], immuneTo: ["Dragon"] },
};

export default function TeamBuilderPage() {
  const [team, setTeam] = useState<(Pokemon | null)[]>([null, null, null, null, null, null]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  const searchPokemon = async () => {
    if (!search) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/pokemon?search=${search}&limit=20`);
      const data = await res.json();
      setSearchResults(data.data);
    } catch (error) {
      console.error("Error searching pokemon:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (search) {
      const timer = setTimeout(searchPokemon, 300);
      return () => clearTimeout(timer);
    }
  }, [search]);
  
  const addToTeam = (pokemon: Pokemon) => {
    if (selectedSlot !== null) {
      const newTeam = [...team];
      newTeam[selectedSlot] = pokemon;
      setTeam(newTeam);
      setShowSearch(false);
      setSearch("");
      setSearchResults([]);
      setSelectedSlot(null);
    }
  };
  
  const removeFromTeam = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };
  
  const openSearch = (index: number) => {
    setSelectedSlot(index);
    setShowSearch(true);
  };
  
  // Calculate team defensive analysis
  const calculateDefensiveAnalysis = () => {
    const analysis: Record<string, { weak: number; resistant: number; immune: number }> = {};
    
    POKEMON_TYPES.forEach((type) => {
      analysis[type] = { weak: 0, resistant: 0, immune: 0 };
    });
    
    team.forEach((pokemon) => {
      if (pokemon) {
        const type1Eff = TYPE_EFFECTIVENESS[pokemon.type1];
        const type2Eff = pokemon.type2 ? TYPE_EFFECTIVENESS[pokemon.type2] : null;
        
        POKEMON_TYPES.forEach((attackType) => {
          // Check type 1
          if (type1Eff.weakTo.includes(attackType)) analysis[attackType].weak++;
          if (type1Eff.resistantTo.includes(attackType)) analysis[attackType].resistant++;
          if (type1Eff.immuneTo.includes(attackType)) analysis[attackType].immune++;
          
          // Check type 2
          if (type2Eff) {
            if (type2Eff.weakTo.includes(attackType)) analysis[attackType].weak++;
            if (type2Eff.resistantTo.includes(attackType)) analysis[attackType].resistant++;
            if (type2Eff.immuneTo.includes(attackType)) analysis[attackType].immune++;
          }
        });
      }
    });
    
    return analysis;
  };
  
  const defensiveAnalysis = calculateDefensiveAnalysis();
  
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block relative mb-4">
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              TEAM BUILDER
            </h1>
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl -z-10 animate-pulse-slow" />
          </div>
          <p className="text-xl text-muted-foreground">
            <Shield className="inline h-5 w-5 mr-2" />
            Build your ultimate 6-Pokémon team
          </p>
        </div>
        
        {/* Team Slots */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {team.map((pokemon, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-strong rounded-2xl p-6 aspect-square flex flex-col items-center justify-center relative group border-2 border-border/50 hover:border-primary/50 transition-all"
            >
              {pokemon ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-white rounded-full"
                    onClick={() => removeFromTeam(index)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  
                  <Image
                    src={pokemon.image.startsWith('http') ? pokemon.image : `/${pokemon.image}`}
                    alt={pokemon.name}
                    width={90}
                    height={90}
                    className="mb-3 group-hover:scale-110 transition-transform"
                    unoptimized
                  />
                  
                  <p className="text-base font-bold text-center line-clamp-1">{pokemon.name}</p>
                  
                  <div className="flex gap-1 mt-3">
                    <span className={`${getTypeClass(pokemon.type1)} text-white text-[9px] px-2 py-1 rounded-full font-bold`}>
                      {pokemon.type1}
                    </span>
                    {pokemon.type2 && (
                      <span className={`${getTypeClass(pokemon.type2)} text-white text-[9px] px-2 py-1 rounded-full font-bold`}>
                        {pokemon.type2}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-24 w-24 rounded-full border-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all"
                  onClick={() => openSearch(index)}
                >
                  <Plus className="h-10 w-10 text-primary" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Search Modal */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
              onClick={() => setShowSearch(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-strong rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Select Pokémon</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {searchResults.map((pokemon) => (
                        <button
                          key={pokemon.id}
                          onClick={() => addToTeam(pokemon)}
                          className="glass rounded-lg p-3 hover:bg-primary/20 transition-colors text-left"
                        >
                          <Image
                            src={pokemon.image.startsWith('http') ? pokemon.image : `/${pokemon.image}`}
                            alt={pokemon.name}
                            width={60}
                            height={60}
                            className="mx-auto mb-2"
                            unoptimized
                          />
                          <p className="text-sm font-semibold text-center">{pokemon.name}</p>
                          <div className="flex gap-1 mt-1 justify-center">
                            <span className={`${getTypeClass(pokemon.type1)} text-white text-[10px] px-2 py-0.5 rounded-full`}>
                              {pokemon.type1}
                            </span>
                            {pokemon.type2 && (
                              <span className={`${getTypeClass(pokemon.type2)} text-white text-[10px] px-2 py-0.5 rounded-full`}>
                                {pokemon.type2}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Defensive Analysis */}
        <div className="glass-strong rounded-3xl p-8 border-2 border-primary/20">
          <div className="flex items-center gap-3 mb-8">
            <Swords className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-black">Team Defensive Analysis</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-4 px-5 font-black text-base">Type</th>
                  <th className="text-center py-4 px-5 font-black text-base">Weak To</th>
                  <th className="text-center py-4 px-5 font-black text-base">Resistant To</th>
                  <th className="text-center py-4 px-5 font-black text-base">Immune To</th>
                </tr>
              </thead>
              <tbody>
                {POKEMON_TYPES.map((type) => (
                  <tr key={type} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                    <td className="py-4 px-5">
                      <span className={`${getTypeClass(type)} text-white px-4 py-2 rounded-full text-xs font-black uppercase`}>
                        {type}
                      </span>
                    </td>
                    <td className="text-center py-4 px-5">
                      <span className={`text-xl font-black ${defensiveAnalysis[type].weak > 0 ? 'text-red-500' : 'text-muted-foreground/30'}`}>
                        {defensiveAnalysis[type].weak}
                      </span>
                    </td>
                    <td className="text-center py-4 px-5">
                      <span className={`text-xl font-black ${defensiveAnalysis[type].resistant > 0 ? 'text-green-500' : 'text-muted-foreground/30'}`}>
                        {defensiveAnalysis[type].resistant}
                      </span>
                    </td>
                    <td className="text-center py-4 px-5">
                      <span className={`text-xl font-black ${defensiveAnalysis[type].immune > 0 ? 'text-blue-500' : 'text-muted-foreground/30'}`}>
                        {defensiveAnalysis[type].immune}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}