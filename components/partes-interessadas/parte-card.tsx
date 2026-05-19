"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconTrash, IconEdit, IconArrowRight } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteParteInteressada, updateParteInteressada } from "@/app/actions/partes-interessadas";
import type { ParteInteressada, NivelEngajamento } from "@/lib/types";

export const ENGAJAMENTO_LABEL: Record<NivelEngajamento, string> = {
  desconhecido: "Desconhecido",
  resistente:   "Resistente",
  neutro:       "Neutro",
  apoiador:     "Apoiador",
  lider:        "Líder",
};

const ENGAJAMENTO_CLS: Record<NivelEngajamento, string> = {
  desconhecido: "bg-surface-input text-text-disabled border-surface-border",
  resistente:   "bg-red-50 text-status-red border-red-200",
  neutro:       "bg-yellow-50 text-yellow-700 border-yellow-200",
  apoiador:     "bg-blue-50 text-blue-700 border-blue-200",
  lider:        "bg-green-50 text-green-700 border-green-200",
};

const NIVEIS: NivelEngajamento[] = ["desconhecido", "resistente", "neutro", "apoiador", "lider"];
const ESCALA = [1, 2, 3, 4, 5];

function gapColor(atual: NivelEngajamento, desejado: NivelEngajamento) {
  const idx = NIVEIS.indexOf(atual);
  const idxD = NIVEIS.indexOf(desejado);
  if (idx === idxD) return "text-green-600";
  if (idx < idxD)  return "text-yellow-600";
  return "text-status-red";
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors">
      {pending ? "Salvando…" : "Salvar"}
    </button>
  );
}

function EditForm({ parte, onCancel }: { parte: ParteInteressada; onCancel: () => void }) {
  const action = updateParteInteressada.bind(null, parte.projeto_id, parte.id);
  const [state, formAction] = useFormState(action, null);
  if (state && !state.error) onCancel();

  const inp = "w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary";

  return (
    <form action={formAction} className="space-y-3 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <input name="nome" defaultValue={parte.nome} required placeholder="Nome" className={inp} />
        <input name="organizacao" defaultValue={parte.organizacao ?? ""} placeholder="Organização" className={inp} />
        <input name="papel" defaultValue={parte.papel ?? ""} placeholder="Papel / cargo" className={inp} />
        <input name="contato" defaultValue={parte.contato ?? ""} placeholder="Contato (e-mail ou tel.)" className={inp} />
        <div>
          <label className="block text-xs text-text-secondary mb-1">Influência (1–5)</label>
          <select name="influencia" defaultValue={parte.influencia} className={inp}>
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Interesse (1–5)</label>
          <select name="interesse" defaultValue={parte.interesse} className={inp}>
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Engajamento atual</label>
          <select name="engajamento_atual" defaultValue={parte.engajamento_atual} className={inp}>
            {NIVEIS.map((n) => <option key={n} value={n}>{ENGAJAMENTO_LABEL[n]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Engajamento desejado</label>
          <select name="engajamento_desejado" defaultValue={parte.engajamento_desejado} className={inp}>
            {NIVEIS.map((n) => <option key={n} value={n}>{ENGAJAMENTO_LABEL[n]}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <textarea name="estrategia" defaultValue={parte.estrategia ?? ""} rows={2}
            placeholder="Estratégia de engajamento…"
            className={`${inp} resize-none`} />
        </div>
      </div>
      {state?.error && <p className="text-xs text-status-red">{state.error}</p>}
      <div className="flex items-center gap-2">
        <SaveButton />
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary">Cancelar</button>
      </div>
    </form>
  );
}

export function ParteCard({ parte }: { parte: ParteInteressada }) {
  const [editing, setEditing] = useState(false);
  const [pending, start]      = useTransition();
  const gap = gapColor(parte.engajamento_atual, parte.engajamento_desejado);

  async function handleDelete() {
    if (!confirm(`Remover "${parte.nome}"?`)) return;
    start(async () => {
      const result = await deleteParteInteressada(parte.projeto_id, parte.id);
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <div className="group px-5 py-4 hover:bg-surface-input/40 transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar inicial */}
        <div className="w-9 h-9 rounded-full bg-navy-700 text-white flex items-center justify-center text-sm font-semibold shrink-0">
          {parte.nome.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {editing ? (
            <EditForm parte={parte} onCancel={() => setEditing(false)} />
          ) : (
            <>
              <div className="flex items-start gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{parte.nome}</p>
                  <p className="text-xs text-text-secondary">
                    {[parte.papel, parte.organizacao].filter(Boolean).join(" · ") || "—"}
                  </p>
                </div>
              </div>

              {/* Engajamento atual → desejado */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${ENGAJAMENTO_CLS[parte.engajamento_atual]}`}>
                  {ENGAJAMENTO_LABEL[parte.engajamento_atual]}
                </span>
                <IconArrowRight size={12} className={gap} />
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${ENGAJAMENTO_CLS[parte.engajamento_desejado]}`}>
                  {ENGAJAMENTO_LABEL[parte.engajamento_desejado]}
                </span>

                {/* Influência e Interesse */}
                <span className="ml-2 text-[11px] text-text-disabled">
                  Influência <strong className="text-text-primary">{parte.influencia}</strong>
                  {" · "}
                  Interesse <strong className="text-text-primary">{parte.interesse}</strong>
                </span>
              </div>

              {parte.estrategia && (
                <p className="text-xs text-text-secondary mt-2 italic border-l-2 border-surface-border pl-2">
                  {parte.estrategia}
                </p>
              )}

              {parte.contato && (
                <p className="text-xs text-text-disabled mt-1">{parte.contato}</p>
              )}
            </>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 text-text-disabled hover:text-text-primary transition-colors" title="Editar">
              <IconEdit size={15} />
            </button>
            <button onClick={handleDelete} disabled={pending} className="p-1.5 text-text-disabled hover:text-status-red transition-colors" title="Remover">
              <IconTrash size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
