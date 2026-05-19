"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

const STATUS_OPTS = [
  { value: "rascunho",   label: "Rascunho"   },
  { value: "em_analise", label: "Em análise"  },
  { value: "aprovada",   label: "Aprovada"    },
];

interface AddMudancaFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
  nextNumero: string;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors whitespace-nowrap">
      {pending ? "Registrando…" : "Registrar mudança"}
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

export function AddMudancaForm({ action, nextNumero }: AddMudancaFormProps) {
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
      <div className="grid grid-cols-[120px_1fr] gap-3">
        <Field label="Número">
          <input name="numero" defaultValue={nextNumero} placeholder="M-001" className={inp} />
        </Field>
        <Field label="Título *">
          <input name="titulo" required placeholder="Ex: Alteração de fundação, Ampliação de prazo…" className={inp} />
        </Field>
      </div>

      {/* Linha 2: solicitante | data | status */}
      <div className="grid grid-cols-3 gap-3">
        <Field label="Solicitante">
          <input name="solicitante" placeholder="Nome ou cargo" className={inp} />
        </Field>
        <Field label="Data">
          <input name="data_solicitacao" type="date" className={inp}
            defaultValue={new Date().toISOString().slice(0, 10)} />
        </Field>
        <Field label="Status inicial">
          <select name="status" defaultValue="em_analise" className={inp}>
            {STATUS_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
      </div>

      {/* Linha 3: impacto prazo | impacto custo | impacto escopo */}
      <div className="grid grid-cols-[110px_130px_1fr] gap-3">
        <Field label="Impacto Prazo (dias)">
          <input name="impacto_prazo" type="number" placeholder="+30 ou -5" className={inp} />
        </Field>
        <Field label="Impacto Custo (R$)">
          <input name="impacto_custo" type="number" step="0.01" placeholder="+50000 ou -2000" className={inp} />
        </Field>
        <Field label="Impacto no Escopo">
          <input name="impacto_escopo" placeholder="Descrição das alterações no escopo" className={inp} />
        </Field>
      </div>

      {/* Linha 4: descrição | justificativa | botão */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Field label="Descrição">
            <input name="descricao" placeholder="Detalhamento da mudança solicitada" className={inp} />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="Justificativa">
            <input name="justificativa" placeholder="Por que a mudança é necessária?" className={inp} />
          </Field>
        </div>
        <div className="shrink-0 pb-0.5">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
