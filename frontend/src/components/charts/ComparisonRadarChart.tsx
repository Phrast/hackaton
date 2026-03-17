"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CHART_COLORS } from "@/lib/utils/constants";
import type { ComparisonItem } from "@/types/site";

interface Props {
  items: ComparisonItem[];
}

export function ComparisonRadarChart({ items }: Props) {
  const validItems = items.filter((i) => i.latestCalculation);

  if (validItems.length < 2) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
      Calculez l&apos;empreinte d&apos;au moins 2 sites pour comparer
    </div>
  );

  // Normalize values to 0-100 for radar
  const maxConstruction = Math.max(...validItems.map((i) => i.latestCalculation!.constructionCo2Kg));
  const maxExploitation = Math.max(...validItems.map((i) => i.latestCalculation!.exploitationCo2Kg));
  const maxPerM2 = Math.max(...validItems.map((i) => i.latestCalculation!.co2PerM2 ?? 0));
  const maxPerEmp = Math.max(...validItems.map((i) => i.latestCalculation!.co2PerEmployee ?? 0));

  const dimensions = ["Construction", "Exploitation", "CO₂/m²", "CO₂/employé"];

  const data = dimensions.map((dim, idx) => {
    const entry: Record<string, string | number> = { dimension: dim };
    validItems.forEach((item, i) => {
      const calc = item.latestCalculation!;
      const values = [
        maxConstruction > 0 ? (calc.constructionCo2Kg / maxConstruction) * 100 : 0,
        maxExploitation > 0 ? (calc.exploitationCo2Kg / maxExploitation) * 100 : 0,
        maxPerM2 > 0 ? ((calc.co2PerM2 ?? 0) / maxPerM2) * 100 : 0,
        maxPerEmp > 0 ? ((calc.co2PerEmployee ?? 0) / maxPerEmp) * 100 : 0,
      ];
      entry[item.siteName] = +values[idx].toFixed(1);
    });
    return entry;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: "rgba(15,15,25,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
        />
        <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
        {validItems.map((item, i) => (
          <Radar
            key={item.siteId}
            name={item.siteName}
            dataKey={item.siteName}
            stroke={CHART_COLORS[i]}
            fill={CHART_COLORS[i]}
            fillOpacity={0.15}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
