"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BarChart3, Users, Atom, Menu, X, Heart, Zap } from "lucide-react";
import { useState } from "react";

const routes = [
  {
    label: "Pokédex",
    icon: BookOpen,
    href: "/pokedex",
    color: "text-primary",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-accent",
  },
  {
    label: "Team Builder",
    icon: Users,
    href: "/team-builder",
    color: "text-secondary",
  },
  {
    label: "Breeding",
    icon: Heart,
    href: "/breeding",
    color: "text-pink-400",
  },
  {
    label: "Predictive Lab",
    icon: Atom,
    href: "/predictive-lab",
    color: "text-purple-400",
  },
];

export const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b-2 border-primary/20">
        <div className="flex items-center justify-between h-24 px-6 md:px-10 max-w-[2000px] mx-auto">
          {/* Logo */}
          <Link href="/pokedex" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 blur-2xl group-hover:opacity-50 transition-all" />
              <Zap className="h-10 w-10 text-primary relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                POKÉDEX
              </h1>
              <p className="text-[9px] text-muted-foreground tracking-[0.3em] uppercase hidden md:block font-semibold">
                Arcana Edition
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link key={route.href} href={route.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="lg"
                    className={cn(
                      "gap-3 relative overflow-hidden group h-14 px-6",
                      isActive
                        ? "bg-primary/20 text-primary hover:bg-primary/30 shadow-xl shadow-primary/20 border-2 border-primary/30"
                        : "hover:bg-primary/10 hover:text-primary border-2 border-transparent hover:border-primary/20"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 animate-pulse" />
                    )}
                    <route.icon className={cn("h-6 w-6 relative z-10", isActive ? "text-primary" : route.color)} />
                    <span className="hidden xl:inline relative z-10 font-bold">{route.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden border-2 border-primary/30"
            size="icon"
            variant="ghost"
          >
            {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </Button>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t-2 border-primary/10",
            isMenuOpen ? "max-h-[500px]" : "max-h-0"
          )}
        >
          <nav className="flex flex-col p-5 gap-3 bg-background/98 backdrop-blur-xl">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-4 h-16 text-base",
                      isActive
                        ? "bg-primary/20 text-primary hover:bg-primary/30 shadow-lg border-2 border-primary/30"
                        : "hover:bg-primary/10 hover:text-primary border-2 border-transparent hover:border-primary/20"
                    )}
                  >
                    <route.icon className={cn("h-6 w-6", isActive ? "text-primary" : route.color)} />
                    <span className="font-bold">{route.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="h-24" />
    </>
  );
};