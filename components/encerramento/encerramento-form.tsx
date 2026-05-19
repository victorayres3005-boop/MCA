"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { IconCircleCheck } from "@tabler/icons-react";
import type { Encerramento } from "@/lib/types";

interface EncerramentoFormProps {
  action:       (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
  encerramento: Encerramento | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="flex items-center gap-2 px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors">
      <IconCircleCheck size={14} />
      {pending ? "Salvando…" : "Salvar encerramento"}
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

export function EncerramentoForm({ action, encerramento: enc }: EncerramentoFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [aceite, setAceite] = useState(enc?.aceite_formal ?? false);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else toast.success("Encerramento salvo.");
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">

      {/* Aceite formal */}
      <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
        aceite ? "border-green-300 bg-green-50" : "border-surface-border bg-surface-page/30"
      }`}>
        <button
          type="button"
          onClick={() => setAceite((v) => !v)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
            aceite
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-surface-input border border-surface-border text-text-secondary hover:bg-white"
          }`}
        >
          <IconCircleCheck size={14} />
          {aceite ? "Aceite formal concedido" : "Conceder aceite formal"}
        </button>
        <input type="hidden" name="aceite_formal" value={aceite ? "true" : "false"} />
        {aceite && (
          <div className="flex items-center gap-3 flex-1">
            <div className="w-[200px]">
              <Field label="Aceito por">
                <input name="aceito_por" defaultValue={enc?.aceito_por ?? ""} placeholder="Nome do responsável" className={inp} />
              </Field>
            </div>
            <div className="w-[140px]">
              <Field label="Data de encerramento">
                <input name="data_encerramento" type="date" defaultValue={enc?.data_encerramento ?? new Date().toISOString().slice(0, 10)} className={inp} />
              </Field>
            </div>
          </div>
        )}
        {!aceite && (
          <>
            <input type="hidden" name="aceito_por" value={enc?.aceito_por ?? ""} />
            <input type="hidden" name="data_encerramento" value={enc?.data_encerramento ?? ""} />
          </>
        )}
      </div>

      {/* Lições aprendidas */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Pontos Positivos">
          <textarea name="pontos_positivos" rows={4}
            defaultValue={enc?.pontos_positivos ?? ""}
            placeholder="O que funcionou bem no projeto…" className={textarea} />
        </Field>
        <Field label="Pontos de Melhoria">
          <textarea name="pontos_melhoria" rows={4}
            defaultValue={enc?.pontos_melhoria ?? ""}
            placeholder="O que pode ser melhorado nos próximos projetos…" className={textarea} />
        </Field>
      </div>

      <Field label="Lições Aprendidas">
        <textarea name="licoes_aprendidas" rows={4}
          defaultValue={enc?.licoes_aprendidas ?? ""}
          placeholder="Conhecimento gerado durante o projeto que deve ser replicado…" className={textarea} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Pendências">
          <textarea name="pendencias" rows={3}
            defaultValue={enc?.pendencias ?? ""}
            placeholder="Itens ainda em aberto ou que demandam acompanhamento…" className={textarea} />
        </Field>
        <Field label="Observações Gerais">
          <textarea name="observacoes" rows={3}
            defaultValue={enc?.observacoes ?? ""}
            placeholder="Informações adicionais sobre o encerramento…" className={textarea} />
        </Field>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
