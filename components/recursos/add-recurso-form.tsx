"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

const TIPO_OPTS = [
  { value: "interno",    label: "Interno"    },
  { value: "externo",    label: "Externo"    },
  { value: "contratado", label: "Contratado" },
];

interface AddRecursoFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors whitespace-nowrap">
      {pending ? "Adicionando…" : "Adicionar recurso"}
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

export function AddRecursoForm({ action }: AddRecursoFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {/* Linha 1: nome | papel | tipo | dedicação */}
      <div className="grid grid-cols-[1fr_1fr_110px_90px] gap-3">
        <Field label="Nome *">
          <input name="nome" required placeholder="Ex: João Silva" className={inp} />
        </Field>
        <Field label="Papel / Cargo">
          <input name="papel" placeholder="Ex: Engenheiro de Obras" className={inp} />
        </Field>
        <Field label="Tipo">
          <select name="tipo" defaultValue="interno" className={inp}>
            {TIPO_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Dedicação %">
          <input name="dedicacao" type="number" min="0" max="100" defaultValue="100" className={inp} />
        </Field>
      </div>

      {/* Linha 2: início | fim | obs | botão */}
      <div className="flex items-end gap-3">
        <div className="w-[130px]">
          <Field label="Data de Início">
            <input name="data_inicio" type="date" className={inp} />
          </Field>
        </div>
        <div className="w-[130px]">
          <Field label="Data de Saída">
            <input name="data_fim" type="date" className={inp} />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="Observação">
            <input name="observacao" placeholder="Informação adicional" className={inp} />
          </Field>
        </div>
        <div className="shrink-0 pb-0.5">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
