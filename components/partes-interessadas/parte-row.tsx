"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconTrash, IconEdit, IconX, IconArrowRight } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteParteInteressada, updateParteInteressada } from "@/app/actions/partes-interessadas";
import type { ParteInteressada, NivelEngajamento } from "@/lib/types";

const NIVEIS: NivelEngajamento[] = ["desconhecido", "resistente", "neutro", "apoiador", "lider"];
const ESCALA = [1, 2, 3, 4, 5];

const ENGAJAMENTO_LABEL: Record<NivelEngajamento, string> = {
  desconhecido: "Desconhecido",
  resistente:   "Resistente",
  neutro:       "Neutro",
  apoiador:     "Apoiador",
  lider:        "Líder",
};

const ENGAJAMENTO_DOT: Record<NivelEngajamento, string> = {
  desconhecido: "bg-gray-300",
  resistente:   "bg-red-500",
  neutro:       "bg-amber-400",
  apoiador:     "bg-blue-500",
  lider:        "bg-green-500",
};

const ENGAJAMENTO_BADGE: Record<NivelEngajamento, string> = {
  desconhecido: "bg-surface-input text-text-disabled",
  resistente:   "bg-red-50 text-red-700",
  neutro:       "bg-amber-50 text-amber-700",
  apoiador:     "bg-blue-50 text-blue-700",
  lider:        "bg-green-50 text-green-700",
};

function gapIndicator(atual: NivelEngajamento, desejado: NivelEngajamento) {
  const idxA = NIVEIS.indexOf(atual);
  const idxD = NIVEIS.indexOf(desejado);
  if (idxA === idxD) return "text-green-500";
  if (idxA < idxD)   return "text-amber-500";
  return "text-red-500";
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

function EditRow({ parte, onCancel }: { parte: ParteInteressada; onCancel: () => void }) {
  const action = updateParteInteressada.bind(null, parte.projeto_id, parte.id);
  const [state, formAction] = useFormState(action, null);
  if (state && !state.error) onCancel();

  const inp = "px-2 py-1.5 text-[12px] bg-white border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary w-full";

  return (
    <div className="col-span-full bg-brand-50/30 px-4 py-3">
      <form action={formAction} className="space-y-2">
        <div className="grid grid-cols-[1fr_1fr_60px_60px_130px_130px] gap-2">
          <input name="nome" defaultValue={parte.nome} required placeholder="Nome" className={inp} />
          <div className="grid grid-cols-2 gap-2">
            <input name="papel" defaultValue={parte.papel ?? ""} placeholder="Papel" className={inp} />
            <input name="organizacao" defaultValue={parte.organizacao ?? ""} placeholder="Organização" className={inp} />
          </div>
          <select name="influencia" defaultValue={parte.influencia} className={inp}>
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <select name="interesse" defaultValue={parte.interesse} className={inp}>
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <select name="engajamento_atual" defaultValue={parte.engajamento_atual} className={inp}>
            {NIVEIS.map((n) => <option key={n} value={n}>{ENGAJAMENTO_LABEL[n]}</option>)}
          </select>
          <select name="engajamento_desejado" defaultValue={parte.engajamento_desejado} className={inp}>
            {NIVEIS.map((n) => <option key={n} value={n}>{ENGAJAMENTO_LABEL[n]}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <input name="contato" defaultValue={parte.contato ?? ""} placeholder="Contato" className={inp} />
          <textarea name="estrategia" defaultValue={parte.estrategia ?? ""} placeholder="Estratégia de engajamento" rows={1}
            className="px-2 py-1.5 text-[12px] bg-white border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary resize-none w-full" />
          <div className="flex items-center gap-1">
            <SaveBtn />
            <button type="button" onClick={onCancel}
              className="p-1.5 text-text-disabled hover:text-text-primary transition-colors">
              <IconX size={13} />
            </button>
          </div>
        </div>
      </form>
      {state?.error && <p className="text-[11px] text-red-600 mt-1">{state.error}</p>}
    </div>
  );
}

export function ParteRow({ parte }: { parte: ParteInteressada }) {
  const [editing, setEditing] = useState(false);
  const [pending, start]      = useTransition();
  const gap = gapIndicator(parte.engajamento_atual, parte.engajamento_desejado);

  async function handleDelete() {
    if (!confirm(`Remover "${parte.nome}"?`)) return;
    start(async () => {
      const r = await deleteParteInteressada(parte.projeto_id, parte.id);
      if (r.error) toast.error(r.error);
    });
  }

  if (editing) return <EditRow parte={parte} onCancel={() => setEditing(false)} />;

  return (
    <div className="group grid grid-cols-[200px_1fr_70px_70px_160px_80px_32px] items-center gap-3 px-4 py-3 hover:bg-surface-input/40 transition-colors">
      {/* nome + avatar */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-full bg-navy-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
          {parte.nome.charAt(0).toUpperCase()}
        </div>
        <span className="text-[13px] font-medium text-text-primary truncate">{parte.nome}</span>
      </div>

      {/* papel / org */}
      <span className="text-[12px] text-text-secondary truncate">
        {[parte.papel, parte.organizacao].filter(Boolean).join(" · ") || "—"}
      </span>

      {/* influência */}
      <div className="flex justify-center">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold tabular-nums ${
          parte.influencia >= 4 ? "bg-navy-700/10 text-navy-700" : "bg-surface-input text-text-secondary"
        }`}>{parte.influencia}</span>
      </div>

      {/* interesse */}
      <div className="flex justify-center">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold tabular-nums ${
          parte.interesse >= 4 ? "bg-brand-50 text-brand-700" : "bg-surface-input text-text-secondary"
        }`}>{parte.interesse}</span>
      </div>

      {/* engajamento atual → desejado */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${ENGAJAMENTO_BADGE[parte.engajamento_atual]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${ENGAJAMENTO_DOT[parte.engajamento_atual]}`} />
          {ENGAJAMENTO_LABEL[parte.engajamento_atual]}
        </span>
        <IconArrowRight size={10} className={`shrink-0 ${gap}`} />
        <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${ENGAJAMENTO_BADGE[parte.engajamento_desejado]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${ENGAJAMENTO_DOT[parte.engajamento_desejado]}`} />
          {ENGAJAMENTO_LABEL[parte.engajamento_desejado]}
        </span>
      </div>

      {/* contato */}
      <span className="text-[11px] text-text-disabled truncate">{parte.contato ?? "—"}</span>

      {/* ações */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} title="Editar"
          className="p-1 text-text-disabled hover:text-text-primary transition-colors">
          <IconEdit size={13} />
        </button>
        <button onClick={handleDelete} disabled={pending} title="Remover"
          className="p-1 text-text-disabled hover:text-red-600 transition-colors">
          <IconTrash size={13} />
        </button>
      </div>
    </div>
  );
}
