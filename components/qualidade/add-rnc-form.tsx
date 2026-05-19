"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

const CATEGORIA_OPTS = [
  { value: "tecnica",    label: "Técnica"    },
  { value: "seguranca",  label: "Segurança"  },
  { value: "documental", label: "Documental" },
  { value: "ambiental",  label: "Ambiental"  },
  { value: "outro",      label: "Outro"      },
];

const STATUS_OPTS = [
  { value: "aberta",        label: "Aberta"         },
  { value: "em_tratamento", label: "Em tratamento"  },
];

interface AddRNCFormProps {
  action:     (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
  nextNumero: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors whitespace-nowrap">
      {pending ? "Registrando…" : "Registrar RNC"}
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

export function AddRNCForm({ action, nextNumero }: AddRNCFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {/* Linha 1: número | título */}
      <div className="grid grid-cols-[110px_1fr] gap-3">
        <Field label="Número">
          <input name="numero" defaultValue={nextNumero} className={inp} />
        </Field>
        <Field label="Título *">
          <input name="titulo" required placeholder="Ex: Concreto fora da especificação, Falta de EPI…" className={inp} />
        </Field>
      </div>

      {/* Linha 2: categoria | responsável | data | status */}
      <div className="grid grid-cols-4 gap-3">
        <Field label="Categoria">
          <select name="categoria" defaultValue="tecnica" className={inp}>
            {CATEGORIA_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Responsável">
          <input name="responsavel" placeholder="Nome" className={inp} />
        </Field>
        <Field label="Data de abertura">
          <input name="data_abertura" type="date" className={inp}
            defaultValue={new Date().toISOString().slice(0, 10)} />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue="aberta" className={inp}>
            {STATUS_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>

      {/* Linha 3: descrição | ação corretiva | botão */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Field label="Descrição">
            <input name="descricao" placeholder="Detalhamento da não conformidade" className={inp} />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="Ação Corretiva">
            <input name="acao_corretiva" placeholder="Medidas para resolução" className={inp} />
          </Field>
        </div>
        <div className="shrink-0 pb-0.5">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
