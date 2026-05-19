"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

interface AddAtaFormProps {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors whitespace-nowrap">
      {pending ? "Registrando…" : "Registrar ata"}
    </button>
  );
}

const inp = "w-full px-2.5 py-1.5 text-[12px] bg-surface-input border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary placeholder:text-text-disabled";
const textarea = `${inp} resize-none`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <label className="block text-[10px] font-semibold text-text-disabled uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

export function AddAtaForm({ action }: AddAtaFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {/* Linha 1: título | data | local */}
      <div className="grid grid-cols-[1fr_130px_160px] gap-3">
        <Field label="Título *">
          <input name="titulo" required placeholder="Ex: Reunião de Kick-off, Reunião de Progresso…" className={inp} />
        </Field>
        <Field label="Data da Reunião *">
          <input name="data_reuniao" type="date" required className={inp}
            defaultValue={new Date().toISOString().slice(0, 10)} />
        </Field>
        <Field label="Local">
          <input name="local_reuniao" placeholder="Ex: Escritório, Teams…" className={inp} />
        </Field>
      </div>

      {/* Linha 2: participantes */}
      <Field label="Participantes">
        <input name="participantes" placeholder="Nome 1, Nome 2, Nome 3…" className={inp} />
      </Field>

      {/* Linha 3: pauta | decisões */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pauta">
          <textarea name="pauta" rows={3} placeholder="Tópicos discutidos na reunião…" className={textarea} />
        </Field>
        <Field label="Decisões">
          <textarea name="decisoes" rows={3} placeholder="Decisões tomadas durante a reunião…" className={textarea} />
        </Field>
      </div>

      {/* Linha 4: encaminhamentos | observações | botão */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Encaminhamentos">
          <textarea name="encaminhamentos" rows={3} placeholder="Ações definidas, responsáveis e prazos…" className={textarea} />
        </Field>
        <div className="flex flex-col gap-3">
          <Field label="Observações">
            <textarea name="observacoes" rows={2} placeholder="Informações adicionais…" className={textarea} />
          </Field>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </div>
      </div>
    </form>
  );
}
