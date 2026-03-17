"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteCard } from "@/components/dashboard/SiteCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { sitesApi } from "@/lib/api/sites";
import type { Site } from "@/types/site";

export default function SitesPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    sitesApi.findAll(0, 100)
      .then((r) => setSites(r.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = sites.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.city ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 glass border-border"
          />
        </div>
        <Button onClick={() => router.push("/sites/new")} className="bg-primary hover:bg-primary/90 shrink-0">
          <Plus className="h-4 w-4 mr-1" /> Nouveau site
        </Button>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-sm text-muted-foreground">
          {filtered.length} site{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="glass-card h-48 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Aucun site trouvé"
          description="Ajoutez votre premier site ou modifiez votre recherche."
          action={
            <Button onClick={() => router.push("/sites/new")} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" /> Ajouter un site
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
    </div>
  );
}
