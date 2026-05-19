"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import type { Contratada } from "@/lib/types";

const STATUS_OPTS = [
  { value: "planejado", label: "Planejado" },
  { value: "ativo",     label: "Ativo"     },
  { value: "suspenso",  label: "Suspenso"  },
  { value: "encerrado", label: "Encerrado" },
];

interface AddAquisicaoFormProps {
  action:      (prev: unknown, formData: FormData) => Promise<{ error?: string }>;
  contratadas: Contratada[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-medium rounded-md transition-colors whitespace-nowrap">
      {pending ? "Adicionando…" : "Adicionar contrato"}
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

export function AddAquisicaoForm({ action, contratadas }: AddAquisicaoFormProps) {
  const [state, formAction] = useFormState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    if (state.error) toast.error(state.error);
    else formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {/* Linha 1: contratada | objeto */}
      <div className="grid grid-cols-[220px_1fr] gap-3">
        <Field label="Contratada">
          <select name="contratada_id" className={inp}>
            <option value="">Sem vínculo</option>
            {contratadas.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </Field>
        <Field label="Objeto / Descrição *">
          <input name="objeto" required placeholder="Ex: Execução de fundações, Fornecimento de aço…" className={inp} />
        </Field>
      </div>

      {/* Linha 2: nº contrato | valor | início | fim | status */}
      <div className="grid grid-cols-5 gap-3">
        <Field label="Nº Contrato">
          <input name="numero_contrato" placeholder="CT-2026-001" className={inp} />
        </Field>
        <Field label="Valor (R$)">
          <input name="valor_contrato" type="number" step="0.01" min="0" defaultValue="0" className={inp} />
        </Field>
        <Field label="Início">
          <input name="data_inicio" type="date" className={inp} />
        </Field>
        <Field label="Fim previsto">
          <input name="data_fim_prevista" type="date" className={inp} />
        </Field>
        <Field label="Status">
          <select name="status" defaultValue="ativo" className={inp}>
            {STATUS_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
      </div>

      {/* Linha 3: avaliação | observação | botão */}
      <div className="flex items-end gap-3">
        <Field label="Avaliação (1–5)">
          <select name="avaliacao" defaultValue="" className={`${inp} w-32`}>
            <option value="">—</option>
            {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
        </Field>
        <div className="flex-1">
          <Field label="Observação">
            <input name="observacao" placeholder="Opcional" className={inp} />
          </Field>
        </div>
        <div className="shrink-0 pb-0.5">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
