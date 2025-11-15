"use client";

import { useState, useEffect, useCallback } from "react";
import { Pokemon, PokemonListResponse } from "@/lib/types";
import { PokemonCard } from "@/components/pokemon-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Loader2 } from "lucide-react";
import { POKEMON_TYPES } from "@/lib/pokemon-types";
import { useInView } from "react-intersection-observer";

export default function PokedexPage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [type1Filter, setType1Filter] = useState("all");
  const [type2Filter, setType2Filter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [eggGroupFilter, setEggGroupFilter] = useState("all");
  
  // Stat filters
  const [hpRange, setHpRange] = useState([0, 255]);
  const [attackRange, setAttackRange] = useState([0, 255]);
  const [defenseRange, setDefenseRange] = useState([0, 255]);
  const [speedRange, setSpeedRange] = useState([0, 255]);
  
  const { ref, inView } = useInView();
  
  const fetchPokemon = useCallback(async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "24",
      });
      
      if (search) params.append("search", search);
      if (type1Filter && type1Filter !== "all") params.append("type1", type1Filter);
      if (type2Filter && type2Filter !== "all") params.append("type2", type2Filter);
  if (eggGroupFilter && eggGroupFilter !== "all") params.append("eggGroup", eggGroupFilter);
      if (hpRange[0] > 0) params.append("minHp", hpRange[0].toString());
      if (hpRange[1] < 255) params.append("maxHp", hpRange[1].toString());
      if (attackRange[0] > 0) params.append("minAttack", attackRange[0].toString());
      if (attackRange[1] < 255) params.append("maxAttack", attackRange[1].toString());
      if (defenseRange[0] > 0) params.append("minDefense", defenseRange[0].toString());
      if (defenseRange[1] < 255) params.append("maxDefense", defenseRange[1].toString());
      if (speedRange[0] > 0) params.append("minSpeed", speedRange[0].toString());
      if (speedRange[1] < 255) params.append("maxSpeed", speedRange[1].toString());
      
      const res = await fetch(`/api/pokemon?${params}`);
      const data: PokemonListResponse = await res.json();
      
      if (append) {
        setPokemon((prev) => [...prev, ...data.data]);
      } else {
        setPokemon(data.data);
      }
      
      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
    } finally {
      setLoading(false);
    }
  }, [search, type1Filter, type2Filter, hpRange, attackRange, defenseRange, speedRange]);
  
  useEffect(() => {
    setPage(1);
    // Update URL query string to reflect filters
    try {
      const params = new URLSearchParams(window.location.search);
      if (search) params.set('search', search); else params.delete('search');
      if (type1Filter && type1Filter !== 'all') params.set('type1', type1Filter); else params.delete('type1');
      if (type2Filter && type2Filter !== 'all') params.set('type2', type2Filter); else params.delete('type2');
      if (eggGroupFilter && eggGroupFilter !== 'all') params.set('eggGroup', eggGroupFilter); else params.delete('eggGroup');
      // stat ranges
      params.set('minHp', String(hpRange[0]));
      params.set('maxHp', String(hpRange[1]));
      params.set('minAttack', String(attackRange[0]));
      params.set('maxAttack', String(attackRange[1]));
      params.set('minDefense', String(defenseRange[0]));
      params.set('maxDefense', String(defenseRange[1]));
      params.set('minSpeed', String(speedRange[0]));
      params.set('maxSpeed', String(speedRange[1]));
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    } catch (e) {
      // ignore if window not available
    }

    fetchPokemon(1, false);
  }, [search, type1Filter, type2Filter, hpRange, attackRange, defenseRange, speedRange]);

  // Initialize filters from URL on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('search') || '';
      const t1 = params.get('type1') || 'all';
      const t2 = params.get('type2') || 'all';
      const eg = params.get('eggGroup') || 'all';
      const minHp = params.get('minHp') ? parseInt(params.get('minHp')!) : 0;
      const maxHp = params.get('maxHp') ? parseInt(params.get('maxHp')!) : 255;
      const minAtk = params.get('minAttack') ? parseInt(params.get('minAttack')!) : 0;
      const maxAtk = params.get('maxAttack') ? parseInt(params.get('maxAttack')!) : 255;
      const minDef = params.get('minDefense') ? parseInt(params.get('minDefense')!) : 0;
      const maxDef = params.get('maxDefense') ? parseInt(params.get('maxDefense')!) : 255;
      const minSpd = params.get('minSpeed') ? parseInt(params.get('minSpeed')!) : 0;
      const maxSpd = params.get('maxSpeed') ? parseInt(params.get('maxSpeed')!) : 255;

      setSearch(q);
      setType1Filter(t1);
      setType2Filter(t2);
      setEggGroupFilter(eg);
      setHpRange([minHp, maxHp]);
      setAttackRange([minAtk, maxAtk]);
      setDefenseRange([minDef, maxDef]);
      setSpeedRange([minSpd, maxSpd]);
    } catch (e) {
      // ignore
    }
  }, []);
  
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPokemon(nextPage, true);
    }
  }, [inView, hasMore, loading, page, fetchPokemon]);
  
  const resetFilters = () => {
    setSearch("");
    setType1Filter("all");
    setType2Filter("all");
    setHpRange([0, 255]);
    setAttackRange([0, 255]);
    setDefenseRange([0, 255]);
    setSpeedRange([0, 255]);
  };
  
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-[1600px] mx-auto">
        {/* Enhanced Header with Better Typography */}
        <div className="mb-10">
          <div className="inline-block relative mb-3">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Pokédex Explorer
            </h1>
            <div className="absolute -inset-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl -z-10" />
          </div>
          <p className="text-lg text-muted-foreground">
            Browse and discover all <span className="text-primary font-semibold">1,025+</span> Pokémon in the database
          </p>
        </div>
        
        {/* Enhanced Search and Filters Card */}
        <div className="glass-strong rounded-2xl p-8 mb-8 space-y-6 border-2 border-border/50 hover:border-primary/30 transition-colors">
          {/* Search Bar with Better Design */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6 group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search Pokémon by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-14 pr-6 h-16 text-lg bg-background/50 border-2 border-border focus:border-primary/50 rounded-xl font-medium"
            />
          </div>
          
          {/* Filter Toggle with Better Styling */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full h-14 text-base border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <Filter className="mr-3 h-5 w-5" />
            {showFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
          </Button>
          
          {/* Filters Panel with Enhanced Layout */}
          {showFilters && (
            <div className="space-y-8 pt-6 border-t-2 border-border/50 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Filters with Better Labels */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">Primary Type</Label>
                  <Select value={type1Filter} onValueChange={setType1Filter}>
                    <SelectTrigger className="h-12 border-2 hover:border-primary/30 transition-colors">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {POKEMON_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <span className="font-medium">{type}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">Secondary Type</Label>
                  <Select value={type2Filter} onValueChange={setType2Filter}>
                    <SelectTrigger className="h-12 border-2 hover:border-primary/30 transition-colors">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {POKEMON_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <span className="font-medium">{type}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">Egg Group</Label>
                  <Select value={eggGroupFilter} onValueChange={setEggGroupFilter}>
                    <SelectTrigger className="h-12 border-2 hover:border-primary/30 transition-colors">
                      <SelectValue placeholder="All Egg Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Egg Groups</SelectItem>
                      <SelectItem value="Monster">Monster</SelectItem>
                      <SelectItem value="Water 1">Water 1</SelectItem>
                      <SelectItem value="Water 2">Water 2</SelectItem>
                      <SelectItem value="Grass">Grass</SelectItem>
                      <SelectItem value="Bug">Bug</SelectItem>
                      <SelectItem value="Flying">Flying</SelectItem>
                      <SelectItem value="Field">Field</SelectItem>
                      <SelectItem value="Fairy">Fairy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Stat Range Sliders with Enhanced Design */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-foreground">Base Stat Ranges</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="flex justify-between items-center">
                      <span className="font-semibold">HP</span>
                      <span className="text-primary font-bold text-lg">{hpRange[0]} - {hpRange[1]}</span>
                    </Label>
                    <Slider
                      min={0}
                      max={255}
                      step={5}
                      value={hpRange}
                      onValueChange={setHpRange}
                      className="mt-3"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="flex justify-between items-center">
                      <span className="font-semibold">Attack</span>
                      <span className="text-primary font-bold text-lg">{attackRange[0]} - {attackRange[1]}</span>
                    </Label>
                    <Slider
                      min={0}
                      max={255}
                      step={5}
                      value={attackRange}
                      onValueChange={setAttackRange}
                      className="mt-3"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="flex justify-between items-center">
                      <span className="font-semibold">Defense</span>
                      <span className="text-primary font-bold text-lg">{defenseRange[0]} - {defenseRange[1]}</span>
                    </Label>
                    <Slider
                      min={0}
                      max={255}
                      step={5}
                      value={defenseRange}
                      onValueChange={setDefenseRange}
                      className="mt-3"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="flex justify-between items-center">
                      <span className="font-semibold">Speed</span>
                      <span className="text-primary font-bold text-lg">{speedRange[0]} - {speedRange[1]}</span>
                    </Label>
                    <Slider
                      min={0}
                      max={255}
                      step={5}
                      value={speedRange}
                      onValueChange={setSpeedRange}
                      className="mt-3"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={resetFilters} 
                className="w-full h-12 border-2 hover:border-accent/50 hover:bg-accent/5"
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
        
        {/* Pokemon Grid with Better Spacing */}
        {pokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {pokemon.map((p, idx) => (
              <PokemonCard key={p.id} pokemon={p} index={idx} />
            ))}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
            <p className="text-xl text-muted-foreground">Loading Pokémon...</p>
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="inline-block p-8 rounded-2xl glass-strong mb-6">
              <Search className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
              <p className="text-2xl font-bold text-foreground mb-2">No Pokémon Found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
              <Button onClick={resetFilters} size="lg" className="hover-glow">
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Infinite Scroll Trigger with Better Design */}
        {hasMore && pokemon.length > 0 && (
          <div ref={ref} className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading more Pokémon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}