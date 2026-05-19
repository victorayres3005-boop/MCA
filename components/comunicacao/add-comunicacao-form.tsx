"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  TIPO_LABEL, FREQUENCIA_LABEL, MEIO_LABEL,
} from "./comunicacao-row";
import type { TipoComunicacao, FrequenciaComunicacao, MeioComunicacao } from "@/lib/types";

const TIPOS       = Object.keys(TIPO_LABEL)       as TipoComunicacao[];
const FREQUENCIAS = Object.keys(FREQUENCIA_LABEL) as FrequenciaComunicacao[];
const MEIOS       = Object.keys(MEIO_LABEL)       as MeioComunicacao[];

interface AddComunicacaoFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors whitespace-nowrap">
      {pending ? "Adicionando…" : "Adicionar"}
    </button>
  );
}

const inp = "w-full px-2.5 py-1.5 text-[12px] bg-surface-input border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <label className="block text-[10px] font-semibold text-text-disabled uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export function AddComunicacaoForm({ action }: AddComunicacaoFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {/* Linha 1: assunto (full) */}
      <Field label="Assunto">
        <input name="assunto" required placeholder="Nome / assunto da comunicação" className={inp} />
      </Field>

      {/* Linha 2: tipo | destinatários | responsável */}
      <div className="grid grid-cols-3 gap-3">
        <Field label="Tipo">
          <select name="tipo" defaultValue="relatorio" className={inp}>
            {TIPOS.map((t) => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
          </select>
        </Field>
        <Field label="Destinatários">
          <input name="destinatarios" required placeholder="ex: cliente, equipe" className={inp} />
        </Field>
        <Field label="Responsável">
          <input name="responsavel" placeholder="Nome do responsável" className={inp} />
        </Field>
      </div>

      {/* Linha 3: frequência | meio | observação */}
      <div className="grid grid-cols-3 gap-3">
        <Field label="Frequência">
          <select name="frequencia" defaultValue="mensal" className={inp}>
            {FREQUENCIAS.map((f) => <option key={f} value={f}>{FREQUENCIA_LABEL[f]}</option>)}
          </select>
        </Field>
        <Field label="Meio">
          <select name="meio" defaultValue="email" className={inp}>
            {MEIOS.map((m) => <option key={m} value={m}>{MEIO_LABEL[m]}</option>)}
          </select>
        </Field>
        <Field label="Observação">
          <input name="observacao" placeholder="Opcional" className={inp} />
        </Field>
      </div>

      <div className="flex justify-end pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
