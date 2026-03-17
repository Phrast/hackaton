"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCO2 } from "@/lib/utils/formatters";
import type { Calculation } from "@/types/site";

interface Props {
  calculation: Calculation;
}

export function EmissionBreakdownChart({ calculation }: Props) {
  const lifetime = 50;
  const data = [
    {
      name: "Construction",
      value: calculation.constructionCo2Kg,
      color: "#16a34a",
    },
    {
      name: `Exploitation (${lifetime} ans)`,
      value: calculation.exploitationCo2Kg * lifetime,
      color: "#16a34a",
    },
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 text-sm">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-primary">{formatCO2(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
