"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CloudOff, Users, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SiteCard } from "@/components/dashboard/SiteCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { sitesApi } from "@/lib/api/sites";
import { formatCO2 } from "@/lib/utils/formatters";
import type { Site } from "@/types/site";

export default function DashboardPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sitesApi.findAll(0, 50)
      .then((r) => setSites(r.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sitesWithCalc = sites.filter((s) => s.latestCalculation);
  const totalCo2 = sitesWithCalc.reduce((sum, s) => sum + (s.latestCalculation?.totalCo2Kg ?? 0), 0);
  const totalEmployees = sites.reduce((sum, s) => sum + (s.employeesCount ?? 0), 0);
  const totalEnergy = sites.reduce((sum, s) => sum + (s.annualEnergyKwh ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="CO₂ Total (tous sites)"
          value={formatCO2(totalCo2)}
          subtitle={`${sitesWithCalc.length} site(s) calculé(s)`}
          icon={CloudOff}
          color="primary"
        />
        <KpiCard
          title="Sites enregistrés"
          value={String(sites.length)}
          icon={Building2}
          color="accent"
        />
        <KpiCard
          title="Employés (total)"
          value={new Intl.NumberFormat("fr-FR").format(totalEmployees)}
          icon={Users}
          color="blue"
        />
        <KpiCard
          title="Énergie consommée"
          value={`${(totalEnergy / 1000).toFixed(0)} MWh/an`}
          icon={Zap}
          color="amber"
        />
      </div>

      {/* Sites list */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Derniers sites</h3>
        <Button size="sm" onClick={() => router.push("/sites/new")} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Nouveau site
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="glass-card h-44 animate-pulse" />
          ))}
        </div>
      ) : sites.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aucun site"
          description="Commencez par ajouter votre premier site physique pour calculer son empreinte carbone."
          action={
            <Button onClick={() => router.push("/sites/new")} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un site
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sites.slice(0, 6).map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </div>
  );
}
