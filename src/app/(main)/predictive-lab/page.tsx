"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { getTypeClass, POKEMON_TYPES } from "@/lib/pokemon-types";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Simple type prediction based on stat patterns
const predictType = (stats: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number }) => {
  const { hp, attack, defense, spAtk, spDef, speed } = stats;
  
  // Calculate stat characteristics
  const physicalBias = (attack + defense) / 2;
  const specialBias = (spAtk + spDef) / 2;
  const totalDefense = (defense + spDef) / 2;
  const totalOffense = (attack + spAtk) / 2;
  
  // Type prediction logic
  if (spAtk > 100 && speed > 90) {
    if (spAtk > attack * 1.5) return { type: "Electric", confidence: 85 };
    return { type: "Psychic", confidence: 80 };
  }
  
  if (attack > 100 && defense > 90) {
    if (attack > spAtk * 1.5) return { type: "Fighting", confidence: 85 };
    return { type: "Rock", confidence: 75 };
  }
  
  if (totalDefense > 100) {
    if (hp > 100) return { type: "Steel", confidence: 80 };
    return { type: "Rock", confidence: 75 };
  }
  
  if (speed > 110) {
    if (attack > spAtk) return { type: "Flying", confidence: 80 };
    return { type: "Electric", confidence: 75 };
  }
  
  if (spAtk > 90 && totalDefense > 80) {
    return { type: "Dragon", confidence: 82 };
  }
  
  if (attack > 100) {
    if (speed > 80) return { type: "Dark", confidence: 78 };
    return { type: "Fighting", confidence: 75 };
  }
  
  if (spAtk > 90) {
    if (spDef > defense) return { type: "Fairy", confidence: 75 };
    return { type: "Fire", confidence: 80 };
  }
  
  if (defense > 90) {
    return { type: "Steel", confidence: 72 };
  }
  
  if (hp > 100) {
    return { type: "Normal", confidence: 70 };
  }
  
  // Default prediction
  return { type: "Normal", confidence: 65 };
};

export default function PredictiveLabPage() {
  const [hp, setHp] = useState([85]);
  const [attack, setAttack] = useState([85]);
  const [defense, setDefense] = useState([85]);
  const [spAtk, setSpAtk] = useState([85]);
  const [spDef, setSpDef] = useState([85]);
  const [speed, setSpeed] = useState([85]);
  const [prediction, setPrediction] = useState<{ type: string; confidence: number } | null>(null);
  
  const handlePredict = () => {
    const result = predictType({
      hp: hp[0],
      attack: attack[0],
      defense: defense[0],
      spAtk: spAtk[0],
      spDef: spDef[0],
      speed: speed[0],
    });
    setPrediction(result);
  };
  
  const randomizeStats = () => {
    setHp([Math.floor(Math.random() * 200) + 20]);
    setAttack([Math.floor(Math.random() * 200) + 20]);
    setDefense([Math.floor(Math.random() * 200) + 20]);
    setSpAtk([Math.floor(Math.random() * 200) + 20]);
    setSpDef([Math.floor(Math.random() * 200) + 20]);
    setSpeed([Math.floor(Math.random() * 200) + 20]);
    setPrediction(null);
  };
  
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block relative mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Predictive Lab
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-xl -z-10 animate-pulse" />
          </div>
          <p className="text-muted-foreground">
            Design a custom Pokémon and predict its type based on base stats
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stat Sliders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-secondary" />
              Create-A-Pokémon
            </h2>
            
            <div className="space-y-6">
              <div>
                <Label className="flex justify-between mb-2">
                  <span>HP</span>
                  <span className="text-primary font-bold">{hp[0]}</span>
                </Label>
                <Slider
                  min={1}
                  max={255}
                  step={1}
                  value={hp}
                  onValueChange={setHp}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="flex justify-between mb-2">
                  <span>Attack</span>
                  <span className="text-primary font-bold">{attack[0]}</span>
                </Label>
                <Slider
                  min={1}
                  max={255}
                  step={1}
                  value={attack}
                  onValueChange={setAttack}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="flex justify-between mb-2">
                  <span>Defense</span>
                  <span className="text-primary font-bold">{defense[0]}</span>
                </Label>
                <Slider
                  min={1}
                  max={255}
                  step={1}
                  value={defense}
                  onValueChange={setDefense}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="flex justify-between mb-2">
                  <span>Sp. Atk</span>
                  <span className="text-primary font-bold">{spAtk[0]}</span>
                </Label>
                <Slider
                  min={1}
                  max={255}
                  step={1}
                  value={spAtk}
                  onValueChange={setSpAtk}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="flex justify-between mb-2">
                  <span>Sp. Def</span>
                  <span className="text-primary font-bold">{spDef[0]}</span>
                </Label>
                <Slider
                  min={1}
                  max={255}
                  step={1}
                  value={spDef}
                  onValueChange={setSpDef}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label className="flex justify-between mb-2">
                  <span>Speed</span>
                  <span className="text-primary font-bold">{speed[0]}</span>
                </Label>
                <Slider
                  min={1}
                  max={255}
                  step={1}
                  value={speed}
                  onValueChange={setSpeed}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <Button
                onClick={handlePredict}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white text-lg py-6"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Predict Type
              </Button>
              
              <Button
                onClick={randomizeStats}
                variant="outline"
                className="w-full"
              >
                Randomize Stats
              </Button>
            </div>
          </motion.div>
          
          {/* Prediction Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-xl p-8 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold mb-8">Type Prediction</h2>
            
            {prediction ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-4">Predicted Type:</p>
                  <span
                    className={`${getTypeClass(prediction.type)} text-white text-3xl font-bold px-8 py-4 rounded-2xl inline-block shadow-lg uppercase tracking-wider`}
                  >
                    {prediction.type}
                  </span>
                </div>
                
                <div className="glass rounded-xl p-6 mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                  <div className="relative">
                    <div className="text-5xl font-bold text-primary">{prediction.confidence}%</div>
                    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-2">Base Stat Total</p>
                  <p className="text-2xl font-bold text-secondary">
                    {hp[0] + attack[0] + defense[0] + spAtk[0] + spDef[0] + speed[0]}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-muted/20 flex items-center justify-center mb-6 mx-auto">
                  <Sparkles className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className="text-lg text-muted-foreground">
                  Adjust the stats and click<br />
                  <span className="text-primary font-semibold">"Predict Type"</span><br />
                  to see the prediction
                </p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Info Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-strong rounded-xl p-6"
        >
          <h3 className="text-lg font-bold mb-3">How It Works</h3>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              This predictive model analyzes the base stat distribution you create to determine
              the most likely Pokémon type. The algorithm considers:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Physical vs. Special stat bias (Attack/Defense vs. Sp.Atk/Sp.Def)</li>
              <li>Offensive vs. Defensive orientation</li>
              <li>Speed tier characteristics</li>
              <li>Overall stat distribution patterns</li>
            </ul>
            <p className="mt-3 text-xs italic">
              Note: This is a simplified prediction model for demonstration purposes. 
              Actual Pokémon typing involves many more factors including abilities, moves, and design themes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}