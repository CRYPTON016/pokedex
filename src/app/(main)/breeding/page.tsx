"use client";

import { useState, useEffect } from "react";
import { Pokemon } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Heart } from "lucide-react";
import { getTypeClass } from "@/lib/pokemon-types";
import { motion } from "framer-motion";
import { PokemonImage } from "@/components/pokemon-image";

export default function BreedingPage() {
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [results1, setResults1] = useState<Pokemon[]>([]);
  const [results2, setResults2] = useState<Pokemon[]>([]);
  const [parent1, setParent1] = useState<Pokemon | null>(null);
  const [parent2, setParent2] = useState<Pokemon | null>(null);
  const [compatibility, setCompatibility] = useState<string>("");
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const searchPokemon = async (query: string, setter: (data: Pokemon[]) => void, setLoading: (loading: boolean) => void) => {
    if (!query) {
      setter([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/pokemon?search=${query}&limit=10`);
      const data = await res.json();
      setter(data.data);
    } catch (error) {
      console.error("Error searching pokemon:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => searchPokemon(search1, setResults1, setLoading1), 300);
    return () => clearTimeout(timer);
  }, [search1]);

  useEffect(() => {
    const timer = setTimeout(() => searchPokemon(search2, setResults2, setLoading2), 300);
    return () => clearTimeout(timer);
  }, [search2]);

  useEffect(() => {
    if (parent1 && parent2) {
      calculateCompatibility();
    }
  }, [parent1, parent2]);

  const calculateCompatibility = () => {
    if (!parent1 || !parent2) return;

    const eggGroups1 = parent1.eggGroups.toLowerCase().split(",").map(g => g.trim());
    const eggGroups2 = parent2.eggGroups.toLowerCase().split(",").map(g => g.trim());
    
    // Check if they share an egg group
    const sharedGroups = eggGroups1.filter(group => eggGroups2.includes(group));
    
    if (eggGroups1.includes("undiscovered") || eggGroups2.includes("undiscovered")) {
      setCompatibility("Cannot Breed - Undiscovered Egg Group");
    } else if (eggGroups1.includes("ditto") || eggGroups2.includes("ditto")) {
      setCompatibility("Compatible - Ditto can breed with most Pokémon!");
    } else if (sharedGroups.length > 0) {
      setCompatibility(`Compatible - Shared Egg Group(s): ${sharedGroups.join(", ")}`);
    } else {
      setCompatibility("Incompatible - No Shared Egg Groups");
    }
  };

  const selectPokemon = (pokemon: Pokemon, parent: 1 | 2) => {
    if (parent === 1) {
      setParent1(pokemon);
      setSearch1("");
      setResults1([]);
    } else {
      setParent2(pokemon);
      setSearch2("");
      setResults2([]);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Breeding Calculator
          </h1>
          <p className="text-muted-foreground">
            Check Pokémon breeding compatibility based on egg groups, cycles, and gender ratios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Parent 1 Selector */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Parent 1</h2>
            
            {parent1 ? (
              <div className="text-center">
                <PokemonImage
                  name={parent1.name}
                  index={parent1.index}
                  type1={parent1.type1}
                  existingImage={parent1.image}
                  width={200}
                  height={200}
                />
                <h3 className="text-2xl font-bold mt-4">{parent1.name}</h3>
                <div className="flex gap-2 justify-center mt-2 mb-4">
                  <span className={`${getTypeClass(parent1.type1)} text-white text-xs px-3 py-1 rounded-full`}>
                    {parent1.type1}
                  </span>
                  {parent1.type2 && (
                    <span className={`${getTypeClass(parent1.type2)} text-white text-xs px-3 py-1 rounded-full`}>
                      {parent1.type2}
                    </span>
                  )}
                </div>
                
                <div className="glass rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Egg Groups:</span>
                    <span className="font-semibold">{parent1.eggGroups}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender Ratio:</span>
                    <span className="font-semibold">{parent1.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Egg Cycles:</span>
                    <span className="font-semibold">{parent1.eggCycles}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setParent1(null)}
                >
                  Change Pokémon
                </Button>
              </div>
            ) : (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={search1}
                    onChange={(e) => setSearch1(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loading1 ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    results1.map((pokemon) => (
                      <button
                        key={pokemon.id}
                        onClick={() => selectPokemon(pokemon, 1)}
                        className="w-full glass rounded-lg p-3 hover:bg-primary/20 transition-colors flex items-center gap-3"
                      >
                        <PokemonImage
                          name={pokemon.name}
                          index={pokemon.index}
                          type1={pokemon.type1}
                          existingImage={pokemon.image}
                          width={50}
                          height={50}
                        />
                        <div className="text-left flex-1">
                          <p className="font-semibold">{pokemon.name}</p>
                          <p className="text-xs text-muted-foreground">{pokemon.eggGroups}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Parent 2 Selector */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Parent 2</h2>
            
            {parent2 ? (
              <div className="text-center">
                <PokemonImage
                  name={parent2.name}
                  index={parent2.index}
                  type1={parent2.type1}
                  existingImage={parent2.image}
                  width={200}
                  height={200}
                />
                <h3 className="text-2xl font-bold mt-4">{parent2.name}</h3>
                <div className="flex gap-2 justify-center mt-2 mb-4">
                  <span className={`${getTypeClass(parent2.type1)} text-white text-xs px-3 py-1 rounded-full`}>
                    {parent2.type1}
                  </span>
                  {parent2.type2 && (
                    <span className={`${getTypeClass(parent2.type2)} text-white text-xs px-3 py-1 rounded-full`}>
                      {parent2.type2}
                    </span>
                  )}
                </div>
                
                <div className="glass rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Egg Groups:</span>
                    <span className="font-semibold">{parent2.eggGroups}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender Ratio:</span>
                    <span className="font-semibold">{parent2.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Egg Cycles:</span>
                    <span className="font-semibold">{parent2.eggCycles}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setParent2(null)}
                >
                  Change Pokémon
                </Button>
              </div>
            ) : (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={search2}
                    onChange={(e) => setSearch2(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loading2 ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    results2.map((pokemon) => (
                      <button
                        key={pokemon.id}
                        onClick={() => selectPokemon(pokemon, 2)}
                        className="w-full glass rounded-lg p-3 hover:bg-primary/20 transition-colors flex items-center gap-3"
                      >
                        <PokemonImage
                          name={pokemon.name}
                          index={pokemon.index}
                          type1={pokemon.type1}
                          existingImage={pokemon.image}
                          width={50}
                          height={50}
                        />
                        <div className="text-left flex-1">
                          <p className="font-semibold">{pokemon.name}</p>
                          <p className="text-xs text-muted-foreground">{pokemon.eggGroups}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Compatibility Result */}
        {parent1 && parent2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-xl p-8 text-center"
          >
            <Heart className={`h-16 w-16 mx-auto mb-4 ${compatibility.includes("Compatible") ? "text-green-500" : "text-red-500"}`} />
            <h2 className="text-3xl font-bold mb-2">
              {compatibility.includes("Compatible") ? "Compatible!" : "Incompatible"}
            </h2>
            <p className={`text-lg mb-6 ${compatibility.includes("Compatible") ? "text-green-400" : "text-red-400"}`}>
              {compatibility}
            </p>
            
            {compatibility.includes("Compatible") && (
              <div className="glass rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold mb-4">Breeding Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Estimated Egg Cycles</p>
                    <p className="text-2xl font-bold text-secondary">
                      {Math.max(parseInt(parent1.eggCycles) || 0, parseInt(parent2.eggCycles) || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Steps to Hatch</p>
                    <p className="text-2xl font-bold text-accent">
                      {(Math.max(parseInt(parent1.eggCycles) || 0, parseInt(parent2.eggCycles) || 0)) * 257}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  * The offspring will inherit the species of the female parent (or non-Ditto parent if breeding with Ditto)
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}