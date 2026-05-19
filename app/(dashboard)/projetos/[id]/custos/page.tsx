import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getOrcamentoItens, createOrcamentoItem } from "@/app/actions/custos";
import { getAquisicoes } from "@/app/actions/aquisicoes";
import { OrcamentoRow } from "@/components/custos/orcamento-row";
import { InlineAddOrcamento } from "@/components/custos/inline-add-orcamento";
import { CurvaS, type CurvaSPoint } from "@/components/charts/curva-s";
import { IconCoin } from "@tabler/icons-react";
import type { OrcamentoItem, CategoriaOrcamento, Aquisicao, Projeto } from "@/lib/types";

interface Props { params: Promise<{ id: string }> }

const CAT_LABEL: Record<CategoriaOrcamento, string> = {
  material:    "Material",
  mao_de_obra: "Mão de obra",
  equipamento: "Equipamento",
  servico:     "Serviço",
  outro:       "Outro",
};

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}
function fmtCompact(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(v);
}

function buildCurvaS(
  aquisicoes: Aquisicao[],
  projeto: Projeto
): { data: CurvaSPoint[]; hojeIndex: number } {
  // Precisa de pelo menos 1 aquisição com datas para construir a curva
  const comDatas = aquisicoes.filter((a) => a.data_inicio || a.data_fim_prevista);
  const todasMedicoes = aquisicoes.flatMap((a) => a.medicoes ?? []);

  if (comDatas.length === 0 && todasMedicoes.length === 0) return { data: [], hojeIndex: 0 };

  const hoje = new Date();
  const todayMth = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const projInicio = projeto.data_inicio ? new Date(projeto.data_inicio + "T00:00:00") : null;
  const projFim = projeto.data_fim_prevista ? new Date(projeto.data_fim_prevista + "T00:00:00") : null;

  // Medições reais por mês (YYYY-MM → valor acumulado)
  const medicoesByMonth: Record<string, number> = {};
  for (const med of todasMedicoes) {
    medicoesByMonth[med.competencia] = (medicoesByMonth[med.competencia] ?? 0) + med.valor;
  }

  // Baseline planejada: distribuir valor_contrato de cada aquisição nos seus meses
  const planeadoByMonth: Record<string, number> = {};
  for (const aq of aquisicoes) {
    const start = aq.data_inicio
      ? new Date(aq.data_inicio + "T00:00:00")
      : projInicio ?? hoje;
    const end = aq.data_fim_prevista
      ? new Date(aq.data_fim_prevista + "T00:00:00")
      : projFim ?? hoje;

    const months: string[] = [];
    const c = new Date(start.getFullYear(), start.getMonth(), 1);
    const e = new Date(end.getFullYear(), end.getMonth(), 1);
    while (c <= e) {
      months.push(`${c.getFullYear()}-${String(c.getMonth() + 1).padStart(2, "0")}`);
      c.setMonth(c.getMonth() + 1);
    }
    if (months.length === 0) continue;
    const perMonth = aq.valor_contrato / months.length;
    for (const m of months) {
      planeadoByMonth[m] = (planeadoByMonth[m] ?? 0) + perMonth;
    }
  }

  // Determinar intervalo da série
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

export default async function CustosPage({ params }: Props) {
  const { id } = await params;
  const [projeto, itens, aquisicoes] = await Promise.all([
    getProjeto(id),
    getOrcamentoItens(id),
    getAquisicoes(id),
  ]);
  if (!projeto) notFound();

  const addItem = createOrcamentoItem.bind(null, id);

  const planejado = itens.reduce((s, i) => s + i.valor_planejado, 0);
  const realizado = itens.reduce((s, i) => s + i.valor_realizado, 0);
  const variacao  = planejado - realizado;
  const cpi       = realizado > 0 ? planejado / realizado : null;
  const perc      = planejado > 0 ? Math.round((realizado / planejado) * 100) : 0;

  const cats = (Object.keys(CAT_LABEL) as CategoriaOrcamento[]).map((cat) => ({
    cat,
    label: CAT_LABEL[cat],
    itens: itens.filter((i) => i.categoria === cat),
  })).filter((g) => g.itens.length > 0);

  const { data: curvaSData, hojeIndex } = buildCurvaS(aquisicoes, projeto);

  return (
    <div className="p-6 space-y-4 animate-page">
      {/* KPI strip */}
      {itens.length > 0 && (
        <div className="flex items-center gap-0 bg-white border border-surface-border rounded-xl overflow-hidden divide-x divide-surface-border animate-stagger">
          {[
            { label: "Orçamento",    value: fmtCompact(planejado), sub: "planejado",        color: "text-text-primary" },
            { label: "Executado",    value: fmtCompact(realizado),  sub: `${perc}% do orç.`, color: "text-text-primary" },
            { label: "Variação (VC)", value: (variacao >= 0 ? "+" : "") + fmtCompact(variacao), sub: variacao >= 0 ? "abaixo do orç." : "acima do orç.", color: variacao >= 0 ? "text-green-600" : "text-red-600" },
            { label: "CPI",          value: cpi !== null ? cpi.toFixed(2) : "—",            sub: cpi === null ? "sem realizado" : cpi >= 1 ? "eficiente" : "ineficiente", color: cpi === null ? "text-text-disabled" : cpi >= 1 ? "text-green-600" : "text-red-600" },
          ].map((k) => (
            <div key={k.label} className="flex-1 px-5 py-3.5">
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">{k.label}</p>
              <p className={`text-lg font-bold tabular-nums leading-tight ${k.color}`}>{k.value}</p>
              <p className="text-[11px] text-text-disabled mt-0.5">{k.sub}</p>
            </div>
          ))}
          {/* Barra de progresso no último item */}
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Execução</p>
            <div className="h-2 bg-surface-input rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all ${perc > 100 ? "bg-red-500" : "bg-brand-500"}`}
                style={{ width: `${Math.min(perc, 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-text-disabled">{perc}% do orçamento</p>
          </div>
        </div>
      )}

      {/* Curva S financeira */}
      {curvaSData.length >= 2 && (
        <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-border bg-surface-page/40">
            <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
              Curva S — Desembolso Acumulado
            </span>
            <span className="ml-auto text-[11px] text-text-disabled">baseline vs medições reais</span>
          </div>
          <div className="px-4 py-3">
            <CurvaS data={curvaSData} hojeIndex={hojeIndex} unit="BRL" />
          </div>
        </div>
      )}

      {/* Tabela de itens agrupada por categoria */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="grid grid-cols-[1fr_110px_120px_120px_100px_24px] items-center gap-3 px-4 py-2 border-b border-surface-border bg-surface-page/50">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Descrição</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Categoria</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-right">Planejado</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-right">Realizado</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-right">Variação</span>
          <span />
        </div>

        {cats.map(({ cat, label, itens: grupo }) => (
          <div key={cat}>
            {/* Subgrupo header */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-surface-page/30 border-b border-surface-border">
              <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">{label}</span>
              <span className="text-[11px] text-text-disabled tabular-nums">
                {fmt(grupo.reduce((s, i) => s + i.valor_planejado, 0))}
              </span>
            </div>
            <div className="divide-y divide-surface-border">
              {grupo.map((item) => <OrcamentoRow key={item.id} item={item} />)}
            </div>
          </div>
        ))}

        {/* Linha inline de adição */}
        <div className={`border-t ${itens.length > 0 ? "border-dashed" : ""} border-surface-border`}>
          <InlineAddOrcamento action={addItem} />
        </div>

        {/* Empty state */}
        {itens.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-surface-input flex items-center justify-center">
              <IconCoin size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhum item de orçamento</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use a linha acima para registrar o primeiro item.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
