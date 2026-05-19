import Link from "next/link";
import { IconPlus, IconAlertTriangle } from "@tabler/icons-react";
import { getProjetos } from "@/app/actions/projetos";
import { ProjetosGrid } from "@/components/projetos/projetos-grid";
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

  const total          = projetos.length;
  const emExecucao     = projetos.filter((p) => p.status === "execucao").length;
  const emPlanejamento = projetos.filter((p) => p.status === "planejamento").length;
  const valorTotal     = projetos.reduce((s, p) => s + (p.valor_contrato ?? 0), 0);
  const mediaConc      = total > 0
    ? Math.round(projetos.reduce((s, p) => s + p.percentual_concluido, 0) / total)
    : 0;

  const verde    = projetos.filter((p) => p.semaforo === "verde").length;
  const amarelo  = projetos.filter((p) => p.semaforo === "amarelo").length;
  const vermelho = projetos.filter((p) => p.semaforo === "vermelho").length;

  const concCls = mediaConc >= 70 ? "text-green-400"
    : mediaConc >= 30 ? "text-amber-400"
    : "text-red-400";
  const concBar = mediaConc >= 70 ? "bg-green-400"
    : mediaConc >= 30 ? "bg-amber-400"
    : "bg-red-400";

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div
        className="shrink-0 print:hidden"
        style={{ background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 40%, #0A7B72 75%, #00B4A6 100%)" }}
      >
        {/* Título + ação */}
        <div className="flex items-start justify-between px-8 pt-6 pb-0">
          <div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1.5">
              MCA Engenharia
            </p>
            <h1 className="text-[22px] font-bold text-white tracking-tight leading-none">
              Carteira de Obras
            </h1>
          </div>
          <Link
            href="/projetos/novo"
            className="inline-flex items-center gap-1.5 text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-white/20 mt-0.5"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <IconPlus size={13} />
            Novo projeto
          </Link>
        </div>

        {/* ── Painel de métricas: 60/40 assimétrico ── */}
        {temProjetos && (
          <div className="flex gap-8 px-8 pt-5 pb-6">

            {/* DOMINANTE (60%) — Saúde da carteira */}
            <div className="flex-[3] min-w-0">
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">
                Saúde da carteira
              </p>

              {/* Barras proporcionais: cor + label + barra + número */}
              <div className="space-y-2.5">
                {/* Verde */}
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  <span className={`text-[10px] w-[4.5rem] shrink-0 ${verde > 0 ? "text-green-400" : "text-white/20"}`}>
                    Saudável
                  </span>
                  <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full bg-green-400/70 transition-all"
                      style={{ width: `${(verde / total) * 100}%` }}
                    />
                  </div>
                  <span className={`text-[14px] font-mono font-bold w-5 text-right tabular-nums ${verde > 0 ? "text-green-400" : "text-white/20"}`}>
                    {verde}
                  </span>
                </div>

                {/* Amarelo */}
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span className={`text-[10px] w-[4.5rem] shrink-0 ${amarelo > 0 ? "text-amber-400" : "text-white/20"}`}>
                    Em atenção
                  </span>
                  <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full bg-amber-400/70 transition-all"
                      style={{ width: `${(amarelo / total) * 100}%` }}
                    />
                  </div>
                  <span className={`text-[14px] font-mono font-bold w-5 text-right tabular-nums ${amarelo > 0 ? "text-amber-400" : "text-white/20"}`}>
                    {amarelo}
                  </span>
                </div>

                {/* Vermelho */}
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span className={`text-[10px] w-[4.5rem] shrink-0 ${vermelho > 0 ? "text-red-400" : "text-white/20"}`}>
                    Crítico
                  </span>
                  <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-full rounded-full bg-red-400/70 transition-all"
                      style={{ width: `${(vermelho / total) * 100}%` }}
                    />
                  </div>
                  <span className={`text-[14px] font-mono font-bold w-5 text-right tabular-nums ${vermelho > 0 ? "text-red-400" : "text-white/20"}`}>
                    {vermelho}
                  </span>
                </div>
              </div>

              {/* Total como âncora */}
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-[42px] font-mono font-black text-white leading-none tabular-nums">{total}</span>
                <span className="text-[11px] text-white/40">
                  projeto{total !== 1 ? "s" : ""} na carteira
                </span>
              </div>
            </div>

            {/* Divisor */}
            <div className="self-stretch w-px shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />

            {/* SECUNDÁRIO (40%) — 3 KPIs empilhados */}
            <div className="flex-[2] flex flex-col justify-between py-0.5 min-w-0">

              {/* Em execução */}
              <div>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
                  Em execução
                </p>
                <p className="text-[30px] font-mono font-black text-white leading-none tabular-nums">
                  {emExecucao}
                </p>
                {emPlanejamento > 0 && (
                  <p className="text-[9px] text-amber-300/60 mt-1">{emPlanejamento} em planejamento</p>
                )}
              </div>

              {/* Valor contratado */}
              <div>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
                  Valor contratado
                </p>
                <p className="text-[22px] font-mono font-black text-white leading-none tabular-nums">
                  {valorTotal > 0 ? formatCurrency(valorTotal) : "—"}
                </p>
              </div>

              {/* Conclusão média */}
              <div>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">
                  Conclusão média
                </p>
                <p className={`text-[30px] font-mono font-black leading-none tabular-nums ${concCls}`}>
                  {mediaConc}%
                </p>
                <div className="mt-1.5 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className={`h-full rounded-full ${concBar}`} style={{ width: `${mediaConc}%` }} />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── Alerta de críticos ── */}
      {vermelho > 0 && (
        <div className="shrink-0 flex items-center gap-2 px-6 py-2 bg-red-50 border-b border-red-100 print:hidden">
          <IconAlertTriangle size={13} className="text-red-500 shrink-0" />
          <p className="text-[11px] text-red-700 font-medium">
            {vermelho === 1
              ? "1 projeto crítico requer atenção imediata"
              : `${vermelho} projetos críticos requerem atenção imediata`}
          </p>
        </div>
      )}

      {/* ── Conteúdo ── */}
      <div className="flex-1 overflow-y-auto bg-surface-page">
        <div className="p-5 space-y-4">
          {temProjetos && <Alertas projetos={projetos} />}

          <ProjetosGrid projetos={projetos} />

          {temProjetos && (
            <div className="bg-white border border-surface-border rounded-xl p-4">
              <p className="text-[11px] font-semibold text-text-disabled uppercase tracking-wider mb-3">
                Projetos por status
              </p>
              <StatusChart projetos={projetos} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
