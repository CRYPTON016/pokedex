"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BarChart3, Users, Atom, Menu, X, Heart } from "lucide-react";
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
    color: "text-pink-500",
  },
  {
    label: "Predictive Lab",
    icon: Atom,
    href: "/predictive-lab",
    color: "text-purple-500",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden glass-strong"
        size="icon"
        variant="ghost"
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 glass-strong border-r border-border transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-border">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Pokédex Arcana
            </h1>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant={pathname === route.href ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      pathname === route.href
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-primary/10"
                    )}
                  >
                    <route.icon className={cn("h-5 w-5", route.color)} />
                    {route.label}
                  </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};