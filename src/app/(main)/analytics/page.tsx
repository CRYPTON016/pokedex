"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { POKEMON_TYPES, getTypeColor } from "@/lib/pokemon-types";
import { TYPE_EFFECTIVENESS, getTypeEffectiveness } from "@/lib/type-effectiveness";
import { Pokemon } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const [selectedType, setSelectedType] = useState("Fire");
  const [typeStats, setTypeStats] = useState<any>(null);
  const [typeDistribution, setTypeDistribution] = useState<any[]>([]);
  const [topPokemon, setTopPokemon] = useState<Pokemon[]>([]);
  const [selectedStat, setSelectedStat] = useState("attack");
  const [topLimit, setTopLimit] = useState<string>("10");
  const [scatterData, setScatterData] = useState<any[]>([]);
  // Removed: Total Stats Distribution
  // Removed: Avg Speed vs Avg Attack by Type
  const [growthRateData, setGrowthRateData] = useState<any[]>([]);
  const [baseExpData, setBaseExpData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch type stats
      const typeRes = await fetch(`/api/pokemon/stats?type=${selectedType}`);
      const typeData = await typeRes.json();
      setTypeStats(typeData);

      // Fetch type distribution
      const distRes = await fetch("/api/pokemon/stats");
      const distData = await distRes.json();
      setTypeDistribution(distData.typeDistribution);

      // Fetch top performers with selected limit
      const topRes = await fetch(`/api/pokemon/top?stat=${selectedStat}&limit=${topLimit}`);
      const topData = await topRes.json();
      setTopPokemon(topData);

      // Fetch all pokemon for scatter plot and growth rate analysis
      const scatterRes = await fetch("/api/pokemon?limit=1000");
      const scatterResData = await scatterRes.json();
      const scatterPoints = scatterResData.data.map((p: Pokemon) => ({
        name: p.name,
        weight: parseFloat(p.weight),
        speed: p.speed,
        type: p.type1,
        baseExp: parseInt(p.baseExp) || 0,
        total: p.total,
      }));
      setScatterData(scatterPoints);

      // Analyze growth rate distribution
      const growthRates: Record<string, number> = {};
      scatterResData.data.forEach((p: Pokemon) => {
        const rate = p.growthRate || "Unknown";
        growthRates[rate] = (growthRates[rate] || 0) + 1;
      });
      setGrowthRateData(
        Object.entries(growthRates).map(([name, count]) => ({ name, count }))
      );

      // Analyze base experience by type
      const expByType: Record<string, { total: number; count: number }> = {};
      scatterResData.data.forEach((p: Pokemon) => {
        if (!expByType[p.type1]) {
          expByType[p.type1] = { total: 0, count: 0 };
        }
        expByType[p.type1].total += parseInt(p.baseExp) || 0;
        expByType[p.type1].count++;
      });
      setBaseExpData(
        Object.entries(expByType).map(([type, data]) => ({
          type,
          avgExp: Math.round(data.total / data.count),
        }))
      );

      // Removed: Total Stats Distribution

      // Removed: Avg Speed vs Avg Attack by Type

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedStat, topLimit]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Utility: export JSON array to CSV and trigger download
  const exportToCSV = (data: any[], filename = "export.csv") => {
    if (!data || data.length === 0) return;
    const columns = Object.keys(data[0]);
    const csvRows = [columns.join(",")];
    for (const row of data) {
      const values = columns.map((col) => {
        const val = row[col] ?? "";
        // Escape quotes by doubling
        return typeof val === "string" ? `"${String(val).replace(/"/g, '""')}"` : String(val);
      });
      csvRows.push(values.join(","));
    }
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const radarData = typeStats
    ? [
        { stat: "HP", value: Math.round(typeStats.avgHp) },
        { stat: "Attack", value: Math.round(typeStats.avgAttack) },
        { stat: "Defense", value: Math.round(typeStats.avgDefense) },
        { stat: "Sp.Atk", value: Math.round(typeStats.avgSpAtk) },
        { stat: "Sp.Def", value: Math.round(typeStats.avgSpDef) },
        { stat: "Speed", value: Math.round(typeStats.avgSpeed) },
      ]
    : [];
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <div className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground">Explore comprehensive data insights across all 46 database fields</p>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</span>
              )}
              <Button size="sm" variant="ghost" onClick={() => fetchAnalytics()}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Base Stats by Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-xl p-6"
          >
            <div className="mb-4">
              <Label>Select Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POKEMON_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Average Base Stats: {selectedType}</h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "#A0A0A0" }} />
                <PolarRadiusAxis angle={90} domain={[0, 150]} tick={{ fill: "#A0A0A0" }} />
                <Radar
                  name={selectedType}
                  dataKey="value"
                  stroke={getTypeColor(selectedType)}
                  fill={getTypeColor(selectedType)}
                  fillOpacity={0.5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
          
          {/* Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-strong rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Type Distribution</h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry: any) => String((entry as any).type)}
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          
          {/* Growth Rate Distribution - NEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-strong rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Growth Rate Distribution</h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" tick={{ fill: "#A0A0A0", fontSize: 11 }} angle={-15} textAnchor="end" height={70} />
                <YAxis tick={{ fill: "#A0A0A0" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#FFCB05" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          
          {/* Average Base Experience by Type - NEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-strong rounded-xl p-6"
          >
            <h2 className="text-xl font-bold mb-4">Avg Base Experience by Type</h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={baseExpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="type" tick={{ fill: "#A0A0A0", fontSize: 11 }} angle={-15} textAnchor="end" height={70} />
                <YAxis tick={{ fill: "#A0A0A0" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="avgExp" fill="#3D7DCA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          
          {/* Type Effectiveness Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-strong rounded-xl p-6 lg:col-span-2"
          >
            <h2 className="text-xl font-bold mb-4">Type Effectiveness Matrix</h2>
            <div className="overflow-auto">
              <table className="border-collapse w-full text-xs">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-background z-10">Attack \ Defense</th>
                    {POKEMON_TYPES.map((defType) => (
                      <th key={defType} className="px-2 py-1" style={{ background: getTypeColor(defType), color: '#fff' }}>{defType}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {POKEMON_TYPES.map((atkType) => (
                    <tr key={atkType}>
                      <th className="sticky left-0 bg-background z-10 font-bold px-2 py-1" style={{ background: getTypeColor(atkType), color: '#fff' }}>{atkType}</th>
                      {POKEMON_TYPES.map((defType) => {
                        const eff = getTypeEffectiveness(atkType, defType);
                        let bg = '#fff';
                        let color = '#222';
                        if (eff === 2) { bg = '#4ADE80'; color = '#222'; }
                        else if (eff === 0.5) { bg = '#FBBF24'; color = '#222'; }
                        else if (eff === 0) { bg = '#F87171'; color = '#fff'; }
                        return (
                          <td key={defType} className="px-2 py-1 text-center font-mono" style={{ background: bg, color }}>
                            {eff === 1 ? '' : eff}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Green = super effective (2x), Yellow = not very effective (0.5x), Red = no effect (0x). Blank = normal (1x).</p>
          </motion.div>
          
          {/* Removed: Avg Speed vs Avg Attack by Type chart */}
          
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-strong rounded-xl p-6 lg:col-span-2"
          >
            <div className="mb-4">
              <Label>Select Stat</Label>
              <div className="flex items-center gap-2">
                <Select value={selectedStat} onValueChange={setSelectedStat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hp">HP</SelectItem>
                  <SelectItem value="attack">Attack</SelectItem>
                  <SelectItem value="defense">Defense</SelectItem>
                  <SelectItem value="sp_atk">Sp. Atk</SelectItem>
                  <SelectItem value="sp_def">Sp. Def</SelectItem>
                  <SelectItem value="speed">Speed</SelectItem>
                  <SelectItem value="total">Total Stats</SelectItem>
                </SelectContent>
              </Select>
                <Select value={topLimit} onValueChange={setTopLimit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Top 5</SelectItem>
                    <SelectItem value="10">Top 10</SelectItem>
                    <SelectItem value="25">Top 25</SelectItem>
                    <SelectItem value="50">Top 50</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="ghost" onClick={() => exportToCSV(topPokemon, `${selectedStat}-top-${topLimit}.csv`)}>
                  Export Top CSV
                </Button>
                <Button size="sm" variant="ghost" onClick={() => exportToCSV(scatterData, `scatter-data.csv`)}>
                  Export Scatter CSV
                </Button>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-4">Top 10 Performers: {selectedStat}</h2>
            
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topPokemon}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" tick={{ fill: "#A0A0A0" }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fill: "#A0A0A0" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey={selectedStat === "total" ? "total" : selectedStat === "sp_atk" ? "spAtk" : selectedStat === "sp_def" ? "spDef" : selectedStat}
                  fill="#FF1B1B"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}