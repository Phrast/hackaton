"use client";

import Link from "next/link";
import { MapPin, Users, Zap, CloudOff, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/GlassCard";
import { formatCO2, formatNumber } from "@/lib/utils/formatters";
import type { Site } from "@/types/site";

interface SiteCardProps {
  site: Site;
}

export function SiteCard({ site }: SiteCardProps) {
  const calc = site.latestCalculation;
  const hasCalc = calc != null;

  return (
    <Link href={`/sites/${site.id}`}>
      <GlassCard className="cursor-pointer hover:border-primary/30 hover:shadow-primary/10 hover:shadow-lg group">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{site.name}</h4>
            {site.city && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                {site.city}
              </div>
            )}
          </div>
          <Badge variant={hasCalc ? "default" : "secondary"} className={hasCalc ? "bg-accent/20 text-accent border-accent/30" : ""}>
            {hasCalc ? "Calculé" : "En attente"}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground">Surface</p>
            <p className="text-xs font-semibold">{formatNumber(site.surfaceM2)} m²</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Users className="h-3 w-3"/>Emp.</p>
            <p className="text-xs font-semibold">{formatNumber(site.employeesCount)}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Zap className="h-3 w-3"/>MWh</p>
            <p className="text-xs font-semibold">{site.annualEnergyKwh ? (site.annualEnergyKwh/1000).toFixed(0) : "—"}</p>
          </div>
        </div>

        {hasCalc && (
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CloudOff className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">CO₂ total</span>
              </div>
              <span className="text-sm font-bold text-primary">{formatCO2(calc.totalCo2Kg)}</span>
            </div>
            {calc.co2PerM2 && (
              <p className="text-xs text-muted-foreground mt-1">{calc.co2PerM2.toFixed(1)} kgCO₂e/m²</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground group-hover:text-primary transition-colors">
          Voir le détail <ArrowRight className="h-3 w-3 ml-1" />
        </div>
      </GlassCard>
    </Link>
  );
}
