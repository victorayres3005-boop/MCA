"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { IconChevronDown, IconChevronRight, IconTrash, IconPlus } from "@tabler/icons-react";
import { updateAquisicaoStatus, deleteAquisicao, deleteMedicao } from "@/app/actions/aquisicoes";
import type { Aquisicao, StatusAquisicao } from "@/lib/types";

export const STATUS_LABEL: Record<StatusAquisicao, string> = {
  planejado: "Planejado",
  ativo:     "Ativo",
  suspenso:  "Suspenso",
  encerrado: "Encerrado",
};

export const STATUS_CLS: Record<StatusAquisicao, string> = {
  planejado: "bg-blue-50 text-blue-700 border-blue-100",
  ativo:     "bg-teal-50 text-teal-700 border-teal-200",
  suspenso:  "bg-amber-50 text-amber-700 border-amber-100",
  encerrado: "bg-gray-100 text-gray-500 border-gray-200",
};

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function fmtCompetencia(ym: string) {
  const [y, m] = ym.split("-");
  const names = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${names[parseInt(m) - 1]}/${y}`;
}

function Stars({ n }: { n: number | null }) {
  if (!n) return <span className="text-text-disabled text-[11px]">—</span>;
  return (
    <span className="text-[11px] text-amber-400">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

const inp = "px-2 py-1 text-[11px] bg-surface-input border border-surface-border rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled";

function MedicaoSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[11px] font-medium rounded transition-colors">
      <IconPlus size={11} />
      {pending ? "…" : "Adicionar"}
    </button>
  );
}

interface AquisicaoRowProps {
  aquisicao:    Aquisicao;
  projetoId:    string;
  addMedicaoFn: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

export function AquisicaoRow({ aquisicao, projetoId, addMedicaoFn }: AquisicaoRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [medicaoState, medicaoAction] = useFormState(addMedicaoFn, null);
  const medicaoRef = useRef<HTMLFormElement>(null);

  const medicoes = aquisicao.medicoes ?? [];
  const valorMedido = medicoes.reduce((s, m) => s + m.valor, 0);
  const saldo = aquisicao.valor_contrato - valorMedido;
  const pct   = aquisicao.valor_contrato > 0
    ? Math.min(100, Math.round((valorMedido / aquisicao.valor_contrato) * 100))
    : 0;

  useEffect(() => {
    if (!medicaoState) return;
    if (medicaoState.error) toast.error(medicaoState.error);
    else medicaoRef.current?.reset();
  }, [medicaoState]);

  function handleDelete() {
    if (!confirm(`Remover contrato "${aquisicao.objeto}"?`)) return;
    startTransition(async () => { await deleteAquisicao(projetoId, aquisicao.id); });
  }

  function handleDeleteMedicao(id: string) {
    if (!confirm("Remover esta medição?")) return;
    startTransition(async () => { await deleteMedicao(id, projetoId); });
  }

  function handleStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    startTransition(async () => { await updateAquisicaoStatus(projetoId, aquisicao.id, val); });
  }

  return (
    <div className={`border-b border-surface-border last:border-0 ${isPending ? "opacity-60" : ""}`}>
      {/* Linha principal */}
      <div
        className="grid items-center gap-3 px-4 py-2.5 hover:bg-surface-page/50 transition-colors cursor-pointer"
        style={{ gridTemplateColumns: "20px 1fr 110px 120px 120px 110px 120px 32px" }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Toggle */}
        <span className="text-text-disabled">
          {expanded
            ? <IconChevronDown size={13} />
            : <IconChevronRight size={13} />}
        </span>

        {/* Objeto + contratada */}
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-text-primary truncate">{aquisicao.objeto}</p>
          {aquisicao.contratada && (
            <p className="text-[11px] text-text-disabled truncate">{aquisicao.contratada.nome}</p>
          )}
        </div>

        {/* Nº Contrato */}
        <span className="text-[11px] text-text-disabled font-mono truncate">
          {aquisicao.numero_contrato ?? "—"}
        </span>

        {/* Valor contrato */}
        <span className="text-[12px] text-text-secondary tabular-nums text-right">
          {fmt(aquisicao.valor_contrato)}
        </span>

        {/* Medido + mini progress */}
        <div className="text-right">
          <span className="text-[12px] text-text-secondary tabular-nums">{fmt(valorMedido)}</span>
          <div className="mt-0.5 h-1 bg-surface-input rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Saldo */}
        <span className={`text-[12px] tabular-nums text-right ${saldo < 0 ? "text-red-600 font-medium" : "text-text-secondary"}`}>
          {fmt(saldo)}
        </span>

        {/* Status + avaliação */}
        <div className="flex flex-col items-start gap-0.5" onClick={(e) => e.stopPropagation()}>
          <select
            value={aquisicao.status}
            onChange={handleStatus}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border cursor-pointer appearance-none ${STATUS_CLS[aquisicao.status]}`}
          >
            {(Object.keys(STATUS_LABEL) as StatusAquisicao[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <Stars n={aquisicao.avaliacao} />
        </div>

        {/* Ações */}
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          className="flex items-center justify-center w-6 h-6 rounded text-text-disabled hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <IconTrash size={13} />
        </button>
      </div>

      {/* Painel de medições */}
      {expanded && (
        <div className="bg-surface-page/40 border-t border-surface-border/60 px-10 py-3 space-y-2">
          <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-2">
            Medições mensais · {pct}% medido
          </p>

          {/* Lista de medições */}
          {medicoes.length > 0 ? (
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-1 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Competência</th>
                  <th className="text-right py-1 pr-4 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Valor</th>
                  <th className="text-left py-1 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Descrição</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {medicoes
                  .slice()
                  .sort((a, b) => a.competencia.localeCompare(b.competencia))
                  .map((m) => (
                    <tr key={m.id}>
                      <td className="py-1.5 pr-4 font-medium text-text-primary">{fmtCompetencia(m.competencia)}</td>
                      <td className="py-1.5 pr-4 text-right tabular-nums text-text-secondary">{fmt(m.valor)}</td>
                      <td className="py-1.5 text-text-disabled">{m.descricao ?? "—"}</td>
                      <td className="py-1.5 pl-2 text-right">
                        <button
                          onClick={() => handleDeleteMedicao(m.id)}
                          className="text-text-disabled hover:text-red-500 transition-colors"
                        >
                          <IconTrash size={11} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[11px] text-text-disabled italic">Nenhuma medição registrada.</p>
          )}

          {/* Formulário de nova medição */}
          <form ref={medicaoRef} action={medicaoAction}
            className="flex items-center gap-2 pt-2 border-t border-dashed border-surface-border"
            onClick={(e) => e.stopPropagation()}
          >
            <input name="competencia" type="month" required className={`${inp} w-36`} />
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-text-disabled">R$</span>
              <input name="valor" type="number" step="0.01" min="0" required placeholder="0,00"
                className={`${inp} pl-7 w-32`} />
            </div>
            <input name="descricao" placeholder="Descrição (opcional)" className={`${inp} flex-1`} />
            <MedicaoSubmitButton />
          </form>
        </div>
      )}
    </div>
  );
}
