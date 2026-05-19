"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import type { Projeto, StatusProjeto } from "@/lib/types";

const STATUS_CONFIG: { key: StatusProjeto; label: string; color: string }[] = [
  { key: "planejamento",  label: "Planejamento",  color: "#2563EB" },
  { key: "execucao",      label: "Execução",       color: "#00B4A6" },
  { key: "monitoramento", label: "Monitoramento",  color: "#9333EA" },
  { key: "encerrado",     label: "Encerrado",      color: "#16A34A" },
  { key: "suspenso",      label: "Suspenso",       color: "#94A3A3" },
];

interface StatusChartProps {
  projetos: Projeto[];
}

export function StatusChart({ projetos }: StatusChartProps) {
  const data = STATUS_CONFIG
    .map((s) => ({
      name:  s.label,
      total: projetos.filter((p) => p.status === s.key).length,
      color: s.color,
    }))
    .filter((d) => d.total > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px]">
        <p className="text-sm text-text-disabled">Sem dados</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94A3A3" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 11, fill: "#4A6060" }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "#F1F5F5" }}
          formatter={(value) => [value, "projetos"]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8E8" }}
        />
        <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
