"use client";

import { useTransition, useState } from "react";
import { IconTrash, IconLoader2 } from "@tabler/icons-react";
import type { Cliente, Projeto, StatusProjeto, TipoObra, Semaforo } from "@/lib/types";

const TIPOS_OBRA: { value: TipoObra; label: string }[] = [
  { value: "industrial",     label: "Industrial"     },
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "energia",        label: "Energia"        },
  { value: "edificacao",     label: "Edificação"     },
  { value: "saneamento",     label: "Saneamento"     },
  { value: "outro",          label: "Outro"          },
];

const STATUS_OPTS: { value: StatusProjeto; label: string }[] = [
  { value: "planejamento",  label: "Planejamento"  },
  { value: "execucao",      label: "Execução"      },
  { value: "monitoramento", label: "Monitoramento" },
  { value: "encerrado",     label: "Encerrado"     },
  { value: "suspenso",      label: "Suspenso"      },
];

const SEMAFOROS: { value: Semaforo; label: string; dot: string }[] = [
  { value: "verde",    label: "No prazo",   dot: "bg-status-green"  },
  { value: "amarelo",  label: "Em atenção", dot: "bg-status-yellow" },
  { value: "vermelho", label: "Em risco",   dot: "bg-status-red"    },
];

interface ProjetoFormProps {
  action:        (formData: FormData) => Promise<{ error: string } | void>;
  deleteAction?: () => Promise<{ error: string } | void>;
  defaultValues?: Partial<Projeto>;
  clientes:      Cliente[];
}

export function ProjetoForm({ action, deleteAction, defaultValues, clientes }: ProjetoFormProps) {
  const [isPending,  startTransition]    = useTransition();
  const [isDeleting, startDelTransition] = useTransition();
  const [error,      setError]           = useState<string | null>(null);
  const [semaforo,   setSemaforo]        = useState<Semaforo>(defaultValues?.semaforo ?? "verde");
  const isEdit = !!defaultValues?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("semaforo", semaforo);
    startTransition(async () => {
      const res = await action(fd);
      if (res?.error) setError(res.error);
    });
  }

  async function handleDelete() {
    if (!deleteAction || !confirm("Excluir este projeto? Esta ação não pode ser desfeita.")) return;
    startDelTransition(async () => {
      const res = await deleteAction();
      if (res?.error) setError(res.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Identificação */}
      <div className="bg-white border border-surface-border rounded-xl p-6 space-y-5">
        <h2 className={sectionTitle}>Identificação</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-3">
            <Field label="Nome do projeto *">
              <input name="nome" required defaultValue={defaultValues?.nome ?? ""} placeholder="Nome da obra ou projeto" className={inputCls} />
            </Field>
          </div>
          <Field label="Código">
            <input name="codigo" defaultValue={defaultValues?.codigo ?? ""} placeholder="OBR-2024-001" className={inputCls} />
          </Field>
          <Field label="Tipo de obra">
            <select name="tipo_obra" defaultValue={defaultValues?.tipo_obra ?? ""} className={inputCls}>
              <option value="">Selecione…</option>
              {TIPOS_OBRA.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Cliente">
            <select name="cliente_id" defaultValue={defaultValues?.cliente_id ?? ""} className={inputCls}>
              <option value="">Sem cliente vinculado</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Planejamento */}
      <div className="bg-white border border-surface-border rounded-xl p-6 space-y-5">
        <h2 className={sectionTitle}>Planejamento</h2>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Status">
            <select name="status" defaultValue={defaultValues?.status ?? "planejamento"} className={inputCls}>
              {STATUS_OPTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="% Concluído">
            <input
              name="percentual_concluido"
              type="number"
              min={0} max={100}
              defaultValue={defaultValues?.percentual_concluido ?? 0}
              className={inputCls}
            />
          </Field>
          <Field label="Início">
            <input name="data_inicio" type="date" defaultValue={defaultValues?.data_inicio ?? ""} className={inputCls} />
          </Field>
          <Field label="Prazo previsto">
            <input name="data_fim_prevista" type="date" defaultValue={defaultValues?.data_fim_prevista ?? ""} className={inputCls} />
          </Field>
          {isEdit && (
            <Field label="Data de conclusão">
              <input name="data_fim_real" type="date" defaultValue={defaultValues?.data_fim_real ?? ""} className={inputCls} />
            </Field>
          )}
        </div>

        {/* Semáforo */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Saúde do projeto
          </label>
          <div className="flex gap-3">
            {SEMAFOROS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSemaforo(s.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  semaforo === s.value
                    ? "border-text-primary bg-white shadow-sm text-text-primary"
                    : "border-surface-border bg-surface-input text-text-secondary hover:border-text-disabled"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Financeiro */}
      <div className="bg-white border border-surface-border rounded-xl p-6 space-y-5">
        <h2 className={sectionTitle}>Financeiro</h2>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Valor do contrato (R$)">
            <input
              name="valor_contrato"
              type="number"
              step="0.01"
              min={0}
              defaultValue={defaultValues?.valor_contrato ?? ""}
              placeholder="0,00"
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {/* Descrição */}
      <div className="bg-white border border-surface-border rounded-xl p-6 space-y-5">
        <h2 className={sectionTitle}>Descrição</h2>
        <textarea
          name="descricao"
          defaultValue={defaultValues?.descricao ?? ""}
          placeholder="Contexto, objetivos e escopo geral do projeto…"
          rows={4}
          className={`${inputCls} resize-none`}
        />
      </div>

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
            Excluir projeto
          </button>
        ) : <span />}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {isPending && <IconLoader2 size={16} className="animate-spin" />}
          {isEdit ? "Salvar alterações" : "Criar projeto"}
        </button>
      </div>
    </form>
  );
}

const inputCls    = "w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all";
const sectionTitle = "text-sm font-semibold text-text-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
