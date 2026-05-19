import Link from "next/link";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { Projeto } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  planejamento:  "Planejamento",
  execucao:      "Execução",
  monitoramento: "Monitoramento",
  encerrado:     "Encerrado",
  suspenso:      "Suspenso",
};

const SEM_CLS = {
  vermelho: { dot: "bg-status-red",    badge: "bg-red-50 text-status-red border-red-200",    label: "Crítico"  },
  amarelo:  { dot: "bg-status-yellow", badge: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Atenção"  },
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
    <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-surface-border">
        <IconAlertTriangle size={16} className="text-status-yellow" />
        <span className="text-sm font-semibold text-text-primary">
          Projetos que precisam de atenção
        </span>
        <span className="ml-auto text-xs text-text-disabled">{criticos.length} projeto{criticos.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="divide-y divide-surface-border">
        {criticos.map((p) => {
          const cfg = SEM_CLS[p.semaforo as "vermelho" | "amarelo"];
          return (
            <Link
              key={p.id}
              href={`/projetos/${p.id}`}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-input/40 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{p.nome}</p>
                <p className="text-xs text-text-secondary">
                  {p.cliente?.nome ?? "—"} · {STATUS_LABEL[p.status]}
                </p>
              </div>
              <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                {cfg.label}
              </span>
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-text-primary">{p.percentual_concluido}%</p>
                <p className="text-xs text-text-disabled">concluído</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
