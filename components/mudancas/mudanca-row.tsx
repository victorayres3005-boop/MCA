"use client";

import { useState, useTransition } from "react";
import { IconChevronDown, IconChevronRight, IconTrash } from "@tabler/icons-react";
import { updateMudancaStatus, deleteMudanca } from "@/app/actions/mudancas";
import type { Mudanca, StatusMudanca } from "@/lib/types";

export const STATUS_LABEL: Record<StatusMudanca, string> = {
  rascunho:      "Rascunho",
  em_analise:    "Em análise",
  aprovada:      "Aprovada",
  rejeitada:     "Rejeitada",
  implementada:  "Implementada",
};

export const STATUS_CLS: Record<StatusMudanca, string> = {
  rascunho:     "bg-gray-100 text-gray-500 border-gray-200",
  em_analise:   "bg-blue-50 text-blue-700 border-blue-100",
  aprovada:     "bg-green-50 text-green-700 border-green-200",
  rejeitada:    "bg-red-50 text-red-700 border-red-100",
  implementada: "bg-teal-50 text-teal-700 border-teal-200",
};

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function fmtCusto(v: number | null) {
  if (v === null) return "—";
  const abs = Math.abs(v);
  const sign = v >= 0 ? "+" : "-";
  return `${sign} R$ ${abs.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function fmtPrazo(v: number | null) {
  if (v === null) return "—";
  return v >= 0 ? `+${v}d` : `${v}d`;
}

interface MudancaRowProps {
  mudanca:   Mudanca;
  projetoId: string;
}

export function MudancaRow({ mudanca, projetoId }: MudancaRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    startTransition(async () => { await updateMudancaStatus(projetoId, mudanca.id, val); });
  }

  function handleDelete() {
    if (!confirm(`Remover mudança "${mudanca.titulo}"?`)) return;
    startTransition(async () => { await deleteMudanca(projetoId, mudanca.id); });
  }

  const hasDetails = mudanca.descricao || mudanca.justificativa || mudanca.impacto_escopo || mudanca.aprovado_por;

  return (
    <div className={`border-b border-surface-border last:border-0 ${isPending ? "opacity-60" : ""}`}>
      {/* Linha principal */}
      <div
        className="grid items-center gap-3 px-4 py-2.5 hover:bg-surface-page/50 transition-colors cursor-pointer"
        style={{ gridTemplateColumns: "20px 72px 1fr 110px 80px 90px 130px 32px" }}
        onClick={() => hasDetails && setExpanded((v) => !v)}
      >
        <span className="text-text-disabled">
          {hasDetails
            ? expanded ? <IconChevronDown size={13} /> : <IconChevronRight size={13} />
            : <span className="w-[13px]" />}
        </span>

        {/* Número */}
        <span className="text-[11px] font-mono text-text-disabled">{mudanca.numero}</span>

        {/* Título + solicitante */}
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-text-primary truncate">{mudanca.titulo}</p>
          {mudanca.solicitante && (
            <p className="text-[11px] text-text-disabled truncate">{mudanca.solicitante}</p>
          )}
        </div>

        {/* Data */}
        <span className="text-[11px] text-text-disabled">{fmtDate(mudanca.data_solicitacao)}</span>

        {/* Impacto prazo */}
        <span className={`text-[12px] font-medium tabular-nums text-right ${
          mudanca.impacto_prazo === null ? "text-text-disabled" :
          mudanca.impacto_prazo > 0 ? "text-red-600" : "text-green-600"
        }`}>
          {fmtPrazo(mudanca.impacto_prazo)}
        </span>

        {/* Impacto custo */}
        <span className={`text-[12px] font-medium tabular-nums text-right ${
          mudanca.impacto_custo === null ? "text-text-disabled" :
          mudanca.impacto_custo > 0 ? "text-red-600" : "text-green-600"
        }`}>
          {fmtCusto(mudanca.impacto_custo)}
        </span>

        {/* Status */}
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={mudanca.status}
            onChange={handleStatus}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border cursor-pointer appearance-none w-full ${STATUS_CLS[mudanca.status]}`}
          >
            {(Object.keys(STATUS_LABEL) as StatusMudanca[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>

        {/* Delete */}
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          className="flex items-center justify-center w-6 h-6 rounded text-text-disabled hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <IconTrash size={13} />
        </button>
      </div>

      {/* Painel de detalhes */}
      {expanded && hasDetails && (
        <div className="bg-surface-page/40 border-t border-surface-border/60 px-10 py-3 grid grid-cols-2 gap-4 text-[12px]">
          {mudanca.descricao && (
            <div>
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Descrição</p>
              <p className="text-text-secondary leading-relaxed">{mudanca.descricao}</p>
            </div>
          )}
          {mudanca.justificativa && (
            <div>
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Justificativa</p>
              <p className="text-text-secondary leading-relaxed">{mudanca.justificativa}</p>
            </div>
          )}
          {mudanca.impacto_escopo && (
            <div>
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Impacto no Escopo</p>
              <p className="text-text-secondary leading-relaxed">{mudanca.impacto_escopo}</p>
            </div>
          )}
          {mudanca.aprovado_por && (
            <div>
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Aprovado / Rejeitado por</p>
              <p className="text-text-secondary">{mudanca.aprovado_por}
                {mudanca.data_aprovacao && (
                  <span className="text-text-disabled ml-1">· {fmtDate(mudanca.data_aprovacao)}</span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
