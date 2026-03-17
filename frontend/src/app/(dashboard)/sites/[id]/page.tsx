"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calculator, Download, Pencil, Trash2, ArrowLeft,
  Building2, MapPin, Users, Zap, CloudOff, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassCard } from "@/components/shared/GlassCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { EmissionBreakdownChart } from "@/components/charts/EmissionBreakdownChart";
import { MaterialBarChart } from "@/components/charts/MaterialBarChart";
import { HistoryLineChart } from "@/components/charts/HistoryLineChart";
import { sitesApi } from "@/lib/api/sites";
import { formatCO2, formatNumber, formatDateTime, downloadBlob } from "@/lib/utils/formatters";
import type { Site, Calculation } from "@/types/site";

export default function SiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const siteId = Number(id);

  const [site, setSite] = useState<Site | null>(null);
  const [history, setHistory] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchSite = () => {
    sitesApi.findById(siteId).then(setSite).catch(() => router.push("/sites"));
    sitesApi.getHistory(siteId).then(setHistory).catch(console.error);
  };

  useEffect(() => {
    Promise.all([
      sitesApi.findById(siteId),
      sitesApi.getHistory(siteId),
    ]).then(([s, h]) => { setSite(s); setHistory(h); })
      .catch(() => router.push("/sites"))
      .finally(() => setLoading(false));
  }, [siteId, router]);

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      await sitesApi.calculate(siteId);
      toast.success("Calcul effectué !");
      fetchSite();
    } catch {
      toast.error("Erreur lors du calcul");
    } finally {
      setCalculating(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const blob = await sitesApi.exportPdf(siteId);
      downloadBlob(blob, `rapport-${site?.name ?? siteId}.pdf`);
      toast.success("PDF exporté !");
    } catch {
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce site ? Cette action est irréversible.")) return;
    try {
      await sitesApi.delete(siteId);
      toast.success("Site supprimé");
      router.push("/sites");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="glass-card h-32 animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="glass-card h-28 animate-pulse" />)}
      </div>
    </div>
  );

  if (!site) return null;
  const calc = site.latestCalculation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{site.name}</h1>
              {calc ? (
                <Badge className="bg-accent/20 text-accent border-accent/30">Calculé</Badge>
              ) : (
                <Badge variant="secondary">Non calculé</Badge>
              )}
            </div>
            {site.city && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5" /> {site.city}, {site.country}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleCalculate}
            disabled={calculating}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Calculator className="h-4 w-4 mr-1" />
            {calculating ? "Calcul…" : "Calculer"}
          </Button>
          <Button variant="outline" size="sm" className="border-border" onClick={handleExportPdf} disabled={exporting || !calc}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push(`/sites/${siteId}/edit`)} className="hover:bg-muted">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Site info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 flex items-center gap-3">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Surface</p>
            <p className="text-sm font-semibold">{formatNumber(site.surfaceM2)} m²</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Employés</p>
            <p className="text-sm font-semibold">{formatNumber(site.employeesCount)}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <Zap className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Énergie/an</p>
            <p className="text-sm font-semibold">{site.annualEnergyKwh ? `${(site.annualEnergyKwh/1000).toFixed(0)} MWh` : "—"}</p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Durée de vie</p>
            <p className="text-sm font-semibold">{site.buildingLifetime} ans</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      {calc && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="CO₂ Total"
            value={formatCO2(calc.totalCo2Kg)}
            subtitle={`sur ${site.buildingLifetime} ans`}
            icon={CloudOff}
            color="primary"
          />
          <KpiCard
            title="CO₂ Construction"
            value={formatCO2(calc.constructionCo2Kg)}
            icon={Building2}
            color="blue"
          />
          <KpiCard
            title="CO₂/m²"
            value={calc.co2PerM2 ? `${calc.co2PerM2.toFixed(1)} kg` : "—"}
            subtitle="kgCO₂e par m²"
            icon={MapPin}
            color="accent"
          />
          <KpiCard
            title="CO₂/Employé"
            value={calc.co2PerEmployee ? `${(calc.co2PerEmployee/1000).toFixed(2)} t` : "—"}
            subtitle="tCO₂e par employé"
            icon={Users}
            color="amber"
          />
        </div>
      )}

      {/* Tabs: Charts + Materials + History */}
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="glass border-border">
          <TabsTrigger value="charts">Graphiques</TabsTrigger>
          <TabsTrigger value="materials">Matériaux ({site.materials.length})</TabsTrigger>
          <TabsTrigger value="history">Historique ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          {!calc ? (
            <GlassCard className="text-center py-12">
              <CloudOff className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Lancez un calcul pour voir les graphiques</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard>
                <h4 className="font-semibold text-sm mb-4">Répartition Construction / Exploitation</h4>
                <EmissionBreakdownChart calculation={calc} />
              </GlassCard>
              {site.materials.length > 0 && (
                <GlassCard>
                  <h4 className="font-semibold text-sm mb-4">Émissions par matériau</h4>
                  <MaterialBarChart materials={site.materials} />
                </GlassCard>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials">
          <GlassCard>
            {site.materials.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucun matériau enregistré</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Matériau</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Catégorie</th>
                      <th className="text-right py-2 px-3 text-muted-foreground font-medium">Quantité (kg)</th>
                      <th className="text-right py-2 px-3 text-muted-foreground font-medium">Facteur</th>
                      <th className="text-right py-2 px-3 text-muted-foreground font-medium">CO₂ (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {site.materials.map((m) => (
                      <tr key={m.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-2.5 px-3 font-medium">{m.materialName}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant="secondary" className="text-xs">{m.category}</Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">{formatNumber(m.quantityKg)}</td>
                        <td className="py-2.5 px-3 text-right text-muted-foreground">{m.emissionFactor}</td>
                        <td className="py-2.5 px-3 text-right text-primary font-semibold">{formatCO2(m.co2Kg)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {history.length >= 2 && (
              <GlassCard>
                <h4 className="font-semibold text-sm mb-4">Évolution CO₂ dans le temps</h4>
                <HistoryLineChart calculations={history} />
              </GlassCard>
            )}
            <GlassCard>
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Aucun calcul effectué</p>
              ) : (
                <div className="space-y-2">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                      <div>
                        <p className="text-sm font-medium">{formatCO2(h.totalCo2Kg)}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(h.calculatedAt)}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>Construction: {formatCO2(h.constructionCo2Kg)}</p>
                        <p>Exploitation/an: {formatCO2(h.exploitationCo2Kg)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
