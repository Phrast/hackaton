"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatCO2 } from "@/lib/utils/formatters";
import { CATEGORY_COLORS } from "@/lib/utils/constants";
import type { SiteMaterial } from "@/types/site";

interface Props {
  materials: SiteMaterial[];
}

export function MaterialBarChart({ materials }: Props) {
  const data = materials
    .filter((m) => m.co2Kg > 0)
    .map((m) => ({
      name: m.materialName.length > 12 ? m.materialName.slice(0, 12) + "…" : m.materialName,
      fullName: m.materialName,
      value: m.co2Kg,
      category: m.category,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { fullName: string; value: number } }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-sm">
          <p className="font-semibold">{payload[0].payload.fullName}</p>
          <p className="text-primary">{formatCO2(payload[0].payload.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}t`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={CATEGORY_COLORS[entry.category] ?? "#16a34a"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
