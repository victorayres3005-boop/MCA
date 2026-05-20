"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconCheck, IconTrash, IconEdit, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { setMarcoStatus, deleteMarco, updateMarco } from "@/app/actions/cronograma";
import type { Marco } from "@/lib/types";

export const MARCO_COLS = "16px 1fr 140px 100px 80px 64px";

function getSemaforo(marco: Marco): "concluido" | "atrasado" | "atencao" | "ok" | "cancelado" {
  if (marco.status === "concluido") return "concluido";
  if (marco.status === "cancelado") return "cancelado";
  const hoje = new Date();
  const prev = new Date(marco.data_prevista + "T00:00:00");
  const dias = Math.ceil((prev.getTime() - hoje.getTime()) / 86_400_000);
  if (dias < 0)  return "atrasado";
  if (dias <= 7) return "atencao";
  return "ok";
}

const SEM_CFG = {
  concluido: { dot: "bg-green-500",       badge: "bg-green-50 text-green-700",     label: "Concluído" },
  atrasado:  { dot: "bg-red-500",         badge: "bg-red-50 text-red-600",         label: "Atrasado"  },
  atencao:   { dot: "bg-amber-400",       badge: "bg-amber-50 text-amber-700",     label: "Atenção"   },
  ok:        { dot: "bg-brand-500",       badge: "bg-brand-50 text-brand-700",     label: "No prazo"  },
  cancelado: { dot: "bg-surface-border",  badge: "bg-surface-input text-text-disabled", label: "Cancelado" },
} as const;

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function diasRestantes(iso: string) {
  const hoje = new Date();
  const prev = new Date(iso + "T00:00:00");
  return Math.ceil((prev.getTime() - hoje.getTime()) / 86_400_000);
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-3 py-1 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[11px] font-medium rounded-md transition-colors">
      {pending ? "…" : "Salvar"}
    </button>
  );
}

function EditRow({ marco, onCancel }: { marco: Marco; onCancel: () => void }) {
  const action = updateMarco.bind(null, marco.projeto_id, marco.id);
  const [state, formAction] = useFormState(action, null);
  if (state && !state.error) onCancel();

  const inp = "px-2 py-1.5 text-[12px] bg-white border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary w-full";

  return (
    <div className="bg-brand-50/30 px-4 py-2">
      <form action={formAction} className="grid grid-cols-[1fr_140px_100px_auto] gap-2 items-center">
        <input name="nome" defaultValue={marco.nome} required placeholder="Nome do marco"
          className={inp} />
        <input name="responsavel" defaultValue={marco.responsavel ?? ""} placeholder="Responsável"
          className={inp} />
        <input name="data_prevista" type="date" defaultValue={marco.data_prevista} required
          className={inp} />
        <div className="flex items-center gap-1">
          <SaveBtn />
          <button type="button" onClick={onCancel}
            className="p-1.5 text-text-disabled hover:text-text-primary transition-colors">
            <IconX size={13} />
          </button>
        </div>
      </form>
      {state?.error && <p className="text-[11px] text-red-600 mt-1">{state.error}</p>}
    </div>
  );
}

export function MarcoRow({ marco }: { marco: Marco }) {
  const [editing, setEditing] = useState(false);
  const [pending, start]      = useTransition();
  const sem = getSemaforo(marco);
  const cfg = SEM_CFG[sem];
  const dias = diasRestantes(marco.data_prevista);

  async function handleConcluir() {
    start(async () => {
      const r = await setMarcoStatus(marco.projeto_id, marco.id, "concluido");
      if (r.error) toast.error(r.error);
    });
  }
  async function handleReabrir() {
    start(async () => {
      const r = await setMarcoStatus(marco.projeto_id, marco.id, "pendente");
      if (r.error) toast.error(r.error);
    });
  }
  async function handleDeletar() {
    if (!confirm(`Remover "${marco.nome}"?`)) return;
    start(async () => {
      const r = await deleteMarco(marco.projeto_id, marco.id);
      if (r.error) toast.error(r.error);
    });
  }

  if (editing) return <EditRow marco={marco} onCancel={() => setEditing(false)} />;

  return (
    <div className="group grid items-center gap-3 px-4 py-2.5 hover:bg-surface-input/40 transition-colors" style={{ gridTemplateColumns: MARCO_COLS }}>
      {/* dot */}
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

      {/* nome */}
      <div className="min-w-0">
        <span className={`text-[13px] font-medium truncate block ${marco.status === "concluido" ? "line-through text-text-disabled" : "text-text-primary"}`}>
          {marco.nome}
        </span>
        {marco.descricao && (
          <span className="text-[11px] text-text-disabled truncate block">{marco.descricao}</span>
        )}
      </div>

      {/* responsável */}
      <span className="text-[12px] text-text-secondary truncate">
        {marco.responsavel ?? "—"}
      </span>

      {/* prazo */}
      <div className="min-w-0">
        <span className="text-[12px] text-text-secondary">{fmtDate(marco.data_prevista)}</span>
        {marco.status === "pendente" && (
          <span className={`block text-[10px] tabular-nums ${dias < 0 ? "text-red-600" : dias <= 7 ? "text-amber-600" : "text-text-disabled"}`}>
            {dias < 0 ? `${Math.abs(dias)}d atraso` : dias === 0 ? "hoje" : `${dias}d restantes`}
          </span>
        )}
        {marco.data_real && (
          <span className="block text-[10px] text-green-600">
            Concluído {fmtDate(marco.data_real)}
          </span>
        )}
      </div>

      {/* status badge */}
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
        {cfg.label}
      </span>

      {/* ações */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
        {marco.status !== "concluido" ? (
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
