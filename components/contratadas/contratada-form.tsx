"use client";

import { useTransition, useState } from "react";
import { IconTrash, IconLoader2 } from "@tabler/icons-react";
import type { Contratada, TipoContratada } from "@/lib/types";

const TIPOS: { value: TipoContratada; label: string }[] = [
  { value: "construtora", label: "Construtora" },
  { value: "projetista",  label: "Projetista"  },
  { value: "fornecedor",  label: "Fornecedor"  },
  { value: "consultoria", label: "Consultoria" },
  { value: "outro",       label: "Outro"        },
];

interface ContratadaFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  deleteAction?: () => Promise<{ error: string } | void>;
  defaultValues?: Partial<Contratada>;
}

export function ContratadaForm({ action, deleteAction, defaultValues }: ContratadaFormProps) {
  const [isPending,  startTransition]    = useTransition();
  const [isDeleting, startDelTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!defaultValues?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) setError(res.error);
    });
  }

  async function handleDelete() {
    if (!deleteAction || !confirm("Excluir esta contratada? Esta ação não pode ser desfeita.")) return;
    startDelTransition(async () => {
      const res = await deleteAction();
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-surface-border rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Dados da empresa</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Nome da empresa *">
              <input name="nome" required defaultValue={defaultValues?.nome ?? ""} placeholder="Razão social" className={inputCls} />
            </Field>
          </div>
          <Field label="CNPJ">
            <input name="cnpj" defaultValue={defaultValues?.cnpj ?? ""} placeholder="00.000.000/0001-00" className={inputCls} />
          </Field>
          <Field label="Tipo *">
            <select name="tipo" required defaultValue={defaultValues?.tipo ?? ""} className={inputCls}>
              <option value="">Selecione…</option>
              {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="bg-white border border-surface-border rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Contato</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Nome do contato">
              <input name="contato_nome" defaultValue={defaultValues?.contato_nome ?? ""} placeholder="Nome do responsável" className={inputCls} />
            </Field>
          </div>
          <Field label="E-mail">
            <input name="contato_email" type="email" defaultValue={defaultValues?.contato_email ?? ""} placeholder="contato@empresa.com" className={inputCls} />
          </Field>
          <Field label="Telefone">
            <input name="contato_telefone" defaultValue={defaultValues?.contato_telefone ?? ""} placeholder="(00) 00000-0000" className={inputCls} />
          </Field>
        </div>
      </div>

      {isEdit && (
        <div className="bg-white border border-surface-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4">Status</h2>
          <select name="ativo" defaultValue={String(defaultValues?.ativo ?? true)} className={`${inputCls} max-w-[200px]`}>
            <option value="true">Ativa</option>
            <option value="false">Inativa</option>
          </select>
        </div>
      )}

      {error && (
        <p className="text-sm text-status-red bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex items-center justify-between">
        {isEdit && deleteAction ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 text-sm text-status-red hover:bg-red-50 border border-red-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? <IconLoader2 size={16} className="animate-spin" /> : <IconTrash size={16} />}
            Excluir contratada
          </button>
        ) : <span />}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {isPending && <IconLoader2 size={16} className="animate-spin" />}
          {isEdit ? "Salvar alterações" : "Cadastrar contratada"}
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
