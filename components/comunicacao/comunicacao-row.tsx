"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconTrash, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteComunicacao, updateComunicacao } from "@/app/actions/comunicacao";
import type { Comunicacao, TipoComunicacao, FrequenciaComunicacao, MeioComunicacao } from "@/lib/types";

export const COM_COLS = "1fr 90px 140px 110px 110px 120px 36px";

export const TIPO_LABEL: Record<TipoComunicacao, string> = {
  reuniao:      "Reunião",
  relatorio:    "Relatório",
  email:        "E-mail",
  apresentacao: "Apresentação",
  outro:        "Outro",
};

export const FREQUENCIA_LABEL: Record<FrequenciaComunicacao, string> = {
  diaria:       "Diária",
  semanal:      "Semanal",
  quinzenal:    "Quinzenal",
  mensal:       "Mensal",
  bimestral:    "Bimestral",
  trimestral:   "Trimestral",
  sob_demanda:  "Sob demanda",
};

export const MEIO_LABEL: Record<MeioComunicacao, string> = {
  email:               "E-mail",
  reuniao_presencial:  "Reunião presencial",
  videoconferencia:    "Videoconferência",
  whatsapp:            "WhatsApp",
  sistema:             "Sistema",
  outro:               "Outro",
};

const TIPOS       = Object.keys(TIPO_LABEL)       as TipoComunicacao[];
const FREQUENCIAS = Object.keys(FREQUENCIA_LABEL) as FrequenciaComunicacao[];
const MEIOS       = Object.keys(MEIO_LABEL)       as MeioComunicacao[];

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="p-1 text-brand-500 hover:text-brand-700 disabled:opacity-50">
      <IconCheck size={15} />
    </button>
  );
}

function EditRow({ c, onCancel }: { c: Comunicacao; onCancel: () => void }) {
  const action = updateComunicacao.bind(null, c.projeto_id, c.id);
  const [state, formAction] = useFormState(action, null);
  if (state && !state.error) onCancel();

  const cell = "px-2 py-1 text-xs bg-surface-input border border-surface-border rounded focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary w-full";

  return (
    <div className="bg-brand-50/40 border-b border-[#E9EBF0] last:border-0 px-4 py-2">
      <form action={formAction} className="grid grid-cols-6 gap-2 items-end">
        <input name="assunto" defaultValue={c.assunto} required placeholder="Assunto" className={cell} />
        <select name="tipo" defaultValue={c.tipo} className={cell}>
          {TIPOS.map((t) => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
        </select>
        <input name="destinatarios" defaultValue={c.destinatarios} required placeholder="Destinatários" className={cell} />
        <input name="responsavel" defaultValue={c.responsavel ?? ""} placeholder="Responsável" className={cell} />
        <select name="frequencia" defaultValue={c.frequencia} className={cell}>
          {FREQUENCIAS.map((f) => <option key={f} value={f}>{FREQUENCIA_LABEL[f]}</option>)}
        </select>
        <select name="meio" defaultValue={c.meio} className={cell}>
          {MEIOS.map((m) => <option key={m} value={m}>{MEIO_LABEL[m]}</option>)}
        </select>
        <input name="observacao" defaultValue={c.observacao ?? ""} placeholder="Obs." className={`${cell} col-span-5`} />
        <div className="flex gap-1 justify-end">
          <SaveButton />
          <button type="button" onClick={onCancel} className="p-1 text-text-disabled hover:text-text-primary">
            <IconX size={15} />
          </button>
        </div>
      </form>
      {state?.error && <p className="text-xs text-status-red mt-1">{state.error}</p>}
    </div>
  );
}

export function ComunicacaoRow({ c }: { c: Comunicacao }) {
  const [editing, setEditing] = useState(false);
  const [pending, start]      = useTransition();

  async function handleDelete() {
    if (!confirm(`Remover "${c.assunto}"?`)) return;
    start(async () => {
      const result = await deleteComunicacao(c.projeto_id, c.id);
      if (result.error) toast.error(result.error);
    });
  }

  if (editing) return <EditRow c={c} onCancel={() => setEditing(false)} />;

  return (
    <div
      className="group grid items-center gap-3 px-4 py-2.5 border-b border-[#E9EBF0] last:border-0 hover:bg-surface-input/40 transition-colors"
      style={{ gridTemplateColumns: COM_COLS }}
    >
      <span className="text-[12px] font-medium text-text-primary truncate">{c.assunto}</span>
      <span className="text-[11px] text-text-secondary">{TIPO_LABEL[c.tipo]}</span>
      <span className="text-[11px] text-text-secondary truncate">{c.destinatarios}</span>
      <span className="text-[11px] text-text-secondary truncate">{c.responsavel ?? "—"}</span>
      <span className="text-[11px] text-text-secondary">{FREQUENCIA_LABEL[c.frequencia]}</span>
      <span className="text-[11px] text-text-secondary">{MEIO_LABEL[c.meio]}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} className="p-1 text-text-disabled hover:text-text-primary" title="Editar">
          <IconEdit size={14} />
        </button>
        <button onClick={handleDelete} disabled={pending} className="p-1 text-text-disabled hover:text-status-red" title="Remover">
          <IconTrash size={14} />
        </button>
      </div>
    </div>
  );
}
