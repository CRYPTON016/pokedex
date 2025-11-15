"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { Pokemon } from "@/lib/types";
import { getTypeClass, getTypeColor } from "@/lib/pokemon-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Flame, Droplet, Zap, Wind, Shield, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PokemonImage } from "@/components/pokemon-image";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [evolutions, setEvolutions] = useState<any[] | null>(null);
  const [evolutionsLoading, setEvolutionsLoading] = useState(false);
  const [moves, setMoves] = useState<any[] | null>(null);
  const [movesLoading, setMovesLoading] = useState(false);
  
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`/api/pokemon/${id}`);
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        console.error("Error fetching pokemon:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPokemon();
  }, [id]);

  useEffect(() => {
    // once pokemon is loaded, fetch evolution chain
    const fetchEvolutions = async () => {
      if (!pokemon) return;
      try {
        setEvolutionsLoading(true);
        const res = await fetch(`/api/pokemon/evolutions/${pokemon.id}`);
        const data = await res.json();
        setEvolutions(data?.data || []);
      } catch (err) {
        console.error('Failed to load evolutions', err);
        setEvolutions([]);
      } finally {
        setEvolutionsLoading(false);
      }
    };

    fetchEvolutions();
  }, [pokemon]);

  useEffect(() => {
    const fetchMoves = async () => {
      if (!pokemon) return;
      try {
        setMovesLoading(true);
        const res = await fetch(`/api/moves/${pokemon.index}`);
        const data = await res.json();
        setMoves(data?.data || []);
      } catch (err) {
        console.error('Failed to load moves', err);
        setMoves([]);
      } finally {
        setMovesLoading(false);
      }
    };

    fetchMoves();
  }, [pokemon]);
  
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
        <p className="text-xl text-muted-foreground mb-4">Pokémon not found</p>
        <Button onClick={() => router.push("/pokedex")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pokédex
        </Button>
      </div>
    );
  }
  
  // Detailed stats with Base, Min, Max
  const detailedStats = [
    { 
      name: "HP", 
      base: pokemon.hpBase, 
      min: pokemon.hpMin, 
      max: pokemon.hpMax,
      icon: Activity,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30"
    },
    { 
      name: "Attack", 
      base: pokemon.attackBase, 
      min: pokemon.attackMin, 
      max: pokemon.attackMax,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30"
    },
    { 
      name: "Defense", 
      base: pokemon.defenseBase, 
      min: pokemon.defenseMin, 
      max: pokemon.defenseMax,
      icon: Shield,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30"
    },
    { 
      name: "Special Attack", 
      base: pokemon.specialAttackBase, 
      min: pokemon.specialAttackMin, 
      max: pokemon.specialAttackMax,
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    { 
      name: "Special Defense", 
      base: pokemon.specialDefenseBase, 
      min: pokemon.specialDefenseMin, 
      max: pokemon.specialDefenseMax,
      icon: Droplet,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30"
    },
    { 
      name: "Speed", 
      base: pokemon.speedBase, 
      min: pokemon.speedMin, 
      max: pokemon.speedMax,
      icon: Wind,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
  ];

  // Radar chart data for Base, Min, Max
  const baseRadarData = detailedStats.map(stat => ({
    stat: stat.name,
    value: stat.base,
  }));

  const minRadarData = detailedStats.map(stat => ({
    stat: stat.name,
    value: stat.min,
  }));

  const maxRadarData = detailedStats.map(stat => ({
    stat: stat.name,
    value: stat.max,
  }));
  
  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/pokedex")}
          className="mb-4 hover:bg-primary/10"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pokédex
        </Button>
        
        {/* Background Gradient */}
        <div
          className="fixed inset-0 opacity-20 blur-3xl -z-10"
          style={{
            background: `radial-gradient(circle at 50% 20%, ${getTypeColor(pokemon.type1)}, transparent 60%)`,
          }}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Pokemon Info & Image */}
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
                <p className="font-semibold">{pokemon.height}</p>
              </div>
              <div className="glass rounded-lg p-2">
                <p className="text-muted-foreground mb-0.5">Weight</p>
                <p className="font-semibold">{pokemon.weight}</p>
              </div>
              <div className="glass rounded-lg p-2">
                <p className="text-muted-foreground mb-0.5">Catch Rate</p>
                <p className="font-semibold">{pokemon.catchRate}</p>
              </div>
              <div className="glass rounded-lg p-2">
                <p className="text-muted-foreground mb-0.5">Friendship</p>
                <p className="font-semibold">{pokemon.baseFriendship}</p>
              </div>
            </div>

            {/* Evolutions */}
            <div className="border-t border-border/50 pt-4">
              <h3 className="text-sm font-bold mb-2">Evolution</h3>
              {evolutionsLoading ? (
                <p className="text-xs text-muted-foreground">Loading evolutions...</p>
              ) : !evolutions || evolutions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No evolution data available.</p>
              ) : (
                <div className="flex items-center gap-3 overflow-x-auto py-2">
                  {evolutions.map((evItem) => {
                    const step = evItem.step;
                    const ev = evItem.pokemon;
                    return (
                      <div key={ev.id} className="glass rounded-lg p-2 min-w-[140px] text-center">
                        <a href={`/pokedex/${ev.id}`} className="block">
                          <div className="flex justify-center mb-2">
                            <PokemonImage
                              name={ev.name}
                              index={ev.index}
                              type1={ev.type1}
                              existingImage={ev.image}
                              width={96}
                              height={96}
                            />
                          </div>
                          <p className="text-sm font-bold">{ev.name}</p>
                          <p className="text-[11px] text-muted-foreground">#{String(ev.index).padStart(3, '0')}</p>
                          {step?.trigger && (
                            <div className="mt-2 flex items-center justify-center">
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted/40">{`${String(step.trigger).toUpperCase()} ${step.value ?? ''}`}</span>
                            </div>
                          )}
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Training & Breeding Compact */}
            <div className="border-t border-border/50 pt-4 space-y-2">
              <h3 className="text-sm font-bold mb-2">Training & Breeding</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">EV Yield</p>
                  <p className="font-medium text-secondary">{pokemon.evYield}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Base EXP</p>
                  <p className="font-medium text-accent">{pokemon.baseExp}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Growth</p>
                  <p className="font-medium">{pokemon.growthRate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Egg Cycles</p>
                  <p className="font-medium">{pokemon.eggCycles}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Egg Groups</p>
                  <p className="font-medium">{pokemon.eggGroups}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{pokemon.gender}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Abilities</p>
                  <p className="font-medium">{pokemon.abilities}</p>
                </div>
              </div>
            </div>

            {/* Moves */}
            <div className="border-t border-border/50 pt-4">
              <h3 className="text-sm font-bold mb-2">Moves</h3>
              {movesLoading ? (
                <p className="text-xs text-muted-foreground">Loading moves...</p>
              ) : !moves || moves.length === 0 ? (
                <p className="text-xs text-muted-foreground">No moves data available.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {moves.map((m: any, i: number) => (
                    <div key={`${m.name}-${i}`} className="glass rounded-md p-2 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground">{m.method}{m.level ? ` • Lv ${m.level}` : ''}{m.detail ? ` • ${m.detail}` : ''}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{m.method}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-2 space-y-4">
            {/* Radar Charts - Compact 3 Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-black mb-3">Stats Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Base Stats Chart */}
                <div className="glass-strong rounded-lg p-4 border border-primary/30">
                  <h3 className="text-base font-bold mb-3 text-center text-primary">Base Stats</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={baseRadarData}>
                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                        <PolarAngleAxis 
                          dataKey="stat" 
                          tick={{ fill: '#A0A0A0', fontSize: 10 }}
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

                {/* Min Stats Chart */}
                <div className="glass-strong rounded-lg p-4 border border-accent/30">
                  <h3 className="text-base font-bold mb-3 text-center text-accent">Min Stats</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={minRadarData}>
                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                        <PolarAngleAxis 
                          dataKey="stat" 
                          tick={{ fill: '#A0A0A0', fontSize: 10 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 400]} 
                          tick={{ fill: '#A0A0A0', fontSize: 9 }}
                        />
                        <Radar
                          name="Min"
                          dataKey="value"
                          stroke="#00D9FF"
                          fill="#00D9FF"
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

                {/* Max Stats Chart */}
                <div className="glass-strong rounded-lg p-4 border border-secondary/30">
                  <h3 className="text-base font-bold mb-3 text-center text-secondary">Max Stats</h3>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={maxRadarData}>
                        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                        <PolarAngleAxis 
                          dataKey="stat" 
                          tick={{ fill: '#A0A0A0', fontSize: 10 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 450]} 
                          tick={{ fill: '#A0A0A0', fontSize: 9 }}
                        />
                        <Radar
                          name="Max"
                          dataKey="value"
                          stroke="#FFD700"
                          fill="#FFD700"
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
              </div>
            </motion.div>
            
            {/* Detailed Stats - Compact Grid */}
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
                            <p className="text-[10px] text-muted-foreground mb-0.5">Min</p>
                            <p className="text-xs font-bold text-accent">{stat.min}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-muted-foreground mb-0.5">Max</p>
                            <p className="text-xs font-bold text-secondary">{stat.max}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}