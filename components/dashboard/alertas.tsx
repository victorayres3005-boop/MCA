import Link from "next/link";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { Projeto } from "@/lib/types";

const SEM_CFG = {
  vermelho: { dot: "#DC2626", badge: "bg-red-50 text-red-600 border-red-100",    label: "Crítico"  },
  amarelo:  { dot: "#F59E0B", badge: "bg-amber-50 text-amber-600 border-amber-100", label: "Atenção" },
} as const;

interface AlertasProps {
  projetos: Projeto[];
}

export function Alertas({ projetos }: AlertasProps) {
  const criticos = projetos.filter(
    (p) => (p.semaforo === "vermelho" || p.semaforo === "amarelo") && p.status !== "encerrado"
  );

  if (criticos.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E9EBF0] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E9EBF0]">
        <IconAlertTriangle size={14} className="text-amber-500 shrink-0" />
        <span className="text-[13px] font-semibold text-text-primary">
          Atenção necessária
        </span>
        <span className="ml-auto text-[11px] text-text-disabled tabular-nums">
          {criticos.length} projeto{criticos.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="divide-y divide-[#F0F2F5]">
        {criticos.map((p) => {
          const cfg = SEM_CFG[p.semaforo as "vermelho" | "amarelo"];
          return (
            <Link
              key={p.id}
              href={`/projetos/${p.id}`}
              className="flex items-center gap-4 px-5 py-3 hover:bg-[#F8FAFB] transition-colors group"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: cfg.dot }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary truncate group-hover:text-brand-700 transition-colors">
                  {p.nome}
                </p>
                <p className="text-[11.5px] text-text-disabled mt-0.5">
                  {p.cliente?.nome ?? "—"}
                </p>
              </div>
              <span
                className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-md border ${cfg.badge}`}
              >
                {cfg.label}
              </span>
              <span className="shrink-0 text-[12px] font-mono font-semibold text-text-secondary tabular-nums w-9 text-right">
                {p.percentual_concluido}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
