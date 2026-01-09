"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPokemonList, searchPokemon, type Pokemon } from "@/lib/pokeapi";
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
import { Search, Filter, Loader2, Info } from "lucide-react";
import { POKEMON_TYPES } from "@/lib/pokemon-types";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/badge";

export default function PokedexPage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [type1Filter, setType1Filter] = useState("all");
  const [type2Filter, setType2Filter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal] = useState(0);

  // Stat filters (client-side)
  const [hpRange, setHpRange] = useState([0, 255]);
  const [attackRange, setAttackRange] = useState([0, 255]);
  const [defenseRange, setDefenseRange] = useState([0, 255]);
  const [speedRange, setSpeedRange] = useState([0, 255]);

  const { ref, inView } = useInView();

  const LIMIT = 24;

  const fetchPokemonData = useCallback(async (pageNum: number, append = false) => {
    try {
      setLoading(true);
      const offset = (pageNum - 1) * LIMIT;

      let result: { data: Pokemon[]; total: number };

      if (search || (type1Filter && type1Filter !== "all") || (type2Filter && type2Filter !== "all")) {
        // Use search/filter function
        result = await searchPokemon(search, type1Filter, type2Filter, LIMIT, offset);
      } else {
        // Use simple list
        result = await fetchPokemonList(LIMIT, offset);
      }

      // Apply stat filters client-side
      let filtered = result.data.filter((p) => {
        if (hpRange[0] > 0 && p.hp < hpRange[0]) return false;
        if (hpRange[1] < 255 && p.hp > hpRange[1]) return false;
        if (attackRange[0] > 0 && p.attack < attackRange[0]) return false;
        if (attackRange[1] < 255 && p.attack > attackRange[1]) return false;
        if (defenseRange[0] > 0 && p.defense < defenseRange[0]) return false;
        if (defenseRange[1] < 255 && p.defense > defenseRange[1]) return false;
        if (speedRange[0] > 0 && p.speed < speedRange[0]) return false;
        if (speedRange[1] < 255 && p.speed > speedRange[1]) return false;
        return true;
      });

      if (append) {
        setPokemon((prev) => [...prev, ...filtered]);
      } else {
        setPokemon(filtered);
      }

      setTotal(result.total);
      setHasMore(offset + LIMIT < result.total);
    } catch (error) {
      console.error("Error fetching pokemon:", error);
    } finally {
      setLoading(false);
    }
  }, [search, type1Filter, type2Filter, hpRange, attackRange, defenseRange, speedRange]);

  useEffect(() => {
    setPage(1);
    fetchPokemonData(1, false);
  }, [search, type1Filter, type2Filter, hpRange, attackRange, defenseRange, speedRange]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPokemonData(nextPage, true);
    }
  }, [inView, hasMore, loading, page, fetchPokemonData]);

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
        {/* Header */}
        <div className="mb-10">
          <div className="inline-block relative mb-3">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Pokedex Explorer
            </h1>
            <div className="absolute -inset-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl -z-10" />
          </div>
          <p className="text-lg text-muted-foreground">
            Browse and discover all <span className="text-primary font-semibold">{total || "1,025+"}</span> Pokemon from PokeAPI
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <Badge variant="secondary" className="gap-1.5">
              <Info className="w-3 h-3" />
              Powered by PokeAPI
            </Badge>
            <Badge variant="secondary" className="gap-1.5">
              100% Client-Side
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-strong rounded-2xl p-8 mb-8 space-y-6 border-2 border-border/50 hover:border-primary/30 transition-colors">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6 group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search Pokemon by name or number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-14 pr-6 h-16 text-lg bg-background/50 border-2 border-border focus:border-primary/50 rounded-xl font-medium"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full h-14 text-base border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <Filter className="mr-3 h-5 w-5" />
            {showFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
          </Button>

          {/* Filters Panel */}
          {showFilters && (
            <div className="space-y-8 pt-6 border-t-2 border-border/50 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Type Filters */}
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
              </div>

              {/* Stat Range Sliders */}
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

        {/* Pokemon Grid */}
        {pokemon.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {pokemon.map((p, idx) => (
              <PokemonCard key={p.id} pokemon={p} index={idx} />
            ))}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
            <p className="text-xl text-muted-foreground">Loading Pokemon from PokeAPI...</p>
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="inline-block p-8 rounded-2xl glass-strong mb-6">
              <Search className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
              <p className="text-2xl font-bold text-foreground mb-2">No Pokemon Found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria</p>
              <Button onClick={resetFilters} size="lg" className="hover-glow">
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        {hasMore && pokemon.length > 0 && (
          <div ref={ref} className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading more Pokemon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
