import {
  IconBriefcase,
  IconRocket,
  IconCurrencyReal,
  IconTrendingUp,
} from "@tabler/icons-react";
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

interface CardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  progress?: number;
  progressColor?: string;
}

function KpiCard({ label, value, sub, icon: Icon, iconBg, iconColor, progress, progressColor }: CardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E9EBF0] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <p className="text-[12.5px] font-medium text-text-secondary leading-tight">{label}</p>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={15} className={iconColor} />
        </div>
      </div>
      <div>
        <p className="text-[28px] font-bold text-text-primary tabular-nums leading-none mb-1">
          {value}
        </p>
        <p className="text-[12px] text-text-disabled">{sub}</p>
      </div>
      {progress !== undefined && (
        <div className="h-[3px] bg-surface-input rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function KpiCards({ projetos }: KpiCardsProps) {
  const total      = projetos.length;
  const emExecucao = projetos.filter((p) => p.status === "execucao").length;
  const valorTotal = projetos.reduce((s, p) => s + (p.valor_contrato ?? 0), 0);
  const mediaConc  = total > 0
    ? Math.round(projetos.reduce((s, p) => s + p.percentual_concluido, 0) / total)
    : 0;

  const concProgressColor =
    mediaConc >= 70 ? "bg-green-500" :
    mediaConc >= 40 ? "bg-amber-500" :
    "bg-red-500";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total na Carteira"
        value={String(total)}
        sub="projetos cadastrados"
        icon={IconBriefcase}
        iconBg="bg-navy-700/8"
        iconColor="text-navy-700"
      />
      <KpiCard
        label="Em Execução"
        value={String(emExecucao)}
        sub={total > 0 ? `${Math.round((emExecucao / total) * 100)}% da carteira` : "nenhum"}
        icon={IconRocket}
        iconBg="bg-brand-50"
        iconColor="text-brand-500"
      />
      <KpiCard
        label="Valor Contratado"
        value={valorTotal > 0 ? formatCurrency(valorTotal) : "—"}
        sub="soma dos contratos"
        icon={IconCurrencyReal}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      />
      <KpiCard
        label="Conclusão Média"
        value={`${mediaConc}%`}
        sub="média da carteira"
        icon={IconTrendingUp}
        iconBg={
          mediaConc >= 70 ? "bg-green-50" :
          mediaConc >= 40 ? "bg-amber-50" :
          "bg-red-50"
        }
        iconColor={
          mediaConc >= 70 ? "text-green-600" :
          mediaConc >= 40 ? "text-amber-600" :
          "text-red-600"
        }
        progress={mediaConc}
        progressColor={concProgressColor}
      />
    </div>
  );
}
