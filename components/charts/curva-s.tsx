"use client";

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Legend,
} from "recharts";

export interface CurvaSPoint {
  mes: string;
  previsto: number;
  realizado: number | null;
}

interface Props {
  data: CurvaSPoint[];
  hojeIndex: number;
  unit?: "%" | "BRL";
  height?: number;
}

function fmtBRL(v: number) {
  if (v >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `R$ ${(v / 1_000).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
}

function CustomTooltip({ active, payload, label, unit }: {
  active?: boolean;
  payload?: { dataKey: string; color: string; value: number; name: string }[];
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-surface-border rounded-lg shadow-md px-3 py-2 text-[11px]">
      <p className="font-semibold text-text-secondary mb-1.5">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="leading-snug">
          {p.name === "previsto" ? "Previsto" : "Realizado"}:{" "}
          <strong>{unit === "BRL" ? fmtBRL(p.value) : `${p.value}%`}</strong>
        </p>
      ))}
    </div>
  );
}

export function CurvaS({ data, hojeIndex, unit = "%", height = 210 }: Props) {
  if (data.length < 2) return null;

  const hojeLabel = data[hojeIndex]?.mes;
  const tickFmt = unit === "BRL" ? fmtBRL : (v: number) => `${v}%`;
  const yWidth = unit === "BRL" ? 62 : 36;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 16, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="gprev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00B4A6" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#00B4A6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="greal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16A34A" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />

        <XAxis
          dataKey="mes"
          tick={{ fontSize: 10, fill: "#9CA3AF" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#9CA3AF" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={tickFmt}
          width={yWidth}
          domain={unit === "%" ? [0, 100] : ["auto", "auto"]}
        />

        <Tooltip content={<CustomTooltip unit={unit} />} />

        <Legend
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
          formatter={(v) => (v === "previsto" ? "Previsto (baseline)" : "Realizado (acumulado)")}
        />

        {hojeLabel && (
          <ReferenceLine
            x={hojeLabel}
            stroke="#F59E0B"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: "hoje", position: "insideTopRight", fontSize: 9, fill: "#F59E0B" }}
          />
        )}

        <Area
          type="monotone"
          dataKey="previsto"
          name="previsto"
          stroke="#00B4A6"
          strokeWidth={2}
          fill="url(#gprev)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          connectNulls
        />
        <Area
          type="monotone"
          dataKey="realizado"
          name="realizado"
          stroke="#16A34A"
          strokeWidth={2}
          fill="url(#greal)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          connectNulls={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
