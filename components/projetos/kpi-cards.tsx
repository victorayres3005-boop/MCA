import type { Projeto } from "@/lib/types";

interface KpiCardsProps {
  projetos: Projeto[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function KpiCards({ projetos }: KpiCardsProps) {
  const total      = projetos.length;
  const emExecucao = projetos.filter((p) => p.status === "execucao").length;
  const encerrados = projetos.filter((p) => p.status === "encerrado").length;
  const valorTotal = projetos.reduce((acc, p) => acc + (p.valor_contrato ?? 0), 0);

  const cards = [
    { label: "Total na carteira", value: String(total),              sub: "projetos" },
    { label: "Em execução",        value: String(emExecucao),         sub: "projetos ativos" },
    { label: "Concluídos",         value: String(encerrados),         sub: "projetos encerrados" },
    { label: "Valor total",        value: valorTotal > 0 ? formatCurrency(valorTotal) : "—", sub: "contratos" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="bg-white border border-surface-border rounded-xl p-5">
          <p className="text-xs font-medium text-text-disabled uppercase tracking-wide mb-2">
            {card.label}
          </p>
          <p className="text-3xl font-bold text-text-primary tabular-nums">{card.value}</p>
          <p className="text-xs text-text-secondary mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
