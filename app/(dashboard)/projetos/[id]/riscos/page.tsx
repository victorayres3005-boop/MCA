import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getRiscos, createRisco } from "@/app/actions/riscos";
import { RiscoRow } from "@/components/riscos/risco-row";
import { InlineAddRisco } from "@/components/riscos/inline-add-risco";
import { nivelRisco } from "@/components/riscos/risco-card";
import { IconAlertTriangle } from "@tabler/icons-react";

interface Props { params: Promise<{ id: string }> }

function cellStyle(p: number, i: number): string {
  const score = p * i;
  if (score >= 15) return "bg-red-100 border-red-200 text-red-700";
  if (score >= 6)  return "bg-amber-50 border-amber-200 text-amber-700";
  return "bg-green-50 border-green-200 text-green-700";
}

export default async function RiscosPage({ params }: Props) {
  const { id } = await params;
  const [projeto, riscos] = await Promise.all([getProjeto(id), getRiscos(id)]);
  if (!projeto) notFound();

  const addRisco = createRisco.bind(null, id);

  const ativos   = riscos.filter((r) => r.status !== "encerrado" && r.status !== "mitigado");
  const inativos = riscos.filter((r) => r.status === "encerrado" || r.status === "mitigado");

  const altos  = ativos.filter((r) => nivelRisco(r.probabilidade, r.impacto) === "alto").length;
  const medios = ativos.filter((r) => nivelRisco(r.probabilidade, r.impacto) === "medio").length;
  const baixos = ativos.filter((r) => nivelRisco(r.probabilidade, r.impacto) === "baixo").length;

  const ativosOrdenados = [...ativos].sort((a, b) =>
    (b.probabilidade * b.impacto) - (a.probabilidade * a.impacto)
  );

  const matrixCount: Record<string, number> = {};
  for (const r of ativos) {
    const key = `${r.probabilidade}-${r.impacto}`;
    matrixCount[key] = (matrixCount[key] ?? 0) + 1;
  }

  return (
    <div className="p-6 space-y-4 animate-page">

      {/* KPI strip */}
      {riscos.length > 0 && (
        <div className="flex items-center gap-0 bg-white border border-surface-border rounded-xl overflow-hidden divide-x divide-surface-border animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Ativos</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{ativos.length}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">riscos monitorados</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Alto risco</p>
            <p className={`text-lg font-bold tabular-nums ${altos > 0 ? "text-red-600" : "text-text-primary"}`}>{altos}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Médio risco</p>
            <p className={`text-lg font-bold tabular-nums ${medios > 0 ? "text-amber-600" : "text-text-primary"}`}>{medios}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Baixo risco</p>
            <p className="text-lg font-bold text-green-600 tabular-nums">{baixos}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Encerrados</p>
            <p className="text-lg font-bold text-text-disabled tabular-nums">{inativos.length}</p>
          </div>
        </div>
      )}

      {/* Matriz P × I */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-border bg-surface-page/40">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Matriz de Risco — Probabilidade × Impacto
          </span>
          <span className="ml-auto text-[11px] text-text-disabled">escala 1–5 · PMBOK</span>
        </div>
        <div className="p-5 flex gap-5 items-start">
          {/* Y-axis label */}
          <div className="flex items-center justify-center self-stretch">
            <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-widest select-none"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              Probabilidade
            </span>
          </div>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {/* Column headers */}
            <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: "28px repeat(5, 1fr)" }}>
              <div />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="text-center text-[10px] font-semibold text-text-disabled">{i}</div>
              ))}
            </div>

            {/* Rows: p 5→1 */}
            {[5, 4, 3, 2, 1].map((p) => (
              <div key={p} className="grid gap-1 mb-1" style={{ gridTemplateColumns: "28px repeat(5, 1fr)" }}>
                <div className="flex items-center justify-end pr-1.5 text-[10px] font-semibold text-text-disabled">{p}</div>
                {[1, 2, 3, 4, 5].map((i) => {
                  const count = matrixCount[`${p}-${i}`] ?? 0;
                  return (
                    <div key={i}
                      className={`border rounded-md h-10 flex items-center justify-center ${cellStyle(p, i)}`}>
                      {count > 0 && <span className="text-[13px] font-bold">{count}</span>}
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="text-center text-[10px] font-semibold text-text-disabled uppercase tracking-widest mt-2">
              Impacto
            </div>
          </div>

          {/* Legenda */}
          <div className="shrink-0 flex flex-col gap-2.5 self-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-200 rounded-sm" />
              <span className="text-[11px] text-text-secondary">Alto · ≥ 15</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-50 border border-amber-200 rounded-sm" />
              <span className="text-[11px] text-text-secondary">Médio · 6–14</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded-sm" />
              <span className="text-[11px] text-text-secondary">Baixo · &lt; 6</span>
            </div>
            {ativos.length > 0 && (
              <p className="text-[10px] text-text-disabled border-t border-surface-border pt-2 mt-0.5 leading-snug">
                Número = qtd.<br />de riscos na célula
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabela de riscos */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <div className="grid items-center gap-3 px-4 py-2 border-b border-surface-border bg-surface-page/50"
          style={{ gridTemplateColumns: "8px 1fr 90px 48px 48px 80px 90px 32px" }}>
          <span />
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Risco</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Categoria</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-center">Prob.</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-center">Imp.</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Nível</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Status</span>
          <span />
        </div>

        {ativosOrdenados.length > 0 && (
          <div className="divide-y divide-surface-border">
            {ativosOrdenados.map((r) => <RiscoRow key={r.id} risco={r} />)}
          </div>
        )}

        {riscos.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <IconAlertTriangle size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhum risco identificado</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use a linha abaixo para registrar o primeiro risco do projeto.</p>
            </div>
          </div>
        )}

        {/* Linha inline de adição */}
        <div className="border-t border-dashed border-surface-border">
          <InlineAddRisco action={addRisco} />
        </div>

        {inativos.length > 0 && (
          <div className="border-t border-surface-border">
            <div className="px-4 py-1.5 bg-surface-page/30">
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
                Encerrados / Mitigados · {inativos.length}
              </p>
            </div>
            <div className="divide-y divide-surface-border opacity-50">
              {inativos.map((r) => <RiscoRow key={r.id} risco={r} />)}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
