"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

interface OrgFormProps {
  orgNome: string;
  action:  (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
  canEdit: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors">
      {pending ? "Salvando…" : "Salvar organização"}
    </button>
  );
}

const inp = "w-full px-2.5 py-1.5 text-[12px] bg-surface-input border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled";

export function OrgForm({ orgNome, action, canEdit }: OrgFormProps) {
  const [state, formAction] = useFormState(action, null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else toast.success("Organização atualizada.");
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-0.5">
        <label className="block text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Nome da Organização</label>
        <input name="nome" defaultValue={orgNome} readOnly={!canEdit}
          className={`${inp} ${!canEdit ? "opacity-60 cursor-not-allowed" : ""}`} />
        {!canEdit && <p className="text-[10px] text-text-disabled">Apenas administradores podem alterar o nome da organização.</p>}
      </div>

      {canEdit && (
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      )}
    </form>
  );
}
