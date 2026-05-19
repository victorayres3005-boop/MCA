"use client";

import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import type { Projeto } from "@/lib/types";

const SEMAFOROS = [
  { key: "verde",    label: "Saudável", color: "#16A34A" },
  { key: "amarelo",  label: "Atenção",  color: "#F59E0B" },
  { key: "vermelho", label: "Crítico",  color: "#DC2626" },
] as const;

interface SemaforoChartProps {
  projetos: Projeto[];
}

export function SemaforoChart({ projetos }: SemaforoChartProps) {
  const data = SEMAFOROS
    .map((s) => ({
      name:  s.label,
      value: projetos.filter((p) => p.semaforo === s.key).length,
      color: s.color,
    }))
    .filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px]">
        <p className="text-sm text-text-disabled">Sem dados</p>
      </div>
    );
  }

  const total = projetos.length;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} de ${total}`, ""]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8E8" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ fontSize: 12, color: "#4A6060" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
