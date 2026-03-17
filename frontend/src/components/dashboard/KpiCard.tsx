"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "primary" | "accent" | "blue" | "amber";
  className?: string;
}

const colorMap = {
  primary: { bg: "bg-primary/10", border: "border-primary/20", icon: "text-primary", badge: "bg-primary/20 text-primary" },
  accent:  { bg: "bg-accent/10",  border: "border-accent/20",  icon: "text-accent",  badge: "bg-accent/20 text-accent"  },
  blue:    { bg: "bg-sky-500/10", border: "border-sky-500/20", icon: "text-sky-400", badge: "bg-sky-500/20 text-sky-400" },
  amber:   { bg: "bg-amber-500/10",border:"border-amber-500/20",icon:"text-amber-400",badge:"bg-amber-500/20 text-amber-400"},
};

export function KpiCard({ title, value, subtitle, icon: Icon, trend, color = "primary", className }: KpiCardProps) {
  const c = colorMap[color];

  return (
    <div className={cn("glass-card p-5 hover:scale-[1.02] transition-all duration-300", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("rounded-xl p-2.5 border", c.bg, c.border)}>
          <Icon className={cn("h-5 w-5", c.icon)} />
        </div>
        {trend && (
          <span className={cn("text-xs font-medium px-2 py-1 rounded-full", c.badge)}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold tracking-tight count-up">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>}
    </div>
  );
}
