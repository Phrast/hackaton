"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/sites": "Sites",
  "/compare": "Comparaison",
};

function getTitle(pathname: string): string {
  if (pathname.startsWith("/sites/new")) return "Nouveau site";
  if (pathname.startsWith("/sites/") && pathname.includes("/edit")) return "Modifier le site";
  if (pathname.startsWith("/sites/")) return "Détail du site";
  return PAGE_TITLES[pathname] ?? "CarbonTrack";
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="glass border-b border-border px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{getTitle(pathname)}</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-muted-foreground">Données ADEME 2023</span>
        </div>
      </div>
    </header>
  );
}
