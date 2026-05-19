"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconTrash, IconEdit, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteOrcamentoItem, updateOrcamentoItem } from "@/app/actions/custos";
import type { OrcamentoItem, CategoriaOrcamento } from "@/lib/types";

const CAT_CFG: Record<CategoriaOrcamento, { label: string; cls: string }> = {
  material:    { label: "Material",    cls: "bg-blue-50 text-blue-700"     },
  mao_de_obra: { label: "Mão de obra", cls: "bg-purple-50 text-purple-700" },
  equipamento: { label: "Equipamento", cls: "bg-orange-50 text-orange-700" },
  servico:     { label: "Serviço",     cls: "bg-teal-50 text-teal-700"     },
  outro:       { label: "Outro",       cls: "bg-surface-input text-text-secondary" },
};
const CATS: CategoriaOrcamento[] = ["material", "mao_de_obra", "equipamento", "servico", "outro"];

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-3 py-1 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[11px] font-medium rounded-md transition-colors">
      {pending ? "…" : "Salvar"}
    </button>
  );
}

function EditRow({ item, onCancel }: { item: OrcamentoItem; onCancel: () => void }) {
  const action = updateOrcamentoItem.bind(null, item.projeto_id, item.id);
  const [state, formAction] = useFormState(action, null);
  if (state && !state.error) onCancel();

  const inp = "px-2 py-1.5 text-[12px] bg-white border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary w-full";

  return (
    <div className="col-span-full bg-brand-50/30 px-4 py-2">
      <form action={formAction} className="grid grid-cols-[1fr_110px_120px_120px_auto] gap-2 items-center">
        <input name="descricao" defaultValue={item.descricao} required placeholder="Descrição" className={inp} />
        <select name="categoria" defaultValue={item.categoria} className={inp}>
          {CATS.map((c) => <option key={c} value={c}>{CAT_CFG[c].label}</option>)}
        </select>
        <input name="valor_planejado" type="number" step="0.01" min="0"
          defaultValue={item.valor_planejado} required className={inp} placeholder="Planejado" />
        <input name="valor_realizado" type="number" step="0.01" min="0"
          defaultValue={item.valor_realizado} className={inp} placeholder="Realizado" />
        <div className="flex items-center gap-1">
          <SaveBtn />
          <button type="button" onClick={onCancel}
            className="p-1.5 text-text-disabled hover:text-text-primary transition-colors">
            <IconX size={13} />
          </button>
        </div>
      </form>
      {state?.error && <p className="text-[11px] text-red-600 mt-1">{state.error}</p>}
    </div>
  );
}

export function OrcamentoRow({ item }: { item: OrcamentoItem }) {
  const [editing, setEditing] = useState(false);
  const [pending, start]      = useTransition();
  const cfg      = CAT_CFG[item.categoria];
  const variacao = item.valor_planejado - item.valor_realizado;
  const perc     = item.valor_planejado > 0
    ? Math.round((item.valor_realizado / item.valor_planejado) * 100)
    : 0;

  async function handleDelete() {
    if (!confirm(`Remover "${item.descricao}"?`)) return;
    start(async () => {
      const r = await deleteOrcamentoItem(item.projeto_id, item.id);
      if (r.error) toast.error(r.error);
    });
  }

  if (editing) return <EditRow item={item} onCancel={() => setEditing(false)} />;

  return (
    <div className="group grid grid-cols-[1fr_110px_120px_120px_100px_24px] items-center gap-3 px-4 py-2.5 hover:bg-surface-input/40 transition-colors">
      {/* descrição */}
      <div className="min-w-0">
        <span className="text-[13px] font-medium text-text-primary truncate block">{item.descricao}</span>
        {item.data_referencia && (
          <span className="text-[11px] text-text-disabled">
            {new Date(item.data_referencia + "T00:00:00").toLocaleDateString("pt-BR")}
          </span>
        )}
        {/* mini progress */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-20 h-1 bg-surface-input rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${perc > 100 ? "bg-red-500" : "bg-brand-500"}`}
              style={{ width: `${Math.min(perc, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-text-disabled tabular-nums">{perc}%</span>
        </div>
      </div>

      {/* categoria */}
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${cfg.cls}`}>
        {cfg.label}
      </span>

      {/* planejado */}
      <span className="text-[12px] font-medium text-text-primary tabular-nums text-right">
        {fmt(item.valor_planejado)}
      </span>

      {/* realizado */}
      <span className="text-[12px] text-text-secondary tabular-nums text-right">
        {fmt(item.valor_realizado)}
      </span>

      {/* variação */}
      <span className={`text-[12px] font-medium tabular-nums text-right ${variacao >= 0 ? "text-green-600" : "text-red-600"}`}>
        {variacao >= 0 ? "+" : ""}{fmt(variacao)}
      </span>

      {/* ações */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} title="Editar"
          className="p-1 text-text-disabled hover:text-text-primary transition-colors">
          <IconEdit size={13} />
        </button>
        <button onClick={handleDelete} disabled={pending} title="Remover"
          className="p-1 text-text-disabled hover:text-red-600 transition-colors">
          <IconTrash size={13} />
        </button>
      </div>
    </div>
  );
}
