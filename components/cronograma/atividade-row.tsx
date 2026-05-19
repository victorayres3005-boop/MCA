"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconCheck, IconTrash, IconEdit, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { setAtividadeStatus, deleteAtividade, updateAtividade } from "@/app/actions/atividades";
import type { Atividade } from "@/lib/types";

function getSemaforo(a: Atividade): "concluida" | "atrasada" | "atencao" | "ok" | "cancelada" {
  if (a.status === "concluida") return "concluida";
  if (a.status === "cancelada") return "cancelada";
  const hoje = new Date();
  const fim  = new Date(a.data_fim_prevista + "T00:00:00");
  const dias = Math.ceil((fim.getTime() - hoje.getTime()) / 86_400_000);
  if (dias < 0)  return "atrasada";
  if (dias <= 7) return "atencao";
  return "ok";
}

const SEM_CFG = {
  concluida: { dot: "bg-green-500",      badge: "bg-green-50 text-green-700",          label: "Concluída" },
  atrasada:  { dot: "bg-red-500",        badge: "bg-red-50 text-red-600",              label: "Atrasada"  },
  atencao:   { dot: "bg-amber-400",      badge: "bg-amber-50 text-amber-700",          label: "Atenção"   },
  ok:        { dot: "bg-brand-500",      badge: "bg-brand-50 text-brand-700",          label: "No prazo"  },
  cancelada: { dot: "bg-surface-border", badge: "bg-surface-input text-text-disabled", label: "Cancelada" },
} as const;

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-3 py-1 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[11px] font-medium rounded-md transition-colors"
    >
      {pending ? "…" : "Salvar"}
    </button>
  );
}

function EditRow({ atividade, onCancel }: { atividade: Atividade; onCancel: () => void }) {
  const action = updateAtividade.bind(null, atividade.projeto_id, atividade.id);
  const [state, formAction] = useFormState(action, null);
  if (state && !state.error) onCancel();

  const inp = "px-2 py-1.5 text-[12px] bg-white border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary w-full";

  return (
    <tr className="bg-brand-50/30">
      <td colSpan={6} className="px-4 py-2">
        <form action={formAction} className="grid grid-cols-[1fr_140px_100px_auto] gap-2 items-center">
          <input name="nome" defaultValue={atividade.nome} required placeholder="Nome da atividade" className={inp} />
          <input name="responsavel" defaultValue={atividade.responsavel ?? ""} placeholder="Responsável" className={inp} />
          <input name="data_fim_prevista" type="date" defaultValue={atividade.data_fim_prevista} required className={inp} />
          <div className="flex items-center gap-1">
            <SaveBtn />
            <button type="button" onClick={onCancel}
              className="p-1.5 text-text-disabled hover:text-text-primary transition-colors">
              <IconX size={13} />
            </button>
          </div>
        </form>
        {state?.error && <p className="text-[11px] text-red-600 mt-1">{state.error}</p>}
      </td>
    </tr>
  );
}

export function AtividadeRow({ atividade }: { atividade: Atividade }) {
  const [editing, setEditing] = useState(false);
  const [pending, start]      = useTransition();
  const sem = getSemaforo(atividade);
  const cfg = SEM_CFG[sem];
  const dias = Math.ceil(
    (new Date(atividade.data_fim_prevista + "T00:00:00").getTime() - new Date().getTime()) / 86_400_000
  );

  async function handleConcluir() {
    start(async () => {
      const r = await setAtividadeStatus(atividade.projeto_id, atividade.id, "concluida");
      if (r.error) toast.error(r.error);
    });
  }
  async function handleReabrir() {
    start(async () => {
      const r = await setAtividadeStatus(atividade.projeto_id, atividade.id, "pendente");
      if (r.error) toast.error(r.error);
    });
  }
  async function handleDeletar() {
    if (!confirm(`Remover "${atividade.nome}"?`)) return;
    start(async () => {
      const r = await deleteAtividade(atividade.projeto_id, atividade.id);
      if (r.error) toast.error(r.error);
    });
  }

  if (editing) {
    return (
      <table className="w-full"><tbody>
        <EditRow atividade={atividade} onCancel={() => setEditing(false)} />
      </tbody></table>
    );
  }

  return (
    <div className="group grid grid-cols-[16px_1fr_140px_100px_80px_64px] items-center gap-3 px-4 py-2.5 hover:bg-surface-input/40 transition-colors">
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

      <div className="min-w-0">
        <span className={`text-[13px] font-medium truncate block ${atividade.status === "concluida" ? "line-through text-text-disabled" : "text-text-primary"}`}>
          {atividade.nome}
        </span>
        {atividade.descricao && (
          <span className="text-[11px] text-text-disabled truncate block">{atividade.descricao}</span>
        )}
      </div>

      <span className="text-[12px] text-text-secondary truncate">{atividade.responsavel ?? "—"}</span>

      <div className="min-w-0">
        <span className="text-[12px] text-text-secondary">{fmtDate(atividade.data_fim_prevista)}</span>
        {(atividade.status === "pendente" || atividade.status === "em_andamento") && (
          <span className={`block text-[10px] tabular-nums ${dias < 0 ? "text-red-600" : dias <= 7 ? "text-amber-600" : "text-text-disabled"}`}>
            {dias < 0 ? `${Math.abs(dias)}d atraso` : dias === 0 ? "hoje" : `${dias}d restantes`}
          </span>
        )}
        {atividade.data_fim_real && (
          <span className="block text-[10px] text-green-600">Concluída {fmtDate(atividade.data_fim_real)}</span>
        )}
      </div>

      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
        {atividade.status !== "concluida" ? (
          <button onClick={handleConcluir} disabled={pending} title="Concluir"
            className="p-1 text-text-disabled hover:text-green-600 transition-colors">
            <IconCheck size={13} />
          </button>
        ) : (
          <button onClick={handleReabrir} disabled={pending} title="Reabrir"
            className="p-1 text-text-disabled hover:text-text-primary transition-colors">
            <IconX size={13} />
          </button>
        )}
        <button onClick={() => setEditing(true)} title="Editar"
          className="p-1 text-text-disabled hover:text-text-primary transition-colors">
          <IconEdit size={13} />
        </button>
        <button onClick={handleDeletar} disabled={pending} title="Remover"
          className="p-1 text-text-disabled hover:text-red-600 transition-colors">
          <IconTrash size={13} />
        </button>
      </div>
    </div>
  );
}
