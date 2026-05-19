"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { IconTrash, IconLoader2 } from "@tabler/icons-react";
import type { Cliente, Setor } from "@/lib/types";

const SETORES: { value: Setor; label: string }[] = [
  { value: "industria",      label: "Indústria"      },
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "energia",        label: "Energia"        },
  { value: "mineracao",      label: "Mineração"      },
  { value: "agronegocio",    label: "Agronegócio"    },
  { value: "saneamento",     label: "Saneamento"     },
  { value: "outro",          label: "Outro"          },
];

interface ClienteFormProps {
  action: (formData: FormData) => Promise<{ error: string } | void>;
  deleteAction?: () => Promise<{ error: string } | void>;
  defaultValues?: Partial<Cliente>;
}

export function ClienteForm({ action, deleteAction, defaultValues }: ClienteFormProps) {
  const [isPending,  startTransition]  = useTransition();
  const [isDeleting, startDelTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
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
    if (!deleteAction || !confirm("Excluir este cliente? Esta ação não pode ser desfeita.")) return;
    startDelTransition(async () => {
      const res = await deleteAction();
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card principal */}
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
          <Field label="Setor">
            <select name="setor" defaultValue={defaultValues?.setor ?? ""} className={inputCls}>
              <option value="">Selecione…</option>
              {SETORES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Card contato */}
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

      {/* Status (só na edição) */}
      {isEdit && (
        <div className="bg-white border border-surface-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4">Status</h2>
          <select name="ativo" defaultValue={String(defaultValues?.ativo ?? true)} className={`${inputCls} max-w-[200px]`}>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      )}

      {error && (
        <p className="text-sm text-status-red bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      {/* Ações */}
      <div className="flex items-center justify-between">
        {isEdit && deleteAction ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 text-sm text-status-red hover:bg-red-50 border border-red-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? <IconLoader2 size={16} className="animate-spin" /> : <IconTrash size={16} />}
            Excluir cliente
          </button>
        ) : <span />}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {isPending && <IconLoader2 size={16} className="animate-spin" />}
          {isEdit ? "Salvar alterações" : "Cadastrar cliente"}
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
