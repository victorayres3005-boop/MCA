"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteOrcamentoItem, updateOrcamentoItem } from "@/app/actions/custos";
import type { OrcamentoItem, CategoriaOrcamento } from "@/lib/types";

const CATEGORIA_CFG: Record<CategoriaOrcamento, { label: string; cls: string }> = {
  material:    { label: "Material",      cls: "bg-blue-50 text-blue-700 border-blue-200"     },
  mao_de_obra: { label: "Mão de obra",   cls: "bg-purple-50 text-purple-700 border-purple-200" },
  equipamento: { label: "Equipamento",   cls: "bg-orange-50 text-orange-700 border-orange-200" },
  servico:     { label: "Serviço",       cls: "bg-teal-50 text-teal-700 border-teal-100"      },
  outro:       { label: "Outro",         cls: "bg-surface-input text-text-secondary border-surface-border" },
};

const CATEGORIAS: CategoriaOrcamento[] = ["material", "mao_de_obra", "equipamento", "servico", "outro"];

function fmt(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-1.5 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
    >
      {pending ? "Salvando…" : "Salvar"}
    </button>
  );
}

function EditForm({ item, onCancel }: { item: OrcamentoItem; onCancel: () => void }) {
  const action = updateOrcamentoItem.bind(null, item.projeto_id, item.id);
  const [state, formAction] = useFormState(action, null);

  if (state && !state.error) onCancel();

  return (
    <form action={formAction} className="space-y-3 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <input
            name="descricao"
            defaultValue={item.descricao}
            required
            placeholder="Descrição"
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
          />
        </div>
        <select
          name="categoria"
          defaultValue={item.categoria}
          className="px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{CATEGORIA_CFG[c].label}</option>
          ))}
        </select>
        <input
          name="data_referencia"
          type="date"
          defaultValue={item.data_referencia ?? ""}
          className="px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        />
        <div>
          <label className="block text-xs text-text-secondary mb-1">Valor planejado (R$)</label>
          <input
            name="valor_planejado"
            type="number"
            step="0.01"
            min="0"
            defaultValue={item.valor_planejado}
            required
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Valor realizado (R$)</label>
          <input
            name="valor_realizado"
            type="number"
            step="0.01"
            min="0"
            defaultValue={item.valor_realizado}
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
          />
        </div>
        <div className="col-span-2">
          <textarea
            name="observacao"
            defaultValue={item.observacao ?? ""}
            placeholder="Observação (opcional)"
            rows={2}
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary resize-none"
          />
        </div>
      </div>
      {state?.error && <p className="text-xs text-status-red">{state.error}</p>}
      <div className="flex items-center gap-2">
        <SaveButton />
        <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function OrcamentoItemCard({ item }: { item: OrcamentoItem }) {
  const [editing, setEditing]  = useState(false);
  const [pending, start]       = useTransition();
  const cfg = CATEGORIA_CFG[item.categoria];
  const variacao = item.valor_planejado - item.valor_realizado;
  const percRealizado = item.valor_planejado > 0
    ? Math.min(Math.round((item.valor_realizado / item.valor_planejado) * 100), 100)
    : 0;

  async function handleDelete() {
    if (!confirm(`Remover "${item.descricao}"?`)) return;
    start(async () => {
      const result = await deleteOrcamentoItem(item.projeto_id, item.id);
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <div className="group px-5 py-4 hover:bg-surface-input/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {editing ? (
            <EditForm item={item} onCancel={() => setEditing(false)} />
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <p className="text-sm font-medium text-text-primary">{item.descricao}</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cfg.cls}`}>
                  {cfg.label}
                </span>
                {item.data_referencia && (
                  <span className="text-[11px] text-text-disabled">
                    {new Date(item.data_referencia + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                <div>
                  <p className="text-xs text-text-disabled mb-0.5">Planejado</p>
                  <p className="font-semibold text-text-primary tabular-nums">{fmt(item.valor_planejado)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-disabled mb-0.5">Realizado</p>
                  <p className="font-semibold text-text-primary tabular-nums">{fmt(item.valor_realizado)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-disabled mb-0.5">Variação</p>
                  <p className={`font-semibold tabular-nums ${variacao >= 0 ? "text-green-600" : "text-status-red"}`}>
                    {variacao >= 0 ? "+" : ""}{fmt(variacao)}
                  </p>
                </div>
              </div>

              {/* barra de progresso */}
              <div className="h-1.5 bg-surface-input rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${percRealizado > 100 ? "bg-status-red" : "bg-brand-500"}`}
                  style={{ width: `${Math.min(percRealizado, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-text-disabled mt-1">{percRealizado}% executado</p>

              {item.observacao && (
                <p className="text-xs text-text-secondary mt-1.5 italic">{item.observacao}</p>
              )}
            </>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-text-disabled hover:text-text-primary transition-colors"
              title="Editar"
            >
              <IconEdit size={15} />
            </button>
            <button
              onClick={handleDelete}
              disabled={pending}
              className="p-1.5 text-text-disabled hover:text-status-red transition-colors"
              title="Remover"
            >
              <IconTrash size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
