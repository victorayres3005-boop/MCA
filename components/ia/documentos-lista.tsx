"use client";

import { useTransition, useState } from "react";
import {
  IconFileText, IconCheck, IconTrash,
  IconLoader2, IconCircleCheck,
} from "@tabler/icons-react";
import { deleteDocumento, aprovarDocumento } from "@/app/actions/documentos";
import type { Documento } from "@/app/actions/documentos";

const TIPO_LABEL: Record<string, string> = {
  TAP: "Termo de Abertura do Projeto",
  RMA: "Relatório Mensal de Acompanhamento",
  ata: "Ata de Reunião",
};

interface DocumentosListaProps {
  documentos: Documento[];
  projetoId:  string;
}

export function DocumentosLista({ documentos, projetoId }: DocumentosListaProps) {
  if (documentos.length === 0) {
    return (
      <div className="bg-white border border-surface-border rounded-xl px-6 py-10 text-center">
        <IconFileText size={32} className="text-text-disabled mx-auto mb-3" />
        <p className="text-sm font-medium text-text-secondary">Nenhum documento gerado ainda</p>
        <p className="text-xs text-text-disabled mt-1">Use o gerador ao lado para criar documentos PMBOK com IA.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documentos.map((doc) => (
        <DocumentoItem key={doc.id} doc={doc} projetoId={projetoId} />
      ))}
    </div>
  );
}

function DocumentoItem({ doc, projetoId }: { doc: Documento; projetoId: string }) {
  const [expanded,    setExpanded]    = useState(false);
  const [isDeleting,  startDelete]    = useTransition();
  const [isApproving, startApprove]   = useTransition();

  const dataFmt = new Date(doc.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });

  function handleDelete() {
    if (!confirm("Excluir este documento?")) return;
    startDelete(async () => { await deleteDocumento(doc.id, projetoId); });
  }

  function handleAprovar() {
    startApprove(async () => { await aprovarDocumento(doc.id, projetoId); });
  }

  return (
    <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-surface-input/40 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <IconFileText size={18} className="text-brand-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{doc.titulo}</p>
            <p className="text-xs text-text-disabled">{TIPO_LABEL[doc.tipo] ?? doc.tipo} · {dataFmt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {doc.status === "aprovado" ? (
            <span className="inline-flex items-center gap-1 text-xs text-status-green font-medium">
              <IconCircleCheck size={14} />
              Aprovado
            </span>
          ) : (
            <span className="text-xs text-text-disabled border border-surface-border px-2 py-0.5 rounded-full">
              Rascunho
            </span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-surface-border">
          <div className="px-5 py-4 bg-surface-input/30 max-h-[400px] overflow-y-auto">
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
              {doc.conteudo}
            </pre>
          </div>
          <div className="px-5 py-3 flex items-center gap-3 border-t border-surface-border">
            {doc.status !== "aprovado" && (
              <button
                onClick={handleAprovar}
                disabled={isApproving}
                className="inline-flex items-center gap-1.5 text-xs text-status-green hover:bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isApproving ? <IconLoader2 size={13} className="animate-spin" /> : <IconCheck size={13} />}
                Aprovar
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 text-xs text-status-red hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {isDeleting ? <IconLoader2 size={13} className="animate-spin" /> : <IconTrash size={13} />}
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
