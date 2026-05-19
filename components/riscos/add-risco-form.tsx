"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import type { CategoriaRisco } from "@/lib/types";

const CATEGORIAS: { value: CategoriaRisco; label: string }[] = [
  { value: "tecnico",        label: "Técnico"        },
  { value: "externo",        label: "Externo"        },
  { value: "organizacional", label: "Organizacional" },
  { value: "cronograma",     label: "Cronograma"     },
  { value: "custo",          label: "Custo"          },
  { value: "outro",          label: "Outro"          },
];

const ESCALA = [1, 2, 3, 4, 5];

interface AddRiscoFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
    >
      {pending ? "Adicionando…" : "Adicionar risco"}
    </button>
  );
}

export function AddRiscoForm({ action }: AddRiscoFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) {
      toast.error(state.error);
    } else {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <textarea
        name="descricao"
        required
        rows={2}
        placeholder="Descreva o risco identificado…"
        className="w-full px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled resize-none"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <select
          name="categoria"
          defaultValue="tecnico"
          className="px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        >
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <input
          name="responsavel"
          placeholder="Responsável"
          className="px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled"
        />

        <div>
          <label className="block text-xs text-text-disabled mb-1">Probabilidade (1–5)</label>
          <select
            name="probabilidade"
            defaultValue="1"
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
          >
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-text-disabled mb-1">Impacto (1–5)</label>
          <select
            name="impacto"
            defaultValue="1"
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
          >
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <textarea
        name="plano_resposta"
        rows={2}
        placeholder="Plano de resposta (opcional)…"
        className="w-full px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled resize-none"
      />

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
