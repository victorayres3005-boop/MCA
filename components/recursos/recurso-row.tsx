"use client";

import { useTransition } from "react";
import { IconTrash } from "@tabler/icons-react";
import { deleteRecurso } from "@/app/actions/recursos";
import type { Recurso, TipoRecurso } from "@/lib/types";

export const RECURSO_COLS = "1fr 130px 100px 80px 180px 32px";

const TIPO_LABEL: Record<TipoRecurso, string> = {
  interno:    "Interno",
  externo:    "Externo",
  contratado: "Contratado",
};

const TIPO_CLS: Record<TipoRecurso, string> = {
  interno:    "bg-blue-50 text-blue-700 border-blue-100",
  externo:    "bg-purple-50 text-purple-700 border-purple-100",
  contratado: "bg-amber-50 text-amber-700 border-amber-100",
};

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" });
}

interface RecursoRowProps {
  recurso:   Recurso;
  projetoId: string;
}

export function RecursoRow({ recurso, projetoId }: RecursoRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Remover recurso "${recurso.nome}"?`)) return;
    startTransition(async () => { await deleteRecurso(projetoId, recurso.id); });
  }

  return (
    <div
      className={`grid items-center gap-3 px-4 py-2.5 border-b border-surface-border last:border-0 ${isPending ? "opacity-60" : ""}`}
      style={{ gridTemplateColumns: RECURSO_COLS }}
    >
      {/* Nome + papel */}
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-text-primary truncate">{recurso.nome}</p>
        {recurso.papel && <p className="text-[11px] text-text-disabled truncate">{recurso.papel}</p>}
      </div>

      {/* Tipo */}
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border w-fit ${TIPO_CLS[recurso.tipo]}`}>
        {TIPO_LABEL[recurso.tipo]}
      </span>

      {/* Dedicação */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 bg-surface-input rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full"
            style={{ width: `${recurso.dedicacao ?? 100}%` }}
          />
        </div>
        <span className="text-[11px] font-medium text-text-secondary tabular-nums w-8 text-right">
          {recurso.dedicacao ?? 100}%
        </span>
      </div>

      {/* Período */}
      <span className="text-[11px] text-text-disabled">
        {recurso.data_inicio ? fmtDate(recurso.data_inicio) : "—"}
      </span>
      <span className="text-[11px] text-text-disabled">
        {recurso.data_fim ? `até ${fmtDate(recurso.data_fim)}` : recurso.data_inicio ? "em andamento" : "—"}
      </span>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="flex items-center justify-center w-6 h-6 rounded text-text-disabled hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <IconTrash size={13} />
      </button>
    </div>
  );
}
