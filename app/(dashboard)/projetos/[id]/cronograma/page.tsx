import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getMarcos, createMarco } from "@/app/actions/cronograma";
import { MarcoRow } from "@/components/cronograma/marco-row";
import { InlineAddMarco } from "@/components/cronograma/inline-add-marco";
import { CurvaS, type CurvaSPoint } from "@/components/charts/curva-s";
import { ModuleSection, ModuleKpis, KpiCell } from "@/components/shared/module-section";
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
    const previsto = marcos.filter((m) => new Date(m.data_prevista + "T00:00:00") <= monthEnd).length;
    const realizados = isFuture
      ? null
      : marcos.filter((m) => m.status === "concluido" && m.data_real && new Date(m.data_real + "T00:00:00") <= monthEnd).length;
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
  const pctConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;
  const proximoMarco = [...pendentes]
    .filter((m) => new Date(m.data_prevista + "T00:00:00") >= hoje)
    .sort((a, b) => a.data_prevista.localeCompare(b.data_prevista))[0];
  const { data: curvaSData, hojeIndex } = buildCurvaS(marcos, projeto);

  function fmtDate(iso: string) {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  return (
    <div className="p-6 space-y-4">

      {total > 0 && (
        <ModuleKpis>
          <KpiCell label="Total" value={total} sub="marcos" />
          <KpiCell label="Concluídos" value={concluidos} sub={`${pctConcluido}% do total`} valueClassName="text-green-600" />
          <KpiCell label="Pendentes" value={pendentes.length} />
          <KpiCell label="Atrasados" value={atrasados} valueClassName={atrasados > 0 ? "text-red-600" : "text-[#0D2B45]"} />
          <KpiCell
            label="Progresso"
            flex={2}
            value={
              <div className="pt-1">
                <div className="h-2 bg-[#F0F2F5] rounded-full overflow-hidden mb-1.5">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${pctConcluido}%` }} />
                </div>
                <p className="text-[11px] text-text-disabled font-normal">{pctConcluido}% concluído</p>
              </div>
            }
          />
          {proximoMarco && (
            <KpiCell
              label="Próximo marco"
              flex={2}
              value={<span className="text-[15px] font-semibold leading-tight">{proximoMarco.nome}</span>}
              sub={fmtDate(proximoMarco.data_prevista)}
            />
          )}
        </ModuleKpis>
      )}

      {curvaSData.length >= 2 && (
        <ModuleSection title="Curva S — Progresso Acumulado" badge="% de marcos" noPadding>
          <div className="px-5 py-4">
            <CurvaS data={curvaSData} hojeIndex={hojeIndex} unit="%" />
          </div>
        </ModuleSection>
      )}

      <ModuleSection
        title="Marcos"
        badge={total > 0 ? `${total} ${total === 1 ? "marco" : "marcos"}` : undefined}
        noPadding
      >
        <div className="grid grid-cols-[16px_1fr_140px_100px_80px_64px] items-center gap-3 px-5 py-2.5 border-b border-[#F0F2F5]">
          <span />
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Marco</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Responsável</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Prazo</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Status</span>
          <span />
        </div>

        {pendentes.length > 0 && (
          <div className="divide-y divide-[#F0F2F5]">
            {pendentes.map((m) => <MarcoRow key={m.id} marco={m} />)}
          </div>
        )}

        <div className="border-t border-dashed border-[#E9EBF0]">
          <InlineAddMarco action={addMarco} />
        </div>

        {concluidos_.length > 0 && (
          <div className="border-t border-[#E9EBF0]">
            <div className="px-5 py-2 bg-[#FAFBFC]">
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
                Concluídos · {concluidos_.length}
              </p>
            </div>
            <div className="divide-y divide-[#F0F2F5] opacity-60">
              {concluidos_.map((m) => <MarcoRow key={m.id} marco={m} />)}
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center">
              <IconFlag size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhum marco cadastrado</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use a linha acima para adicionar o primeiro marco.</p>
            </div>
          </div>
        )}
      </ModuleSection>

    </div>
  );
}
