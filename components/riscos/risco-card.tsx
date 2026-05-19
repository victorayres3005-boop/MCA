"use client";

import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { IconTrash, IconEdit, IconChevronDown } from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteRisco, updateRisco, setRiscoStatus } from "@/app/actions/riscos";
import type { Risco, StatusRisco, CategoriaRisco } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function nivelRisco(probabilidade: number, impacto: number) {
  const score = probabilidade * impacto;
  if (score >= 15) return "alto"   as const;
  if (score >= 6)  return "medio"  as const;
  return               "baixo"  as const;
}

const NIVEL_CFG = {
  alto:  { label: "Alto",  dot: "bg-status-red",    badge: "bg-red-50 text-status-red border-red-200"           },
  medio: { label: "Médio", dot: "bg-status-yellow",  badge: "bg-yellow-50 text-yellow-700 border-yellow-200"    },
  baixo: { label: "Baixo", dot: "bg-green-500",      badge: "bg-green-50 text-green-700 border-green-200"       },
} as const;

const STATUS_CFG: Record<StatusRisco, string> = {
  identificado: "bg-surface-input text-text-secondary border-surface-border",
  monitorando:  "bg-blue-50 text-blue-700 border-blue-200",
  mitigado:     "bg-green-50 text-green-700 border-green-200",
  ocorrido:     "bg-red-50 text-status-red border-red-200",
  encerrado:    "bg-surface-input text-text-disabled border-surface-border",
};

const STATUS_LABEL: Record<StatusRisco, string> = {
  identificado: "Identificado",
  monitorando:  "Monitorando",
  mitigado:     "Mitigado",
  ocorrido:     "Ocorrido",
  encerrado:    "Encerrado",
};

const STATUS_OPTIONS: StatusRisco[] = ["identificado", "monitorando", "mitigado", "ocorrido", "encerrado"];

const CATEGORIA_LABEL: Record<CategoriaRisco, string> = {
  tecnico:        "Técnico",
  externo:        "Externo",
  organizacional: "Organizacional",
  cronograma:     "Cronograma",
  custo:          "Custo",
  outro:          "Outro",
};

const CATEGORIAS: CategoriaRisco[] = ["tecnico", "externo", "organizacional", "cronograma", "custo", "outro"];

const ESCALA = [1, 2, 3, 4, 5];

// ─── Submit button ────────────────────────────────────────────────────────────
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

// ─── Formulário de edição inline ──────────────────────────────────────────────
function EditForm({ risco, onCancel }: { risco: Risco; onCancel: () => void }) {
  const action = updateRisco.bind(null, risco.projeto_id, risco.id);
  const [state, formAction] = useFormState(action, null);
  if (state && !state.error) onCancel();

  return (
    <form action={formAction} className="space-y-3 pt-2">
      <textarea
        name="descricao"
        defaultValue={risco.descricao}
        required
        rows={2}
        placeholder="Descrição do risco"
        className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary resize-none"
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          name="categoria"
          defaultValue={risco.categoria}
          className="px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>
          ))}
        </select>
        <input
          name="responsavel"
          defaultValue={risco.responsavel ?? ""}
          placeholder="Responsável"
          className="px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1">Probabilidade (1–5)</label>
          <select
            name="probabilidade"
            defaultValue={risco.probabilidade}
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
          >
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Impacto (1–5)</label>
          <select
            name="impacto"
            defaultValue={risco.impacto}
            className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary"
          >
            {ESCALA.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <textarea
        name="plano_resposta"
        defaultValue={risco.plano_resposta ?? ""}
        rows={2}
        placeholder="Plano de resposta…"
        className="w-full px-3 py-2 text-sm bg-surface-input border border-surface-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-text-primary resize-none"
      />
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

// ─── Card principal ───────────────────────────────────────────────────────────
export function RiscoCard({ risco }: { risco: Risco }) {
  const [editing,       setEditing]       = useState(false);
  const [statusOpen,    setStatusOpen]    = useState(false);
  const [pending,       start]            = useTransition();

  const nivel = nivelRisco(risco.probabilidade, risco.impacto);
  const ncfg  = NIVEL_CFG[nivel];
  const score = risco.probabilidade * risco.impacto;

  async function handleStatus(s: StatusRisco) {
    setStatusOpen(false);
    start(async () => {
      const result = await setRiscoStatus(risco.projeto_id, risco.id, s);
      if (result.error) toast.error(result.error);
    });
  }

  async function handleDelete() {
    if (!confirm(`Remover o risco "${risco.descricao.slice(0, 50)}…"?`)) return;
    start(async () => {
      const result = await deleteRisco(risco.projeto_id, risco.id);
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <div className="group px-5 py-4 hover:bg-surface-input/40 transition-colors">
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${ncfg.dot}`} />

        <div className="flex-1 min-w-0">
          {editing ? (
            <EditForm risco={risco} onCancel={() => setEditing(false)} />
          ) : (
            <>
              <div className="flex items-start gap-2 flex-wrap mb-2">
                <p className="text-sm font-medium text-text-primary flex-1">{risco.descricao}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-2">
                {/* nível */}
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ncfg.badge}`}>
                  {ncfg.label} ({score})
                </span>
                {/* categoria */}
                <span className="text-[11px] text-text-disabled border border-surface-border px-2 py-0.5 rounded-full">
                  {CATEGORIA_LABEL[risco.categoria]}
                </span>
                {/* status dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusOpen((o) => !o)}
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-colors ${STATUS_CFG[risco.status]}`}
                  >
                    {STATUS_LABEL[risco.status]}
                    <IconChevronDown size={10} />
                  </button>
                  {statusOpen && (
                    <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-surface-border rounded-lg shadow-lg py-1 min-w-[140px]">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleStatus(s)}
                          className="w-full text-left px-3 py-1.5 text-xs text-text-primary hover:bg-surface-input transition-colors"
                        >
                          {STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {risco.responsavel && (
                  <span className="text-[11px] text-text-disabled">{risco.responsavel}</span>
                )}
              </div>

              {/* P × I */}
              <div className="flex items-center gap-4 text-xs text-text-disabled mb-1.5">
                <span>Probabilidade: <strong className="text-text-primary">{risco.probabilidade}</strong></span>
                <span>Impacto: <strong className="text-text-primary">{risco.impacto}</strong></span>
                <span>Score: <strong className="text-text-primary">{score}</strong></span>
              </div>

              {risco.plano_resposta && (
                <p className="text-xs text-text-secondary italic border-l-2 border-surface-border pl-2">
                  {risco.plano_resposta}
                </p>
              )}
            </>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 text-text-disabled hover:text-text-primary transition-colors" title="Editar">
              <IconEdit size={15} />
            </button>
            <button onClick={handleDelete} disabled={pending} className="p-1.5 text-text-disabled hover:text-status-red transition-colors" title="Remover">
              <IconTrash size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
