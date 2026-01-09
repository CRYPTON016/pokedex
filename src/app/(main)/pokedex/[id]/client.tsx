"use client";

import { useState, useEffect } from "react";
import { fetchPokemon, fetchPokemonSpecies, type Pokemon } from "@/lib/pokeapi";
import { getTypeClass, getTypeColor } from "@/lib/pokemon-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Flame, Droplet, Zap, Wind, Shield, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PokemonImage } from "@/components/pokemon-image";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

// Extended Pokemon type with additional fields
interface ExtendedPokemon extends Pokemon {
  species?: string;
  catchRate?: number;
  baseFriendship?: number;
  growthRate?: string;
  eggGroups?: string;
  eggCycles?: number;
  gender?: string;
  evYield?: string;
  baseExp?: number;
  hpBase?: number;
  hpMin?: number;
  hpMax?: number;
  attackBase?: number;
  attackMin?: number;
  attackMax?: number;
  defenseBase?: number;
  defenseMin?: number;
  defenseMax?: number;
  specialAttackBase?: number;
  specialAttackMin?: number;
  specialAttackMax?: number;
  specialDefenseBase?: number;
  specialDefenseMin?: number;
  specialDefenseMax?: number;
  speedBase?: number;
  speedMin?: number;
  speedMax?: number;
}

// Calculate min/max stats at level 100
function calculateStatRange(base: number, isHp: boolean = false): { min: number; max: number } {
  if (isHp) {
    const min = Math.floor(((2 * base) * 100) / 100) + 100 + 10;
    const max = Math.floor(((2 * base + 31 + 63) * 100) / 100) + 100 + 10;
    return { min, max };
  }
  const min = Math.floor((Math.floor(((2 * base) * 100) / 100) + 5) * 0.9);
  const max = Math.floor((Math.floor(((2 * base + 31 + 63) * 100) / 100) + 5) * 1.1);
  return { min, max };
}

export default function PokemonDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [pokemon, setPokemon] = useState<ExtendedPokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        const [pokemonData, speciesData] = await Promise.all([
          fetchPokemon(id),
          fetchPokemonSpecies(id)
        ]);

        if (pokemonData) {
          // Calculate stat ranges
          const hpRange = calculateStatRange(pokemonData.hp, true);
          const attackRange = calculateStatRange(pokemonData.attack);
          const defenseRange = calculateStatRange(pokemonData.defense);
          const spAtkRange = calculateStatRange(pokemonData.spAttack);
          const spDefRange = calculateStatRange(pokemonData.spDefense);
          const speedRange = calculateStatRange(pokemonData.speed);

          // Get species info
          const species = speciesData?.genera?.find(g => g.language.name === "en")?.genus || "Pokemon";
          const genderRate = speciesData?.gender_rate ?? -1;
          const genderText = genderRate === -1 ? "Genderless" :
            genderRate === 0 ? "100% Male" :
            genderRate === 8 ? "100% Female" :
            `${(8 - genderRate) / 8 * 100}% Male, ${genderRate / 8 * 100}% Female`;

          setPokemon({
            ...pokemonData,
            species,
            catchRate: speciesData?.capture_rate,
            baseFriendship: speciesData?.base_happiness,
            growthRate: speciesData?.growth_rate?.name?.replace("-", " ") || "Unknown",
            eggGroups: speciesData?.egg_groups?.map(g => g.name).join(", ") || "Unknown",
            eggCycles: 0,
            gender: genderText,
            evYield: "N/A",
            baseExp: 0,
            hpBase: pokemonData.hp,
            hpMin: hpRange.min,
            hpMax: hpRange.max,
            attackBase: pokemonData.attack,
            attackMin: attackRange.min,
            attackMax: attackRange.max,
            defenseBase: pokemonData.defense,
            defenseMin: defenseRange.min,
            defenseMax: defenseRange.max,
            specialAttackBase: pokemonData.spAttack,
            specialAttackMin: spAtkRange.min,
            specialAttackMax: spAtkRange.max,
            specialDefenseBase: pokemonData.spDefense,
            specialDefenseMin: spDefRange.min,
            specialDefenseMax: spDefRange.max,
            speedBase: pokemonData.speed,
            speedMin: speedRange.min,
            speedMax: speedRange.max,
          });
        }
      } catch (error) {
        console.error("Error fetching pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-muted-foreground mb-4">Pokemon not found</p>
        <Button onClick={() => router.push("/pokedex")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pokedex
        </Button>
      </div>
    );
  }

  const detailedStats = [
    {
      name: "HP",
      base: pokemon.hpBase || pokemon.hp,
      min: pokemon.hpMin || 0,
      max: pokemon.hpMax || 0,
      icon: Activity,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30"
    },
    {
      name: "Attack",
      base: pokemon.attackBase || pokemon.attack,
      min: pokemon.attackMin || 0,
      max: pokemon.attackMax || 0,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    },
    {
      name: "Defense",
      base: pokemon.defenseBase || pokemon.defense,
      min: pokemon.defenseMin || 0,
      max: pokemon.defenseMax || 0,
      icon: Shield,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    {
      name: "Sp. Attack",
      base: pokemon.specialAttackBase || pokemon.spAttack,
      min: pokemon.specialAttackMin || 0,
      max: pokemon.specialAttackMax || 0,
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    {
      name: "Sp. Defense",
      base: pokemon.specialDefenseBase || pokemon.spDefense,
      min: pokemon.specialDefenseMin || 0,
      max: pokemon.specialDefenseMax || 0,
      icon: Droplet,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30"
    },
    {
      name: "Speed",
      base: pokemon.speedBase || pokemon.speed,
      min: pokemon.speedMin || 0,
      max: pokemon.speedMax || 0,
      icon: Wind,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
  ];

  const baseRadarData = detailedStats.map(stat => ({
    stat: stat.name,
    value: stat.base,
  }));

  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/pokedex")}
          className="mb-4 hover:bg-primary/10"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pokedex
        </Button>

        <div
          className="fixed inset-0 opacity-20 blur-3xl -z-10"
          style={{
            background: `radial-gradient(circle at 50% 20%, ${getTypeColor(pokemon.type1)}, transparent 60%)`,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Pokemon Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-xl p-5"
          >
            <div className="text-center mb-4">
              <p className="text-xs text-muted-foreground mb-1">
                #{String(pokemon.index).padStart(4, "0")}
              </p>
              <h1 className="text-3xl font-black mb-1">{pokemon.name}</h1>
              <p className="text-sm text-muted-foreground italic">
                {pokemon.species}
              </p>
            </div>

            <div className="flex items-center justify-center mb-4">
              <PokemonImage
                name={pokemon.name}
                index={pokemon.index}
                type1={pokemon.type1}
                existingImage={pokemon.image}
                width={200}
                height={200}
                priority
                showLoadingSpinner
              />
            </div>

            <div className="flex justify-center gap-2 mb-4">
              <span
                className={`${getTypeClass(pokemon.type1)} text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider`}
              >
                {pokemon.type1}
              </span>
              {pokemon.type2 && (
                <span
                  className={`${getTypeClass(pokemon.type2)} text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider`}
                >
                  {pokemon.type2}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="glass rounded-lg p-2">
                <p className="text-muted-foreground mb-0.5">Height</p>
                <p className="font-semibold">{pokemon.height}m</p>
              </div>
              <div className="glass rounded-lg p-2">
                <p className="text-muted-foreground mb-0.5">Weight</p>
                <p className="font-semibold">{pokemon.weight}kg</p>
              </div>
              <div className="glass rounded-lg p-2">
                <p className="text-muted-foreground mb-0.5">Catch Rate</p>
                <p className="font-semibold">{pokemon.catchRate ?? "N/A"}</p>
              </div>
              <div className="glass rounded-lg p-2">
                <p className="text-muted-foreground mb-0.5">Friendship</p>
                <p className="font-semibold">{pokemon.baseFriendship ?? "N/A"}</p>
              </div>
            </div>

            {/* Training & Breeding */}
            <div className="border-t border-border/50 pt-4 space-y-2">
              <h3 className="text-sm font-bold mb-2">Training & Breeding</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Growth</p>
                  <p className="font-medium">{pokemon.growthRate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium text-sm">{pokemon.gender}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Egg Groups</p>
                  <p className="font-medium">{pokemon.eggGroups}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Abilities</p>
                  <p className="font-medium">{pokemon.abilities}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-black mb-3">Stats Analysis</h2>

              {/* Radar Chart */}
              <div className="glass-strong rounded-lg p-4 border border-primary/30 mb-4">
                <h3 className="text-base font-bold mb-3 text-center text-primary">Base Stats</h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={baseRadarData}>
                      <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                      <PolarAngleAxis
                        dataKey="stat"
                        tick={{ fill: '#A0A0A0', fontSize: 11 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 255]}
                        tick={{ fill: '#A0A0A0', fontSize: 9 }}
                      />
                      <Radar
                        name="Base"
                        dataKey="value"
                        stroke="#FF3366"
                        fill="#FF3366"
                        fillOpacity={0.6}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F0F14',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          fontSize: '12px',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            {/* Detailed Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-black mb-3">Detailed Stats</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {detailedStats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                      className={`glass-strong rounded-lg p-3 border ${stat.borderColor} hover:scale-[1.02] transition-transform`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`${stat.bgColor} p-1.5 rounded-md`}>
                          <Icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                        <h3 className="text-sm font-bold">{stat.name}</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Base</span>
                          <span className="text-xl font-black text-primary">{stat.base}</span>
                        </div>

                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(stat.base / 255) * 100}%` }}
                          />
                        </div>

                        <div className="flex justify-between pt-1 border-t border-border/30">
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground mb-0.5">Min (Lv100)</p>
                            <p className="text-xs font-bold text-accent">{stat.min}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground mb-0.5">Max (Lv100)</p>
                            <p className="text-xs font-bold text-secondary">{stat.max}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Total Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-strong rounded-lg p-4 border border-primary/30"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Total Base Stats</h3>
                <span className="text-3xl font-black text-primary">{pokemon.total}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
