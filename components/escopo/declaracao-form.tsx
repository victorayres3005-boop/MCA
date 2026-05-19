"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import type { Escopo } from "@/lib/types";

interface DeclaracaoFormProps {
  escopo:    Escopo | null;
  action:    (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

const CAMPOS = [
  {
    name:        "declaracao",
    label:       "Declaração de Escopo",
    placeholder: "Descreva o que está incluído no escopo do projeto…",
    rows:        5,
  },
  {
    name:        "exclusoes",
    label:       "Exclusões",
    placeholder: "Liste o que está explicitamente fora do escopo…",
    rows:        3,
  },
  {
    name:        "premissas",
    label:       "Premissas",
    placeholder: "Condições assumidas como verdadeiras para o planejamento…",
    rows:        3,
  },
  {
    name:        "restricoes",
    label:       "Restrições",
    placeholder: "Limitações que afetam a execução do projeto…",
    rows:        3,
  },
  {
    name:        "criterios_aceite",
    label:       "Critérios de Aceite",
    placeholder: "Condições que devem ser atendidas para aceite das entregas…",
    rows:        3,
  },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors"
    >
      {pending ? "Salvando…" : "Salvar escopo"}
    </button>
  );
}

export function DeclaracaoForm({ escopo, action }: DeclaracaoFormProps) {
  const [state, formAction] = useFormState(action, null);

  useEffect(() => {
    if (!state) return;
    if ("error" in state && state.error) {
      toast.error(state.error);
    } else {
      toast.success("Escopo salvo com sucesso.");
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {CAMPOS.map((campo) => (
        <div key={campo.name}>
          <label className="block text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">
            {campo.label}
          </label>
          <textarea
            name={campo.name}
            rows={campo.rows}
            placeholder={campo.placeholder}
            defaultValue={escopo?.[campo.name] ?? ""}
            className="w-full px-2.5 py-1.5 text-[12px] bg-surface-input border border-surface-border rounded-md text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-1 focus:ring-brand-500 resize-y"
          />
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
