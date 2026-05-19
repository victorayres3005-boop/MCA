"use client";

import { useState } from "react";
import Image from "next/image";
import { IconPrinter } from "@tabler/icons-react";
import type { Projeto, Marco, OrcamentoItem, Risco, Comunicacao, ParteInteressada, Mudanca, Aquisicao } from "@/lib/types";
import { CurvaS, type CurvaSPoint } from "@/components/charts/curva-s";

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}
function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function fmtDateLong(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
function nivelRisco(p: number, i: number): "alto" | "medio" | "baixo" {
  const s = p * i;
  return s >= 15 ? "alto" : s >= 6 ? "medio" : "baixo";
}

function buildCurvaSCronograma(marcos: Marco[], projeto: Projeto): { data: CurvaSPoint[]; hojeIndex: number } {
  if (marcos.length === 0) return { data: [], hojeIndex: 0 };
  const hoje = new Date();
  const todayMth = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const prevDates = marcos.map((m) => new Date(m.data_prevista + "T00:00:00"));
  const inicioDate = projeto.data_inicio
    ? new Date(projeto.data_inicio + "T00:00:00")
    : new Date(Math.min(...prevDates.map((d) => d.getTime())));
  const fimDate = projeto.data_fim_prevista
    ? new Date(projeto.data_fim_prevista + "T00:00:00")
    : new Date(Math.max(...prevDates.map((d) => d.getTime())));
  const rangeEnd = fimDate > hoje ? fimDate : hoje;
  const total = marcos.length;
  const points: CurvaSPoint[] = [];
  const cursor = new Date(inicioDate.getFullYear(), inicioDate.getMonth(), 1);
  const endMth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);
  let hojeIndex = 0;
  let idx = 0;
  while (cursor <= endMth) {
    const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59);
    const isFuture = cursor > todayMth;
    const previsto = marcos.filter((m) => new Date(m.data_prevista + "T00:00:00") <= monthEnd).length;
    const realizados = isFuture ? null : marcos.filter(
      (m) => m.status === "concluido" && m.data_real && new Date(m.data_real + "T00:00:00") <= monthEnd
    ).length;
    if (cursor.getTime() === todayMth.getTime()) hojeIndex = idx;
    points.push({
      mes: cursor.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      previsto: Math.round((previsto / total) * 100),
      realizado: realizados !== null ? Math.round((realizados / total) * 100) : null,
    });
    cursor.setMonth(cursor.getMonth() + 1);
    idx++;
  }
  return { data: points, hojeIndex };
}

function buildCurvaSCustos(aquisicoes: Aquisicao[], projeto: Projeto): { data: CurvaSPoint[]; hojeIndex: number } {
  const todasMedicoes = aquisicoes.flatMap((a) => a.medicoes ?? []);
  const comDatas = aquisicoes.filter((a) => a.data_inicio || a.data_fim_prevista);
  if (comDatas.length === 0 && todasMedicoes.length === 0) return { data: [], hojeIndex: 0 };
  const hoje = new Date();
  const todayMth = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const projInicio = projeto.data_inicio ? new Date(projeto.data_inicio + "T00:00:00") : null;
  const projFim = projeto.data_fim_prevista ? new Date(projeto.data_fim_prevista + "T00:00:00") : null;
  const medicoesByMonth: Record<string, number> = {};
  for (const med of todasMedicoes) {
    medicoesByMonth[med.competencia] = (medicoesByMonth[med.competencia] ?? 0) + med.valor;
  }
  const planeadoByMonth: Record<string, number> = {};
  for (const aq of aquisicoes) {
    const start = aq.data_inicio ? new Date(aq.data_inicio + "T00:00:00") : projInicio ?? hoje;
    const end = aq.data_fim_prevista ? new Date(aq.data_fim_prevista + "T00:00:00") : projFim ?? hoje;
    const months: string[] = [];
    const c = new Date(start.getFullYear(), start.getMonth(), 1);
    const e = new Date(end.getFullYear(), end.getMonth(), 1);
    while (c <= e) {
      months.push(`${c.getFullYear()}-${String(c.getMonth() + 1).padStart(2, "0")}`);
      c.setMonth(c.getMonth() + 1);
    }
    if (months.length === 0) continue;
    const perMonth = aq.valor_contrato / months.length;
    for (const m of months) planeadoByMonth[m] = (planeadoByMonth[m] ?? 0) + perMonth;
  }
  const allDates: Date[] = [hoje];
  if (projInicio) allDates.push(projInicio);
  if (projFim) allDates.push(projFim);
  for (const ym of Object.keys(medicoesByMonth)) allDates.push(new Date(ym + "-01T00:00:00"));
  for (const aq of aquisicoes) {
    if (aq.data_inicio) allDates.push(new Date(aq.data_inicio + "T00:00:00"));
    if (aq.data_fim_prevista) allDates.push(new Date(aq.data_fim_prevista + "T00:00:00"));
  }
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const rangeEnd = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  const points: CurvaSPoint[] = [];
  let cumPrevisto = 0;
  let cumRealizado = 0;
  let hojeIndex = 0;
  let idx = 0;
  while (cursor <= rangeEnd) {
    const ym = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
    const isFuture = cursor > todayMth;
    cumPrevisto += planeadoByMonth[ym] ?? 0;
    if (!isFuture) cumRealizado += medicoesByMonth[ym] ?? 0;
    if (cursor.getTime() === todayMth.getTime()) hojeIndex = idx;
    points.push({
      mes: cursor.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }),
      previsto: Math.round(cumPrevisto),
      realizado: isFuture ? null : Math.round(cumRealizado),
    });
    cursor.setMonth(cursor.getMonth() + 1);
    idx++;
  }
  return { data: points, hojeIndex };
}

// ── constants ─────────────────────────────────────────────────────────────────

const STATUS_PROJETO: Record<Projeto["status"], string> = {
  planejamento: "Planejamento", execucao: "Execução",
  monitoramento: "Monitoramento", encerrado: "Encerrado", suspenso: "Suspenso",
};
const SEMAFORO_LABEL: Record<Projeto["semaforo"], string> = {
  verde: "No prazo", amarelo: "Em atenção", vermelho: "Em risco",
};
const SEMAFORO_CLS: Record<Projeto["semaforo"], string> = {
  verde:    "bg-green-100 text-green-800 border-green-200",
  amarelo:  "bg-amber-100 text-amber-800 border-amber-200",
  vermelho: "bg-red-100 text-red-800 border-red-200",
};
const NIVEL_RISCO: Record<string, { label: string; cls: string }> = {
  alto:  { label: "Alto",  cls: "bg-red-100 text-red-800 border-red-200"      },
  medio: { label: "Médio", cls: "bg-amber-100 text-amber-800 border-amber-200" },
  baixo: { label: "Baixo", cls: "bg-green-100 text-green-800 border-green-200" },
};
const STATUS_MARCO: Record<Marco["status"], string> = {
  pendente: "Pendente", concluido: "Concluído", cancelado: "Cancelado",
};
const CAT_LABEL: Record<string, string> = {
  material: "Material", mao_de_obra: "Mão de obra",
  equipamento: "Equipamento", servico: "Serviço", outro: "Outro",
};
const STATUS_MUDANCA: Record<string, string> = {
  rascunho: "Rascunho", em_analise: "Em análise",
  aprovada: "Aprovada", rejeitada: "Rejeitada", implementada: "Implementada",
};
const STATUS_MUDANCA_CLS: Record<string, string> = {
  rascunho:     "bg-gray-100 text-gray-500 border-gray-200",
  em_analise:   "bg-blue-50 text-blue-700 border-blue-100",
  aprovada:     "bg-green-50 text-green-700 border-green-200",
  rejeitada:    "bg-red-50 text-red-700 border-red-100",
  implementada: "bg-teal-50 text-teal-700 border-teal-200",
};
const STATUS_AQUISICAO: Record<string, string> = {
  planejado: "Planejado", ativo: "Ativo", suspenso: "Suspenso", encerrado: "Encerrado",
};
const STATUS_AQUISICAO_CLS: Record<string, string> = {
  planejado: "bg-gray-100 text-gray-500 border-gray-200",
  ativo:     "bg-green-50 text-green-700 border-green-200",
  suspenso:  "bg-amber-50 text-amber-700 border-amber-100",
  encerrado: "bg-blue-50 text-blue-700 border-blue-100",
};
const FREQ_LABEL: Record<string, string> = {
  diaria: "Diária", semanal: "Semanal", quinzenal: "Quinzenal",
  mensal: "Mensal", bimestral: "Bimestral", trimestral: "Trimestral",
  sob_demanda: "Sob demanda",
};
const ENGAJ_LABEL: Record<string, string> = {
  desconhecido: "Desconhecido", resistente: "Resistente",
  neutro: "Neutro", apoiador: "Apoiador", lider: "Líder",
};

// ── sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="print:break-inside-avoid-page">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-[13px] font-bold text-navy-700 uppercase tracking-widest">{title}</h2>
        <div className="flex-1 h-px bg-surface-border" />
      </div>
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub, cls }: { label: string; value: string; sub?: string; cls?: string }) {
  return (
    <div className={`flex-1 border rounded-lg px-4 py-3 ${cls ?? "border-surface-border bg-white"}`}>
      <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">{label}</p>
      <p className="text-[22px] font-bold text-text-primary leading-none">{value}</p>
      {sub && <p className="text-[11px] text-text-disabled mt-1">{sub}</p>}
    </div>
  );
}

// ── section selector ──────────────────────────────────────────────────────────

type SectionKey = "cronograma" | "custos" | "riscos" | "partes" | "comunicacao" | "mudancas" | "aquisicoes";

const ALL_SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "cronograma",  label: "Cronograma"  },
  { key: "custos",      label: "Custos"       },
  { key: "riscos",      label: "Riscos"       },
  { key: "partes",      label: "Stakeholders" },
  { key: "comunicacao", label: "Comunicação"  },
  { key: "mudancas",    label: "Mudanças"     },
  { key: "aquisicoes",  label: "Aquisições"   },
];

// ── props ─────────────────────────────────────────────────────────────────────

interface Props {
  projeto:       Projeto;
  marcos:        Marco[];
  orcamento:     OrcamentoItem[];
  riscos:        Risco[];
  comunicacoes:  Comunicacao[];
  partes:        ParteInteressada[];
  mudancas:      Mudanca[];
  aquisicoes:    Aquisicao[];
  dataGeracao:   string;
}

// ── main component ────────────────────────────────────────────────────────────

export function RelatorioDoc({ projeto, marcos, orcamento, riscos, comunicacoes, partes, mudancas, aquisicoes, dataGeracao }: Props) {
  const [visible, setVisible] = useState<Record<SectionKey, boolean>>({
    cronograma:  true,
    custos:      true,
    riscos:      true,
    partes:      partes.length > 0,
    comunicacao: comunicacoes.length > 0,
    mudancas:    mudancas.length > 0,
    aquisicoes:  aquisicoes.length > 0,
  });

  function toggle(key: SectionKey) {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // ── computed ────────────────────────────────────────────────────────────────

  const hoje = new Date();

  const totalPlanejado = orcamento.reduce((s, c) => s + c.valor_planejado, 0);
  const totalRealizado = orcamento.reduce((s, c) => s + c.valor_realizado, 0);
  const variacaoPct    = totalPlanejado > 0 ? ((totalRealizado - totalPlanejado) / totalPlanejado) * 100 : 0;
  const cpi            = totalRealizado > 0 ? totalPlanejado / totalRealizado : null;

  const custosPorCategoria = (["material", "mao_de_obra", "equipamento", "servico", "outro"] as const)
    .map((cat) => {
      const itens = orcamento.filter((c) => c.categoria === cat);
      return { cat, itens, planejado: itens.reduce((s, c) => s + c.valor_planejado, 0), realizado: itens.reduce((s, c) => s + c.valor_realizado, 0) };
    })
    .filter((g) => g.itens.length > 0);

  const marcosConcluidos = marcos.filter((m) => m.status === "concluido");
  const marcosAtrasados  = marcos.filter((m) => m.status === "pendente" && new Date(m.data_prevista + "T00:00:00") < hoje);
  const riscosAtivos     = riscos.filter((r) => r.status !== "encerrado" && r.status !== "mitigado");
  const riscosAlto       = riscosAtivos.filter((r) => nivelRisco(r.probabilidade, r.impacto) === "alto").length;
  const semCusto: Projeto["semaforo"] = Math.abs(variacaoPct) < 5 ? "verde" : Math.abs(variacaoPct) < 15 ? "amarelo" : "vermelho";

  const { data: curvaSCronograma, hojeIndex: hojeIdxCronograma } = buildCurvaSCronograma(marcos, projeto);
  const { data: curvaSCustos,     hojeIndex: hojeIdxCustos     } = buildCurvaSCustos(aquisicoes, projeto);

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-full bg-surface-page print:bg-white">

      {/* Barra de ações — oculta ao imprimir */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-surface-border px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="shrink-0">
          <p className="text-[13px] font-semibold text-text-primary">Relatório Gerencial</p>
          <p className="text-[11px] text-text-disabled">Gerado em {dataGeracao}</p>
        </div>

        {/* Chips de seção */}
        <div className="flex items-center gap-1.5 flex-1 flex-wrap">
          {ALL_SECTIONS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                visible[key]
                  ? "bg-brand-50 border-brand-200 text-brand-700"
                  : "bg-white border-surface-border text-text-disabled line-through opacity-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="shrink-0 flex items-center gap-2 px-4 py-1.5 bg-navy-700 hover:bg-navy-800 text-white text-[12px] font-medium rounded-md transition-colors"
        >
          <IconPrinter size={14} />
          Imprimir / Baixar PDF
        </button>
      </div>

      {/* Documento — preview + impressão */}
      <div className="max-w-4xl mx-auto px-6 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="bg-white rounded-xl shadow-sm border border-surface-border overflow-hidden print:shadow-none print:border-none print:rounded-none">

          {/* Capa */}
          <div className="px-8 py-7 text-white"
            style={{ background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 45%, #0A7B72 80%, #00B4A6 100%)" }}>
            <div className="flex items-start justify-between">
              <div>
                <Image
                  src="/logo-mca.png"
                  alt="MCA"
                  height={22}
                  width={90}
                  style={{ objectFit: "contain", objectPosition: "left center", filter: "brightness(0) invert(1)" }}
                  className="mb-2"
                />
                <h1 className="text-[22px] font-bold leading-tight">{projeto.nome}</h1>
                {projeto.codigo && <p className="text-[12px] font-mono text-white/70 mt-0.5">{projeto.codigo}</p>}
              </div>
              <div className="text-right text-[11px] text-white/70 space-y-0.5 shrink-0 ml-8">
                {projeto.cliente?.nome && <p>Cliente: <span className="text-white font-medium">{projeto.cliente.nome}</span></p>}
                <p>Status: <span className="text-white font-medium">{STATUS_PROJETO[projeto.status]}</span></p>
                {projeto.data_fim_prevista && (
                  <p>Prazo: <span className="text-white font-medium">{fmtDateLong(projeto.data_fim_prevista)}</span></p>
                )}
                <p className="mt-2 text-white/50">Gerado em {dataGeracao}</p>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="px-8 py-7 space-y-8">

            {/* Resumo Executivo — sempre visível */}
            <Section title="Resumo Executivo">
              <div className="flex gap-3">
                <KpiCard label="Conclusão"     value={`${projeto.percentual_concluido}%`} sub="do projeto concluído"
                  cls={`border ${SEMAFORO_CLS[projeto.semaforo]}`} />
                <KpiCard label="Saúde Geral"   value={SEMAFORO_LABEL[projeto.semaforo]}
                  sub={projeto.data_fim_prevista ? `Prazo: ${fmtDate(projeto.data_fim_prevista)}` : "Sem prazo definido"}
                  cls={`border ${SEMAFORO_CLS[projeto.semaforo]}`} />
                <KpiCard label="Orçamento"     value={totalPlanejado > 0 ? fmt(totalPlanejado) : "—"}
                  sub={totalRealizado > 0 ? `Realizado: ${fmt(totalRealizado)}` : "Sem medições"}
                  cls={`border ${totalPlanejado > 0 ? SEMAFORO_CLS[semCusto] : "border-surface-border bg-white"}`} />
                <KpiCard label="Riscos Ativos" value={`${riscosAtivos.length}`}
                  sub={riscosAlto > 0 ? `${riscosAlto} de alto impacto` : "Nenhum risco alto"}
                  cls={`border ${riscosAlto > 0 ? SEMAFORO_CLS["vermelho"] : riscosAtivos.length > 0 ? SEMAFORO_CLS["amarelo"] : SEMAFORO_CLS["verde"]}`} />
              </div>
            </Section>

            {/* Cronograma */}
            {visible.cronograma && (
              <Section title="Cronograma — Marcos">
                <div className="flex items-center gap-6 mb-3 text-[12px]">
                  <span><span className="font-semibold text-text-primary">{marcos.length}</span> <span className="text-text-disabled">marcos</span></span>
                  <span><span className="font-semibold text-green-600">{marcosConcluidos.length}</span> <span className="text-text-disabled">concluídos</span></span>
                  <span><span className={`font-semibold ${marcosAtrasados.length > 0 ? "text-red-600" : "text-text-primary"}`}>{marcosAtrasados.length}</span> <span className="text-text-disabled">atrasados</span></span>
                </div>
                {curvaSCronograma.length >= 2 && (
                  <div className="mb-4 border border-surface-border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-surface-border bg-surface-page/40">
                      <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Curva S — Progresso Acumulado de Marcos</span>
                      <span className="ml-auto text-[11px] text-text-disabled">% acumulado</span>
                    </div>
                    <div className="px-3 py-2">
                      <CurvaS data={curvaSCronograma} hojeIndex={hojeIdxCronograma} unit="%" height={180} />
                    </div>
                  </div>
                )}
                {marcos.length === 0 ? (
                  <p className="text-[12px] text-text-disabled italic">Nenhum marco cadastrado.</p>
                ) : (
                  <table className="w-full text-[12px] border-collapse">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Marco</th>
                        <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Responsável</th>
                        <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Prazo</th>
                        <th className="text-left py-1.5 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {marcos.map((m) => {
                        const atrasado = m.status === "pendente" && new Date(m.data_prevista + "T00:00:00") < hoje;
                        return (
                          <tr key={m.id}>
                            <td className="py-2 pr-4 font-medium text-text-primary">{m.nome}</td>
                            <td className="py-2 pr-4 text-text-secondary">{m.responsavel ?? "—"}</td>
                            <td className={`py-2 pr-4 ${atrasado ? "text-red-600 font-medium" : "text-text-secondary"}`}>
                              {fmtDate(m.data_prevista)}{atrasado && " ⚠"}
                            </td>
                            <td className="py-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                                m.status === "concluido" ? "bg-green-50 text-green-700 border-green-100"
                                : atrasado ? "bg-red-50 text-red-700 border-red-100"
                                : "bg-surface-input text-text-secondary border-surface-border"
                              }`}>{STATUS_MARCO[m.status]}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </Section>
            )}

            {/* Custos */}
            {visible.custos && (
              <Section title="Custos e Orçamento">
                {orcamento.length === 0 ? (
                  <p className="text-[12px] text-text-disabled italic">Nenhum item de orçamento cadastrado.</p>
                ) : (
                  <>
                    <table className="w-full text-[12px] border-collapse mb-2">
                      <thead>
                        <tr className="border-b border-surface-border">
                          <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Categoria</th>
                          <th className="text-right py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Planejado</th>
                          <th className="text-right py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Realizado</th>
                          <th className="text-right py-1.5 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Variação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-border">
                        {custosPorCategoria.map(({ cat, planejado, realizado }) => {
                          const vr = planejado > 0 ? ((realizado - planejado) / planejado) * 100 : 0;
                          return (
                            <tr key={cat}>
                              <td className="py-2 pr-4 text-text-primary font-medium">{CAT_LABEL[cat]}</td>
                              <td className="py-2 pr-4 text-right text-text-secondary tabular-nums">{fmt(planejado)}</td>
                              <td className="py-2 pr-4 text-right text-text-secondary tabular-nums">{fmt(realizado)}</td>
                              <td className={`py-2 text-right tabular-nums font-medium ${vr > 0 ? "text-red-600" : vr < 0 ? "text-green-600" : "text-text-secondary"}`}>
                                {vr > 0 ? "+" : ""}{vr.toFixed(1)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="border-t-2 border-surface-border">
                        <tr>
                          <td className="py-2 pr-4 font-bold text-text-primary">Total</td>
                          <td className="py-2 pr-4 text-right font-bold text-text-primary tabular-nums">{fmt(totalPlanejado)}</td>
                          <td className="py-2 pr-4 text-right font-bold text-text-primary tabular-nums">{fmt(totalRealizado)}</td>
                          <td className={`py-2 text-right font-bold tabular-nums ${variacaoPct > 0 ? "text-red-600" : variacaoPct < 0 ? "text-green-600" : "text-text-secondary"}`}>
                            {variacaoPct > 0 ? "+" : ""}{variacaoPct.toFixed(1)}%
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    {curvaSCustos.length >= 2 && (
                      <div className="mt-3 border border-surface-border rounded-lg overflow-hidden">
                        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-surface-border bg-surface-page/40">
                          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Curva S — Desembolso Acumulado</span>
                          <span className="ml-auto text-[11px] text-text-disabled">baseline vs medições reais</span>
                        </div>
                        <div className="px-3 py-2">
                          <CurvaS data={curvaSCustos} hojeIndex={hojeIdxCustos} unit="BRL" height={180} />
                        </div>
                      </div>
                    )}
                    {cpi !== null && (
                      <p className="text-[11px] text-text-disabled mt-2">
                        CPI: <span className={`font-semibold ${cpi >= 1 ? "text-green-600" : "text-red-600"}`}>{cpi.toFixed(2)}</span>
                        {" "}— {cpi >= 1 ? "dentro do orçamento" : "acima do orçamento"}
                      </p>
                    )}
                  </>
                )}
              </Section>
            )}

            {/* Riscos */}
            {visible.riscos && (
              <Section title="Registro de Riscos">
                {riscos.length === 0 ? (
                  <p className="text-[12px] text-text-disabled italic">Nenhum risco identificado.</p>
                ) : (
                  <table className="w-full text-[12px] border-collapse">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-8">P×I</th>
                        <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Risco</th>
                        <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-16">Nível</th>
                        <th className="text-left py-1.5 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Plano de resposta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {riscos.map((r) => {
                        const nivel = nivelRisco(r.probabilidade, r.impacto);
                        return (
                          <tr key={r.id}>
                            <td className="py-2 pr-4 tabular-nums font-semibold text-text-primary">{r.probabilidade * r.impacto}</td>
                            <td className="py-2 pr-4 text-text-primary">{r.descricao}</td>
                            <td className="py-2 pr-4">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${NIVEL_RISCO[nivel].cls}`}>
                                {NIVEL_RISCO[nivel].label}
                              </span>
                            </td>
                            <td className="py-2 text-text-secondary">{r.plano_resposta ?? "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </Section>
            )}

            {/* Partes Interessadas */}
            {visible.partes && partes.length > 0 && (
              <Section title="Partes Interessadas">
                <table className="w-full text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Nome</th>
                      <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Papel / Org.</th>
                      <th className="text-center py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-12">Infl.</th>
                      <th className="text-center py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-12">Int.</th>
                      <th className="text-left py-1.5 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Engajamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {partes.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2 pr-4 font-medium text-text-primary">{p.nome}</td>
                        <td className="py-2 pr-4 text-text-secondary">{[p.papel, p.organizacao].filter(Boolean).join(" · ") || "—"}</td>
                        <td className="py-2 pr-4 text-center tabular-nums text-text-primary">{p.influencia}</td>
                        <td className="py-2 pr-4 text-center tabular-nums text-text-primary">{p.interesse}</td>
                        <td className="py-2 text-text-secondary">{ENGAJ_LABEL[p.engajamento_atual]} → {ENGAJ_LABEL[p.engajamento_desejado]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Comunicação */}
            {visible.comunicacao && comunicacoes.length > 0 && (
              <Section title="Matriz de Comunicação">
                <table className="w-full text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Assunto</th>
                      <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Destinatários</th>
                      <th className="text-left py-1.5 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Frequência</th>
                      <th className="text-left py-1.5 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Responsável</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {comunicacoes.map((c) => (
                      <tr key={c.id}>
                        <td className="py-2 pr-4 font-medium text-text-primary">{c.assunto}</td>
                        <td className="py-2 pr-4 text-text-secondary">{c.destinatarios}</td>
                        <td className="py-2 pr-4 text-text-secondary">{FREQ_LABEL[c.frequencia] ?? c.frequencia}</td>
                        <td className="py-2 text-text-secondary">{c.responsavel ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Mudanças */}
            {visible.mudancas && mudancas.length > 0 && (() => {
              const aprovadas    = mudancas.filter((m) => m.status === "aprovada" || m.status === "implementada");
              const pendentes    = mudancas.filter((m) => m.status === "rascunho" || m.status === "em_analise");
              const impactoCusto = aprovadas.reduce((s, m) => s + (m.impacto_custo ?? 0), 0);
              const impactoPrazo = aprovadas.reduce((s, m) => s + (m.impacto_prazo ?? 0), 0);
              return (
                <Section title="Controle de Mudanças">
                  <div className="flex items-center gap-6 mb-3 text-[12px]">
                    <span><span className="font-semibold text-text-primary">{mudancas.length}</span> <span className="text-text-disabled">solicitações</span></span>
                    <span><span className={`font-semibold ${pendentes.length > 0 ? "text-amber-500" : "text-text-primary"}`}>{pendentes.length}</span> <span className="text-text-disabled">pendentes</span></span>
                    <span><span className="font-semibold text-green-600">{aprovadas.length}</span> <span className="text-text-disabled">aprovadas/implementadas</span></span>
                    {impactoCusto !== 0 && <span><span className={`font-semibold ${impactoCusto > 0 ? "text-red-600" : "text-green-600"}`}>{impactoCusto > 0 ? "+" : ""}{fmt(impactoCusto)}</span> <span className="text-text-disabled">impacto custo</span></span>}
                    {impactoPrazo !== 0 && <span><span className={`font-semibold ${impactoPrazo > 0 ? "text-red-600" : "text-green-600"}`}>{impactoPrazo > 0 ? "+" : ""}{impactoPrazo}d</span> <span className="text-text-disabled">impacto prazo</span></span>}
                  </div>
                  <table className="w-full text-[12px] border-collapse">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-16">Nº</th>
                        <th className="text-left py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Mudança</th>
                        <th className="text-left py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Data</th>
                        <th className="text-right py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">± Prazo</th>
                        <th className="text-right py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">± Custo</th>
                        <th className="text-left py-1.5 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {mudancas.map((m) => (
                        <tr key={m.id}>
                          <td className="py-2 pr-3 font-mono text-text-disabled">{m.numero}</td>
                          <td className="py-2 pr-3 text-text-primary font-medium">{m.titulo}</td>
                          <td className="py-2 pr-3 text-text-secondary">{fmtDate(m.data_solicitacao)}</td>
                          <td className={`py-2 pr-3 text-right tabular-nums font-medium ${m.impacto_prazo == null ? "text-text-disabled" : m.impacto_prazo > 0 ? "text-red-600" : "text-green-600"}`}>
                            {m.impacto_prazo != null ? `${m.impacto_prazo > 0 ? "+" : ""}${m.impacto_prazo}d` : "—"}
                          </td>
                          <td className={`py-2 pr-3 text-right tabular-nums font-medium ${m.impacto_custo == null ? "text-text-disabled" : m.impacto_custo > 0 ? "text-red-600" : "text-green-600"}`}>
                            {m.impacto_custo != null ? `${m.impacto_custo > 0 ? "+" : ""}${fmt(m.impacto_custo)}` : "—"}
                          </td>
                          <td className="py-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_MUDANCA_CLS[m.status]}`}>
                              {STATUS_MUDANCA[m.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Section>
              );
            })()}

            {/* Aquisições */}
            {visible.aquisicoes && aquisicoes.length > 0 && (() => {
              const valorTotal  = aquisicoes.reduce((s, a) => s + a.valor_contrato, 0);
              const valorMedido = aquisicoes.reduce((s, a) => s + (a.medicoes?.reduce((sm, m) => sm + m.valor, 0) ?? 0), 0);
              const pctMedido   = valorTotal > 0 ? (valorMedido / valorTotal) * 100 : 0;
              return (
                <Section title="Aquisições e Contratos">
                  <div className="flex items-center gap-6 mb-3 text-[12px]">
                    <span><span className="font-semibold text-text-primary">{aquisicoes.length}</span> <span className="text-text-disabled">contratos</span></span>
                    <span><span className="font-semibold text-text-primary">{fmt(valorTotal)}</span> <span className="text-text-disabled">valor total</span></span>
                    <span><span className="font-semibold text-text-primary">{fmt(valorMedido)}</span> <span className="text-text-disabled">medido ({pctMedido.toFixed(0)}%)</span></span>
                  </div>
                  <table className="w-full text-[12px] border-collapse">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Contrato / Objeto</th>
                        <th className="text-left py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Contratada</th>
                        <th className="text-right py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Valor</th>
                        <th className="text-right py-1.5 pr-3 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Medido</th>
                        <th className="text-left py-1.5 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {aquisicoes.map((a) => {
                        const medido = a.medicoes?.reduce((s, m) => s + m.valor, 0) ?? 0;
                        const pct    = a.valor_contrato > 0 ? (medido / a.valor_contrato) * 100 : 0;
                        return (
                          <tr key={a.id}>
                            <td className="py-2 pr-3 text-text-primary font-medium">
                              {a.numero_contrato && <span className="font-mono text-text-disabled text-[10px] mr-1">{a.numero_contrato}</span>}
                              {a.objeto}
                            </td>
                            <td className="py-2 pr-3 text-text-secondary">{a.contratada?.nome ?? "—"}</td>
                            <td className="py-2 pr-3 text-right tabular-nums text-text-secondary">{fmt(a.valor_contrato)}</td>
                            <td className="py-2 pr-3 text-right tabular-nums text-text-secondary">
                              {fmt(medido)} <span className="text-text-disabled text-[10px]">({pct.toFixed(0)}%)</span>
                            </td>
                            <td className="py-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${STATUS_AQUISICAO_CLS[a.status]}`}>
                                {STATUS_AQUISICAO[a.status]}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Section>
              );
            })()}

          </div>

          {/* Rodapé */}
          <div className="px-8 py-4 border-t border-surface-border bg-surface-page/40 flex items-center justify-between">
            <p className="text-[10px] text-text-disabled">
              Gerado em {dataGeracao} · MCA Plataforma · Gerenciamento de Carteira de Obras
            </p>
            <p className="text-[10px] text-text-disabled font-mono">{projeto.codigo ?? projeto.id.slice(0, 8)}</p>
          </div>

        </div>
      </div>
    </div>
  );
}
