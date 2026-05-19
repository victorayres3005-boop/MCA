"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { IconMail, IconLoader2 } from "@tabler/icons-react";
import { inviteMember } from "@/app/actions/configuracoes";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 px-4 py-2 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-lg transition-colors flex items-center gap-1.5"
    >
      {pending ? <IconLoader2 size={13} className="animate-spin" /> : <IconMail size={13} />}
      {pending ? "Enviando…" : "Convidar"}
    </button>
  );
}

export function InviteForm() {
  const [state, formAction] = useFormState(inviteMember, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else {
      toast.success("Convite enviado com sucesso!");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex items-end gap-2">
      <div className="flex-1">
        <label className="block text-[11px] font-medium text-text-secondary mb-1">E-mail</label>
        <input
          name="email"
          type="email"
          required
          placeholder="colaborador@empresa.com"
          className="w-full px-3 py-2 text-[12px] bg-white border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled"
        />
      </div>
      <div className="w-[140px]">
        <label className="block text-[11px] font-medium text-text-secondary mb-1">Perfil</label>
        <select
          name="role"
          defaultValue="analista"
          className="w-full px-3 py-2 text-[12px] bg-white border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary"
        >
          <option value="gerente">Gerente</option>
          <option value="analista">Analista</option>
          <option value="visualizador">Visualizador</option>
        </select>
      </div>
      <SubmitBtn />
    </form>
  );
}
