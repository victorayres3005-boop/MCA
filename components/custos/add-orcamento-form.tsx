"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import type { CategoriaOrcamento } from "@/lib/types";

const CATEGORIAS: { value: CategoriaOrcamento; label: string }[] = [
  { value: "material",    label: "Material"    },
  { value: "mao_de_obra", label: "Mão de obra" },
  { value: "equipamento", label: "Equipamento" },
  { value: "servico",     label: "Serviço"     },
  { value: "outro",       label: "Outro"       },
];

interface AddOrcamentoFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
    >
      {pending ? "Adicionando…" : "Adicionar item"}
    </button>
  );
}

export function AddOrcamentoForm({ action }: AddOrcamentoFormProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="descricao"
          required
          placeholder="Descrição do item (ex: Concreto usinado)"
          className="sm:col-span-2 px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled"
        />
        <select
          name="categoria"
          defaultValue="material"
          className="px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        >
          {CATEGORIAS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <input
          name="data_referencia"
          type="date"
          className="px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-disabled">R$</span>
          <input
            name="valor_planejado"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0,00"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-disabled">R$</span>
          <input
            name="valor_realizado"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00 (realizado)"
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
