import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getMarcos, createMarco } from "@/app/actions/cronograma";
import { MarcoRow } from "@/components/cronograma/marco-row";
import { InlineAddMarco } from "@/components/cronograma/inline-add-marco";
import { CurvaS, type CurvaSPoint } from "@/components/charts/curva-s";
import { IconFlag } from "@tabler/icons-react";
import type { Marco, Projeto } from "@/lib/types";

interface Props { params: Promise<{ id: string }> }

function resumo(marcos: Marco[]) {
  const total      = marcos.length;
  const concluidos = marcos.filter((m) => m.status === "concluido").length;
  const hoje       = new Date();
  const atrasados  = marcos.filter((m) => {
    if (m.status !== "pendente") return false;
    return new Date(m.data_prevista + "T00:00:00") < hoje;
  }).length;
  return { total, concluidos, atrasados };
}

function buildCurvaS(marcos: Marco[], projeto: Projeto): { data: CurvaSPoint[]; hojeIndex: number } {
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

    const previsto = marcos.filter(
      (m) => new Date(m.data_prevista + "T00:00:00") <= monthEnd
    ).length;

    const realizados = isFuture
      ? null
      : marcos.filter(
          (m) =>
            m.status === "concluido" &&
            m.data_real &&
            new Date(m.data_real + "T00:00:00") <= monthEnd
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

export default async function CronogramaPage({ params }: Props) {
  const { id } = await params;
  const [projeto, marcos] = await Promise.all([getProjeto(id), getMarcos(id)]);
  if (!projeto) notFound();

  const addMarco = createMarco.bind(null, id);
  const { total, concluidos, atrasados } = resumo(marcos);

  const pendentes   = marcos.filter((m) => m.status === "pendente");
  const concluidos_ = marcos.filter((m) => m.status === "concluido");
  const hoje        = new Date();
  const proximoMarco = [...pendentes]
    .filter((m) => new Date(m.data_prevista + "T00:00:00") >= hoje)
    .sort((a, b) => a.data_prevista.localeCompare(b.data_prevista))[0];

  const { data: curvaSData, hojeIndex } = buildCurvaS(marcos, projeto);

  function fmtDate(iso: string) {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  return (
    <div className="p-6 space-y-4 animate-page">
      {/* KPI strip */}
      {total > 0 && (
        <div className="flex items-center gap-0 bg-white border border-surface-border rounded-xl overflow-hidden divide-x divide-surface-border animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Total</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{total}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">marcos</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Concluídos</p>
            <p className="text-lg font-bold text-green-600 tabular-nums">{concluidos}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">{Math.round((concluidos / total) * 100)}% do total</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Pendentes</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{pendentes.length}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Atrasados</p>
            <p className={`text-lg font-bold tabular-nums ${atrasados > 0 ? "text-red-600" : "text-text-primary"}`}>{atrasados}</p>
          </div>
          <div className="flex-[2] px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-2">Progresso geral</p>
            <div className="h-2 bg-surface-input rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.round((concluidos / total) * 100)}%` }} />
            </div>
            <p className="text-[11px] text-text-disabled">{Math.round((concluidos / total) * 100)}% concluído</p>
          </div>
          {proximoMarco && (
            <div className="flex-[2] px-5 py-3.5">
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Próximo marco</p>
              <p className="text-[13px] font-semibold text-text-primary truncate">{proximoMarco.nome}</p>
              <p className="text-[11px] text-text-disabled mt-0.5">{fmtDate(proximoMarco.data_prevista)}</p>
            </div>
          )}
        </div>
      )}

      {/* Curva S */}
      {curvaSData.length >= 2 && (
        <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-border bg-surface-page/40">
            <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
              Curva S — Progresso Acumulado de Marcos
            </span>
            <span className="ml-auto text-[11px] text-text-disabled">% acumulado</span>
          </div>
          <div className="px-4 py-3">
            <CurvaS data={curvaSData} hojeIndex={hojeIndex} unit="%" />
          </div>
        </div>
      )}

      {/* Lista principal */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        {/* Header da tabela */}
        <div className="grid grid-cols-[16px_1fr_140px_100px_80px_64px] items-center gap-3 px-4 py-2 border-b border-surface-border bg-surface-page/50">
          <span />
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Marco</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Responsável</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Prazo</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Status</span>
          <span />
        </div>

        {/* Pendentes */}
        {pendentes.length > 0 && (
          <div className="divide-y divide-surface-border">
            {pendentes.map((m) => <MarcoRow key={m.id} marco={m} />)}
          </div>
        )}

        {/* Linha de adição inline */}
        <div className="border-t border-surface-border border-dashed">
          <InlineAddMarco action={addMarco} />
        </div>

        {/* Concluídos — colapsados */}
        {concluidos_.length > 0 && (
          <div className="border-t border-surface-border">
            <div className="px-4 py-2 bg-surface-page/30">
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
                Concluídos · {concluidos_.length}
              </p>
            </div>
            <div className="divide-y divide-surface-border opacity-60">
              {concluidos_.map((m) => <MarcoRow key={m.id} marco={m} />)}
            </div>
          </div>
        )}

        {/* Empty total */}
        {total === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-surface-input flex items-center justify-center">
              <IconFlag size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhum marco cadastrado</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use a linha acima para adicionar o primeiro marco do projeto.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
