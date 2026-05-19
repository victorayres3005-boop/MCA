"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import type { Profile } from "@/lib/types";

const ROLE_LABEL: Record<string, string> = {
  admin:       "Administrador",
  gerente:     "Gerente",
  analista:    "Analista",
  visualizador: "Visualizador",
};

const ROLE_CLS: Record<string, string> = {
  admin:       "bg-purple-50 text-purple-700 border-purple-200",
  gerente:     "bg-blue-50 text-blue-700 border-blue-100",
  analista:    "bg-teal-50 text-teal-700 border-teal-200",
  visualizador:"bg-gray-100 text-gray-500 border-gray-200",
};

interface ProfileFormProps {
  profile: Profile;
  action:  (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors">
      {pending ? "Salvando…" : "Salvar perfil"}
    </button>
  );
}

const inp = "w-full px-2.5 py-1.5 text-[12px] bg-surface-input border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled";

export function ProfileForm({ profile, action }: ProfileFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else toast.success("Perfil atualizado.");
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b border-surface-border">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-[18px] font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #00B4A6, #007A73)" }}>
          {profile.nome?.[0]?.toUpperCase() ?? profile.email[0].toUpperCase()}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-text-primary">{profile.nome || profile.email}</p>
          <p className="text-[12px] text-text-disabled">{profile.email}</p>
          <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${ROLE_CLS[profile.role]}`}>
            {ROLE_LABEL[profile.role]}
          </span>
        </div>
      </div>

      <div className="space-y-0.5">
        <label className="block text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Nome</label>
        <input name="nome" defaultValue={profile.nome ?? ""} placeholder="Seu nome completo" className={inp} />
      </div>

      <div className="space-y-0.5">
        <label className="block text-[10px] font-semibold text-text-disabled uppercase tracking-wider">E-mail</label>
        <input value={profile.email} readOnly className={`${inp} opacity-60 cursor-not-allowed`} />
        <p className="text-[10px] text-text-disabled">O e-mail não pode ser alterado aqui.</p>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
