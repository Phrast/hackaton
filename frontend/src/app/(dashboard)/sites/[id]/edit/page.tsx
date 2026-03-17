"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SiteForm } from "@/components/forms/SiteForm";
import { sitesApi } from "@/lib/api/sites";
import type { Site } from "@/types/site";

export default function EditSitePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    sitesApi.findById(Number(id))
      .then(setSite)
      .catch(() => router.push("/sites"));
  }, [id, router]);

  if (!site) return <div className="glass-card h-64 animate-pulse" />;

  return (
    <div className="max-w-3xl mx-auto">
      <SiteForm site={site} />
    </div>
  );
}
