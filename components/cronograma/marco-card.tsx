"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconCheck, IconTrash, IconEdit, IconX, IconClock } from "@tabler/icons-react";
import { toast } from "sonner";
import { setMarcoStatus, deleteMarco, updateMarco } from "@/app/actions/cronograma";
import type { Marco } from "@/lib/types";

// ─── Semáforo calculado ───────────────────────────────────────────────────────
function getSemaforo(marco: Marco): "concluido" | "atrasado" | "atencao" | "ok" | "cancelado" {
  if (marco.status === "concluido")  return "concluido";
  if (marco.status === "cancelado")  return "cancelado";
  const hoje      = new Date();
  const prevista  = new Date(marco.data_prevista + "T00:00:00");
  const diasAte   = Math.ceil((prevista.getTime() - hoje.getTime()) / 86_400_000);
  if (diasAte < 0)  return "atrasado";
  if (diasAte <= 7) return "atencao";
  return "ok";
}

const SEM_CFG = {
  concluido: { dot: "bg-status-green",  badge: "bg-green-50 text-green-700 border-green-200",   label: "Concluído"  },
  atrasado:  { dot: "bg-status-red",    badge: "bg-red-50 text-status-red border-red-200",       label: "Atrasado"   },
  atencao:   { dot: "bg-status-yellow", badge: "bg-yellow-50 text-yellow-700 border-yellow-200", label: "Atenção"    },
  ok:        { dot: "bg-brand-500",     badge: "bg-brand-50 text-brand-700 border-brand-100",    label: "No prazo"   },
  cancelado: { dot: "bg-surface-border", badge: "bg-surface-input text-text-disabled border-surface-border", label: "Cancelado" },
} as const;

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

// ─── Botão de submit inline ───────────────────────────────────────────────────
function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
    >
      {pending ? "Salvando…" : "Salvar"}
    </button>
  );
}

// ─── Formulário de edição inline ──────────────────────────────────────────────
function EditForm({
  marco,
  onCancel,
}: {
  marco:    Marco;
  onCancel: () => void;
}) {
  const action = updateMarco.bind(null, marco.projeto_id, marco.id);
  const [state, formAction] = useFormState(action, null);

  if (state && !state.error) onCancel();

  return (
    <form action={formAction} className="space-y-3 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <input
            name="nome"
            defaultValue={marco.nome}
            required
            placeholder="Nome do marco"
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
          />
        </div>
        <input
          name="responsavel"
          defaultValue={marco.responsavel ?? ""}
          placeholder="Responsável"
          className="px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        />
        <input
          name="data_prevista"
          type="date"
          defaultValue={marco.data_prevista}
          required
          className="px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        />
        <div className="col-span-2">
          <textarea
            name="descricao"
            defaultValue={marco.descricao ?? ""}
            placeholder="Descrição (opcional)"
            rows={2}
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary resize-none"
          />
        </div>
      </div>
      {state?.error && <p className="text-xs text-status-red">{state.error}</p>}
      <div className="flex items-center gap-2">
        <SaveButton />
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─── Card principal ───────────────────────────────────────────────────────────
export function MarcoCard({ marco }: { marco: Marco }) {
  const [editing,  setEditing]  = useState(false);
  const [pending,  start]       = useTransition();
  const sem = getSemaforo(marco);
  const cfg = SEM_CFG[sem];

  async function handleConcluir() {
    start(async () => {
      const result = await setMarcoStatus(marco.projeto_id, marco.id, "concluido");
      if (result.error) toast.error(result.error);
    });
  }

  async function handleReabrir() {
    start(async () => {
      const result = await setMarcoStatus(marco.projeto_id, marco.id, "pendente");
      if (result.error) toast.error(result.error);
    });
  }

  async function handleDeletar() {
    if (!confirm(`Remover o marco "${marco.nome}"?`)) return;
    start(async () => {
      const result = await deleteMarco(marco.projeto_id, marco.id);
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <div className="group px-5 py-4 hover:bg-surface-input/40 transition-colors">
      <div className="flex items-start gap-4">
        {/* dot semáforo */}
        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

        {/* conteúdo */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <EditForm marco={marco} onCancel={() => setEditing(false)} />
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-text-primary">{marco.nome}</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>

              {marco.descricao && (
                <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{marco.descricao}</p>
              )}

              <div className="flex items-center gap-3 mt-1.5 text-xs text-text-disabled flex-wrap">
                <span className="flex items-center gap-1">
                  <IconClock size={11} />
                  Previsto: {fmtDate(marco.data_prevista)}
                </span>
                {marco.data_real && (
                  <span className="flex items-center gap-1 text-green-600">
                    <IconCheck size={11} />
                    Concluído: {fmtDate(marco.data_real)}
                  </span>
                )}
                {marco.responsavel && (
                  <span>{marco.responsavel}</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* ações */}
        {!editing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {marco.status !== "concluido" ? (
              <button
                onClick={handleConcluir}
                disabled={pending}
                title="Marcar como concluído"
                className="p-1.5 text-text-disabled hover:text-green-600 transition-colors"
              >
                <IconCheck size={15} />
              </button>
            ) : (
              <button
                onClick={handleReabrir}
                disabled={pending}
                title="Reabrir"
                className="p-1.5 text-text-disabled hover:text-text-primary transition-colors"
              >
                <IconX size={15} />
              </button>
            )}
            <button
              onClick={() => setEditing(true)}
              title="Editar"
              className="p-1.5 text-text-disabled hover:text-text-primary transition-colors"
            >
              <IconEdit size={15} />
            </button>
            <button
              onClick={handleDeletar}
              disabled={pending}
              title="Remover"
              className="p-1.5 text-text-disabled hover:text-status-red transition-colors"
            >
              <IconTrash size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
