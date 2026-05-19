"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconTrash, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteComunicacao, updateComunicacao } from "@/app/actions/comunicacao";
import type { Comunicacao, TipoComunicacao, FrequenciaComunicacao, MeioComunicacao } from "@/lib/types";

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

const TIPOS      = Object.keys(TIPO_LABEL)      as TipoComunicacao[];
const FREQUENCIAS = Object.keys(FREQUENCIA_LABEL) as FrequenciaComunicacao[];
const MEIOS      = Object.keys(MEIO_LABEL)      as MeioComunicacao[];

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
    <tr className="bg-brand-50/40">
      <td className="px-4 py-2" colSpan={6}>
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
      </td>
    </tr>
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
    <tr className="group hover:bg-surface-input/40 transition-colors">
      <td className="px-4 py-3 text-sm text-text-primary font-medium">{c.assunto}</td>
      <td className="px-4 py-3 text-xs text-text-secondary">{TIPO_LABEL[c.tipo]}</td>
      <td className="px-4 py-3 text-xs text-text-secondary">{c.destinatarios}</td>
      <td className="px-4 py-3 text-xs text-text-secondary">{c.responsavel ?? "—"}</td>
      <td className="px-4 py-3 text-xs text-text-secondary">{FREQUENCIA_LABEL[c.frequencia]}</td>
      <td className="px-4 py-3 text-xs text-text-secondary">{MEIO_LABEL[c.meio]}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="p-1 text-text-disabled hover:text-text-primary" title="Editar">
            <IconEdit size={14} />
          </button>
          <button onClick={handleDelete} disabled={pending} className="p-1 text-text-disabled hover:text-status-red" title="Remover">
            <IconTrash size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
