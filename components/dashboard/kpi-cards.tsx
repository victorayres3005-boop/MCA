import { IconBriefcase, IconRocket, IconCurrencyReal, IconTrendingUp } from "@tabler/icons-react";
import type { Projeto } from "@/lib/types";

interface KpiCardsProps {
  projetos: Projeto[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(value);
}

export function KpiCards({ projetos }: KpiCardsProps) {
  const total      = projetos.length;
  const emExecucao = projetos.filter((p) => p.status === "execucao").length;
  const valorTotal = projetos.reduce((s, p) => s + (p.valor_contrato ?? 0), 0);
  const mediaConc  = total > 0
    ? Math.round(projetos.reduce((s, p) => s + p.percentual_concluido, 0) / total)
    : 0;

  const cards = [
    {
      label:   "Total na carteira",
      value:   String(total),
      sub:     "projetos cadastrados",
      icon:    IconBriefcase,
      accent:  "border-l-navy-700 bg-navy-700/5",
      iconCls: "text-navy-700",
    },
    {
      label:   "Em execução",
      value:   String(emExecucao),
      sub:     total > 0 ? `${Math.round((emExecucao / total) * 100)}% da carteira` : "—",
      icon:    IconRocket,
      accent:  "border-l-brand-500 bg-brand-500/5",
      iconCls: "text-brand-500",
    },
    {
      label:   "Valor total",
      value:   valorTotal > 0 ? formatCurrency(valorTotal) : "—",
      sub:     "contratos ativos",
      icon:    IconCurrencyReal,
      accent:  "border-l-blue-500 bg-blue-500/5",
      iconCls: "text-blue-500",
    },
    {
      label:    "Conclusão média",
      value:    `${mediaConc}%`,
      sub:      "média da carteira",
      icon:     IconTrendingUp,
      accent:   mediaConc >= 70 ? "border-l-green-500 bg-green-500/5"
                : mediaConc >= 40 ? "border-l-amber-500 bg-amber-500/5"
                : "border-l-red-500 bg-red-500/5",
      iconCls:  mediaConc >= 70 ? "text-green-500" : mediaConc >= 40 ? "text-amber-500" : "text-red-500",
      progress: mediaConc,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-white border border-surface-border border-l-4 ${card.accent} rounded-xl p-5 flex flex-col gap-3`}
          >
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold text-text-disabled uppercase tracking-wider leading-none">
                {card.label}
              </p>
              <div className={`p-1.5 rounded-lg ${card.accent}`}>
                <Icon size={15} className={card.iconCls} />
              </div>
            </div>

            <div>
              <p className="text-3xl font-bold text-text-primary tabular-nums leading-none mb-1">
                {card.value}
              </p>
              <p className="text-xs text-text-secondary">{card.sub}</p>
            </div>

            {"progress" in card && card.progress !== undefined && (
              <div className="h-1 bg-surface-input rounded-full overflow-hidden mt-auto">
                <div
                  className={`h-full rounded-full transition-all ${card.iconCls.replace("text-", "bg-")}`}
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
