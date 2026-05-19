"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconTrash, IconEdit, IconX, IconChevronDown } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteRisco, updateRisco, setRiscoStatus } from "@/app/actions/riscos";
import { nivelRisco } from "@/components/riscos/risco-card";
import type { Risco, StatusRisco, CategoriaRisco } from "@/lib/types";

const NIVEL_CFG = {
  alto:  { dot: "bg-red-500",    badge: "bg-red-50 text-red-700 border-red-100",     label: "Alto",  pCls: "text-red-600"   },
  medio: { dot: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-100", label: "Médio", pCls: "text-amber-600" },
  baixo: { dot: "bg-green-500",  badge: "bg-green-50 text-green-700 border-green-100", label: "Baixo", pCls: "text-green-700" },
} as const;

const STATUS_CFG: Record<StatusRisco, string> = {
  identificado: "text-text-secondary",
  monitorando:  "text-blue-700",
  mitigado:     "text-green-700",
  ocorrido:     "text-red-700",
  encerrado:    "text-text-disabled",
};
const STATUS_LABEL: Record<StatusRisco, string> = {
  identificado: "Identificado",
  monitorando:  "Monitorando",
  mitigado:     "Mitigado",
  ocorrido:     "Ocorrido",
  encerrado:    "Encerrado",
};
const STATUS_OPTIONS: StatusRisco[] = ["identificado", "monitorando", "mitigado", "ocorrido", "encerrado"];

const CAT_LABEL: Record<CategoriaRisco, string> = {
  tecnico: "Técnico", externo: "Externo", organizacional: "Organizacional",
  cronograma: "Cronograma", custo: "Custo", outro: "Outro",
};
const CATS: CategoriaRisco[] = ["tecnico", "externo", "organizacional", "cronograma", "custo", "outro"];

const ESCALA_P = [
  { value: 1, label: "P1 — Muito baixa" },
  { value: 2, label: "P2 — Baixa"       },
  { value: 3, label: "P3 — Moderada"    },
  { value: 4, label: "P4 — Alta"        },
  { value: 5, label: "P5 — Muito alta"  },
];
const ESCALA_I = [
  { value: 1, label: "I1 — Muito baixo" },
  { value: 2, label: "I2 — Baixo"       },
  { value: 3, label: "I3 — Moderado"    },
  { value: 4, label: "I4 — Alto"        },
  { value: 5, label: "I5 — Muito alto"  },
];

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-3 py-1 bg-brand-500 hover:bg-brand-700 disabled:opacity-50 text-white text-[11px] font-medium rounded-md transition-colors">
      {pending ? "…" : "Salvar"}
    </button>
  );
}

function EditRow({ risco, onCancel }: { risco: Risco; onCancel: () => void }) {
  const action = updateRisco.bind(null, risco.projeto_id, risco.id);
  const [state, formAction] = useFormState(action, null);
  if (state && !state.error) onCancel();

  const inp = "px-2 py-1.5 text-[12px] bg-white border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary w-full";

  return (
    <div className="col-span-full bg-brand-50/30 px-4 py-3">
      <form action={formAction} className="space-y-2">
        <textarea name="descricao" defaultValue={risco.descricao} required rows={2}
          placeholder="Descrição do risco"
          className="w-full px-2 py-1.5 text-[12px] bg-white border border-surface-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-text-primary resize-none" />
        <div className="grid grid-cols-[1fr_140px_140px_120px_120px_auto] gap-2 items-end">
          <select name="categoria" defaultValue={risco.categoria} className={inp}>
            {CATS.map((c) => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
          </select>
          <select name="probabilidade" defaultValue={risco.probabilidade} className={inp}>
            {ESCALA_P.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
          <select name="impacto" defaultValue={risco.impacto} className={inp}>
            {ESCALA_I.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>
          <input name="responsavel" defaultValue={risco.responsavel ?? ""} placeholder="Responsável" className={inp} />
          <input name="plano_resposta" defaultValue={risco.plano_resposta ?? ""}
            placeholder="Plano de resposta"
            className={inp} />
          <div className="flex items-center gap-1">
            <SaveBtn />
            <button type="button" onClick={onCancel}
              className="p-1.5 text-text-disabled hover:text-text-primary transition-colors">
              <IconX size={13} />
            </button>
          </div>
        </div>
      </form>
      {state?.error && <p className="text-[11px] text-red-600 mt-1">{state.error}</p>}
    </div>
  );
}

export function RiscoRow({ risco }: { risco: Risco }) {
  const [editing,    setEditing]    = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [pending,    start]         = useTransition();

  const nivel = nivelRisco(risco.probabilidade, risco.impacto);
  const ncfg  = NIVEL_CFG[nivel];

  async function handleStatus(s: StatusRisco) {
    setStatusOpen(false);
    start(async () => {
      const r = await setRiscoStatus(risco.projeto_id, risco.id, s);
      if (r.error) toast.error(r.error);
    });
  }
  async function handleDelete() {
    if (!confirm(`Remover risco?`)) return;
    start(async () => {
      const r = await deleteRisco(risco.projeto_id, risco.id);
      if (r.error) toast.error(r.error);
    });
  }

  if (editing) return <EditRow risco={risco} onCancel={() => setEditing(false)} />;

  return (
    <div className="group grid items-start gap-3 px-4 py-3 hover:bg-surface-input/40 transition-colors"
      style={{ gridTemplateColumns: "8px 1fr 90px 48px 48px 80px 90px 32px" }}>

      {/* nível dot */}
      <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${ncfg.dot}`} />

      {/* descrição + responsável + plano */}
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-text-primary leading-snug">{risco.descricao}</p>
        {risco.responsavel && (
          <p className="text-[11px] text-text-disabled mt-0.5">{risco.responsavel}</p>
        )}
        {risco.plano_resposta && (
          <p className="text-[11px] text-text-secondary italic mt-0.5">{risco.plano_resposta}</p>
        )}
      </div>

      {/* categoria */}
      <span className="text-[11px] text-text-secondary">{CAT_LABEL[risco.categoria]}</span>

      {/* probabilidade */}
      <div className="flex flex-col items-center gap-0.5">
        <span className={`text-[13px] font-bold tabular-nums ${ncfg.pCls}`}>{risco.probabilidade}</span>
        <span className="text-[9px] text-text-disabled uppercase tracking-wider">prob.</span>
      </div>

      {/* impacto */}
      <div className="flex flex-col items-center gap-0.5">
        <span className={`text-[13px] font-bold tabular-nums ${ncfg.pCls}`}>{risco.impacto}</span>
        <span className="text-[9px] text-text-disabled uppercase tracking-wider">imp.</span>
      </div>

      {/* nível badge */}
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit ${ncfg.badge}`}>
        {ncfg.label}
      </span>

      {/* status dropdown */}
      <div className="relative">
        <button type="button" onClick={() => setStatusOpen((o) => !o)}
          className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${STATUS_CFG[risco.status]}`}>
          {STATUS_LABEL[risco.status]}
          <IconChevronDown size={10} />
        </button>
        {statusOpen && (
          <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-surface-border rounded-lg shadow-md py-1 min-w-[130px]">
            {STATUS_OPTIONS.map((s) => (
              <button key={s} type="button" onClick={() => handleStatus(s)}
                className="w-full text-left px-3 py-1.5 text-[12px] text-text-primary hover:bg-surface-input transition-colors">
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        )}
      </div>

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
