"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GitCompare, Loader2, CloudOff, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/GlassCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ComparisonRadarChart } from "@/components/charts/ComparisonRadarChart";
import { sitesApi } from "@/lib/api/sites";
import { formatCO2 } from "@/lib/utils/formatters";
import type { Site, ComparisonItem } from "@/types/site";

export default function ComparePage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [comparison, setComparison] = useState<ComparisonItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sitesApi.findAll(0, 100).then((r) => setSites(r.content)).catch(console.error);
  }, []);

  const toggleSite = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setComparison(null);
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      toast.warning("Sélectionnez au moins 2 sites");
      return;
    }
    setLoading(true);
    try {
      const result = await sitesApi.compare(selectedIds);
      setComparison(result.sites);
    } catch {
      toast.error("Erreur lors de la comparaison");
    } finally {
      setLoading(false);
    }
  };

  const sitesWithCalc = sites.filter((s) => s.latestCalculation);

  return (
    <div className="space-y-6">
      {/* Site selector */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Sélectionner les sites à comparer</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Choisissez au moins 2 sites ayant été calculés</p>
          </div>
          <Button
            onClick={handleCompare}
            disabled={selectedIds.length < 2 || loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <GitCompare className="h-4 w-4 mr-2" />}
            Comparer ({selectedIds.length})
          </Button>
        </div>

        {sitesWithCalc.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Aucun site calculé"
            description="Calculez l'empreinte carbone d'au moins 2 sites pour les comparer."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sitesWithCalc.map((site) => {
              const selected = selectedIds.includes(site.id);
              return (
                <button
                  key={site.id}
                  onClick={() => toggleSite(site.id)}
                  className={`p-4 rounded-xl text-left transition-all border ${
                    selected
                      ? "bg-primary/15 border-primary/40 text-foreground"
                      : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{site.name}</p>
                    {selected && <Badge className="bg-primary text-primary-foreground text-xs px-1.5">✓</Badge>}
                  </div>
                  {site.city && <p className="text-xs mb-1">{site.city}</p>}
                  {site.latestCalculation && (
                    <p className="text-xs font-medium text-primary">
                      {formatCO2(site.latestCalculation.totalCo2Kg)}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* Comparison results */}
      {comparison && (
        <>
          {/* Radar chart */}
          <GlassCard>
            <h3 className="font-semibold mb-4">Analyse comparative (normalisée)</h3>
            <ComparisonRadarChart items={comparison} />
          </GlassCard>

          {/* Table */}
          <GlassCard>
            <h3 className="font-semibold mb-4">Tableau comparatif</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Site</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium flex items-center justify-end gap-1"><CloudOff className="h-3.5 w-3.5" /> CO₂ Total</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Construction</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Exploit./an</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">CO₂/m²</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium"><Users className="h-3.5 w-3.5 inline mr-1" />CO₂/emp.</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((item) => (
                    <tr key={item.siteId} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <p className="font-semibold">{item.siteName}</p>
                        {item.city && <p className="text-xs text-muted-foreground">{item.city}</p>}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-primary">
                        {item.latestCalculation ? formatCO2(item.latestCalculation.totalCo2Kg) : "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-sky-400">
                        {item.latestCalculation ? formatCO2(item.latestCalculation.constructionCo2Kg) : "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-accent">
                        {item.latestCalculation ? formatCO2(item.latestCalculation.exploitationCo2Kg) : "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {item.latestCalculation?.co2PerM2 ? `${item.latestCalculation.co2PerM2.toFixed(1)} kg` : "—"}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {item.latestCalculation?.co2PerEmployee
                          ? `${(item.latestCalculation.co2PerEmployee/1000).toFixed(2)} t`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
}
