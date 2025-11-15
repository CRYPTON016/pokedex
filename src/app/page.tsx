"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Cpu } from "lucide-react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/pokedex");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8 relative overflow-hidden">
      {/* Animated orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-pulse" />
      </div>
      
      <div className="text-center max-w-3xl w-full relative z-10">
        {/* Main logo */}
        <div className="mb-12 relative">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="h-12 w-12 text-primary animate-spin" style={{ animationDuration: '8s' }} />
            <Zap className="h-16 w-16 text-secondary" />
            <Cpu className="h-12 w-12 text-accent animate-pulse" />
          </div>
          
          <div className="inline-block">
            <h1 className="text-8xl md:text-9xl font-black mb-4 animate-fade-in bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              POKÉDEX
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <p className="text-3xl md:text-4xl font-light text-secondary tracking-[0.5em]">
                ARCANA
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
          </div>
          
          <div className="absolute -inset-12 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-[100px] -z-10 animate-pulse-slow" />
        </div>
        
        <div className="space-y-4 mb-12 animate-fade-in animation-delay-200">
          <p className="text-2xl md:text-3xl font-semibold text-foreground">
            The Ultimate Pokémon Data Experience
          </p>
          <p className="text-lg text-muted-foreground">
            Advanced Research • Real-Time Analytics • Comprehensive Database
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-6 animate-fade-in animation-delay-400">
          <div className="glass-strong rounded-2xl px-8 py-4 border-2 border-primary/30">
            <p className="text-sm text-muted-foreground/80 tracking-widest uppercase">
              Silph Co. Black Label • Premium Research Edition
            </p>
          </div>
          
          <Button
            onClick={() => router.push("/pokedex")}
            size="lg"
            className="bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white px-12 py-8 text-xl rounded-2xl shadow-2xl shadow-primary/50 hover-glow font-bold"
          >
            <Zap className="mr-3 h-6 w-6" />
            Initialize System
          </Button>
          
          <p className="text-sm text-muted-foreground/60 animate-pulse mt-4">
            Auto-redirecting in 3 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}