"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCO2, formatDate } from "@/lib/utils/formatters";
import type { Calculation } from "@/types/site";

interface Props {
  calculations: Calculation[];
}

export function HistoryLineChart({ calculations }: Props) {
  const data = [...calculations]
    .sort((a, b) => new Date(a.calculatedAt).getTime() - new Date(b.calculatedAt).getTime())
    .map((c) => ({
      date: formatDate(c.calculatedAt),
      total: +(c.totalCo2Kg / 1000).toFixed(2),
      construction: +(c.constructionCo2Kg / 1000).toFixed(2),
      exploitation: +(c.exploitationCo2Kg / 1000).toFixed(2),
    }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-sm space-y-1">
          <p className="font-semibold text-xs text-muted-foreground">{label}</p>
          {payload.map((p) => (
            <p key={p.name} style={{ color: p.color }} className="text-xs">
              {p.name}: {p.value} tCO₂e
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}t`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
        <Line type="monotone" dataKey="total" name="Total" stroke="#16a34a" strokeWidth={2} dot={{ fill: "#16a34a", r: 4 }} />
        <Line type="monotone" dataKey="construction" name="Construction" stroke="#0ea5e9" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
        <Line type="monotone" dataKey="exploitation" name="Exploitation" stroke="#16a34a" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}
