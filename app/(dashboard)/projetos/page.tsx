import Link from "next/link";
import { IconPlus, IconFolders, IconActivity, IconCurrencyDollar, IconChartBar, IconAlertTriangle } from "@tabler/icons-react";
import { getProjetos } from "@/app/actions/projetos";
import { ProjetosGrid } from "@/components/projetos/projetos-grid";
import { SemaforoChart } from "@/components/dashboard/semaforo-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { Alertas } from "@/components/dashboard/alertas";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(value);
}

export default async function ProjetosPage() {
  const projetos = await getProjetos();
  const temProjetos = projetos.length > 0;

  const total      = projetos.length;
  const emExecucao = projetos.filter((p) => p.status === "execucao").length;
  const valorTotal = projetos.reduce((s, p) => s + (p.valor_contrato ?? 0), 0);
  const mediaConc  = total > 0
    ? Math.round(projetos.reduce((s, p) => s + p.percentual_concluido, 0) / total)
    : 0;
  const criticos   = projetos.filter((p) => p.semaforo === "vermelho").length;

  return (
    <div className="flex flex-col h-full">
      {/* Header compacto */}
      <div className="bg-white border-b border-surface-border shrink-0">
        <div className="h-[3px] bg-brand-gradient" />
        <div className="flex items-center justify-between px-6 h-11">
          <h1 className="text-[14px] font-semibold text-text-primary">Carteira de Projetos</h1>
          <Link
            href="/projetos/novo"
            className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-700 text-white text-[12px] font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            <IconPlus size={13} />
            Novo projeto
          </Link>
        </div>

        {/* KPI strip */}
        {temProjetos && (
          <div className="flex items-stretch divide-x divide-surface-border border-t border-surface-border">
            <div className="flex items-center gap-2.5 px-5 py-3">
              <IconFolders size={15} className="text-text-disabled shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider leading-none mb-0.5">Projetos</p>
                <p className="text-[20px] font-bold text-text-primary leading-none">{total}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3">
              <IconActivity size={15} className="text-brand-500 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider leading-none mb-0.5">Em execução</p>
                <p className="text-[20px] font-bold text-brand-600 leading-none">{emExecucao}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3">
              <IconCurrencyDollar size={15} className="text-text-disabled shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider leading-none mb-0.5">Valor total</p>
                <p className="text-[20px] font-bold text-text-primary leading-none">{valorTotal > 0 ? formatCurrency(valorTotal) : "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-3">
              <IconChartBar size={15} className="text-text-disabled shrink-0" />
              <div>
                <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider leading-none mb-0.5">Conclusão média</p>
                <p className={`text-[20px] font-bold leading-none ${mediaConc >= 70 ? "text-green-600" : mediaConc >= 30 ? "text-amber-500" : "text-text-primary"}`}>{mediaConc}%</p>
              </div>
            </div>
            {criticos > 0 && (
              <div className="flex items-center gap-2.5 px-5 py-3">
                <IconAlertTriangle size={15} className="text-red-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider leading-none mb-0.5">Críticos</p>
                  <p className="text-[20px] font-bold text-red-600 leading-none">{criticos}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Alertas */}
          {temProjetos && <Alertas projetos={projetos} />}

          {/* Lista de projetos */}
          <ProjetosGrid projetos={projetos} />

          {/* Gráficos — seção secundária */}
          {temProjetos && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-surface-border rounded-xl p-4">
                <p className="text-[11px] font-semibold text-text-disabled uppercase tracking-wider mb-3">
                  Saúde da carteira
                </p>
                <SemaforoChart projetos={projetos} />
              </div>
              <div className="bg-white border border-surface-border rounded-xl p-4">
                <p className="text-[11px] font-semibold text-text-disabled uppercase tracking-wider mb-3">
                  Projetos por status
                </p>
                <StatusChart projetos={projetos} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
