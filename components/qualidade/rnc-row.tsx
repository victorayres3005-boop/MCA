"use client";

import { useState, useTransition } from "react";
import { IconChevronDown, IconChevronRight, IconTrash } from "@tabler/icons-react";
import { updateRNCStatus, deleteRNC } from "@/app/actions/rncs";
import type { RNC, StatusRNC, CategoriaRNC } from "@/lib/types";

export const STATUS_LABEL: Record<StatusRNC, string> = {
  aberta:        "Aberta",
  em_tratamento: "Em tratamento",
  fechada:       "Fechada",
  cancelada:     "Cancelada",
};

export const STATUS_CLS: Record<StatusRNC, string> = {
  aberta:        "bg-red-50 text-red-700 border-red-100",
  em_tratamento: "bg-amber-50 text-amber-700 border-amber-100",
  fechada:       "bg-green-50 text-green-700 border-green-200",
  cancelada:     "bg-gray-100 text-gray-500 border-gray-200",
};

export const CATEGORIA_LABEL: Record<CategoriaRNC, string> = {
  tecnica:    "Técnica",
  seguranca:  "Segurança",
  documental: "Documental",
  ambiental:  "Ambiental",
  outro:      "Outro",
};

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

interface RNCRowProps {
  rnc:       RNC;
  projetoId: string;
}

export function RNCRow({ rnc, projetoId }: RNCRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    startTransition(async () => { await updateRNCStatus(projetoId, rnc.id, val); });
  }

  function handleDelete() {
    if (!confirm(`Remover RNC "${rnc.titulo}"?`)) return;
    startTransition(async () => { await deleteRNC(projetoId, rnc.id); });
  }

  const hasDetails = rnc.descricao || rnc.acao_corretiva;

  return (
    <div className={`border-b border-surface-border last:border-0 ${isPending ? "opacity-60" : ""}`}>
      <div
        className="grid items-center gap-3 px-4 py-2.5 hover:bg-surface-page/50 transition-colors cursor-pointer"
        style={{ gridTemplateColumns: "20px 72px 1fr 90px 110px 120px 32px" }}
        onClick={() => hasDetails && setExpanded((v) => !v)}
      >
        <span className="text-text-disabled">
          {hasDetails
            ? expanded ? <IconChevronDown size={13} /> : <IconChevronRight size={13} />
            : <span className="w-[13px]" />}
        </span>

        <span className="text-[11px] font-mono text-text-disabled">{rnc.numero}</span>

        <div className="min-w-0">
          <p className="text-[12px] font-medium text-text-primary truncate">{rnc.titulo}</p>
          {rnc.responsavel && (
            <p className="text-[11px] text-text-disabled truncate">{rnc.responsavel}</p>
          )}
        </div>

        <span className="text-[11px] px-1.5 py-0.5 rounded bg-surface-input border border-surface-border text-text-secondary text-center">
          {CATEGORIA_LABEL[rnc.categoria]}
        </span>

        <span className="text-[11px] text-text-disabled">{fmtDate(rnc.data_abertura)}</span>

        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={rnc.status}
            onChange={handleStatus}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded border cursor-pointer appearance-none w-full ${STATUS_CLS[rnc.status]}`}
          >
            {(Object.keys(STATUS_LABEL) as StatusRNC[]).map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          className="flex items-center justify-center w-6 h-6 rounded text-text-disabled hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <IconTrash size={13} />
        </button>
      </div>

      {expanded && hasDetails && (
        <div className="bg-surface-page/40 border-t border-surface-border/60 px-10 py-3 grid grid-cols-2 gap-4 text-[12px]">
          {rnc.descricao && (
            <div>
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Descrição</p>
              <p className="text-text-secondary leading-relaxed">{rnc.descricao}</p>
            </div>
          )}
          {rnc.acao_corretiva && (
            <div>
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Ação Corretiva</p>
              <p className="text-text-secondary leading-relaxed">{rnc.acao_corretiva}</p>
            </div>
          )}
          {rnc.data_fechamento && (
            <div>
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Data de Fechamento</p>
              <p className="text-text-secondary">{fmtDate(rnc.data_fechamento)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
