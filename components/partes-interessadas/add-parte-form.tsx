"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ENGAJAMENTO_LABEL } from "./parte-card";
import type { NivelEngajamento } from "@/lib/types";

const NIVEIS: NivelEngajamento[] = ["desconhecido", "resistente", "neutro", "apoiador", "lider"];
const ESCALA = [1, 2, 3, 4, 5];

interface AddParteFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors">
      {pending ? "Adicionando…" : "Adicionar parte interessada"}
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

export function AddParteForm({ action }: AddParteFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {/* Linha 1: nome | organização | papel | contato */}
      <div className="grid grid-cols-4 gap-3">
        <Field label="Nome *">
          <input name="nome" required placeholder="Nome completo" className={inp} />
        </Field>
        <Field label="Organização">
          <input name="organizacao" placeholder="Empresa / órgão" className={inp} />
        </Field>
        <Field label="Papel / cargo">
          <input name="papel" placeholder="Ex: Diretor, Fiscal" className={inp} />
        </Field>
        <Field label="Contato">
          <input name="contato" placeholder="E-mail ou telefone" className={inp} />
        </Field>
      </div>

      {/* Linha 2: influência | interesse | eng. atual | eng. desejado */}
      <div className="grid grid-cols-4 gap-3">
        <Field label="Influência (1–5)">
          <select name="influencia" defaultValue="3" className={inp}>
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
        <Field label="Interesse (1–5)">
          <select name="interesse" defaultValue="3" className={inp}>
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </Field>
        <Field label="Engajamento atual">
          <select name="engajamento_atual" defaultValue="neutro" className={inp}>
            {NIVEIS.map((n) => <option key={n} value={n}>{ENGAJAMENTO_LABEL[n]}</option>)}
          </select>
        </Field>
        <Field label="Engajamento desejado">
          <select name="engajamento_desejado" defaultValue="apoiador" className={inp}>
            {NIVEIS.map((n) => <option key={n} value={n}>{ENGAJAMENTO_LABEL[n]}</option>)}
          </select>
        </Field>
      </div>

      {/* Linha 3: estratégia + botão */}
      <div className="flex items-end gap-3">
        <Field label="Estratégia de engajamento">
          <input name="estrategia" placeholder="Como engajar esta parte interessada…" className={inp} />
        </Field>
        <div className="shrink-0 pb-0.5">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
