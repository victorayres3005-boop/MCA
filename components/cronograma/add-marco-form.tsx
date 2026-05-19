"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

interface AddMarcoFormProps {
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
      {pending ? "Adicionando…" : "Adicionar marco"}
    </button>
  );
}

export function AddMarcoForm({ action }: AddMarcoFormProps) {
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
    <form ref={formRef} action={formAction}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
        <input
          name="nome"
          required
          placeholder="Nome do marco (ex: Fundação concluída)"
          className="px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled"
        />
        <input
          name="responsavel"
          placeholder="Responsável"
          className="px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled w-40"
        />
        <input
          name="data_prevista"
          type="date"
          required
          className="px-3 py-2.5 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        />
        <SubmitButton />
      </div>
    </form>
  );
}
