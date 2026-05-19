"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSearch, IconLayoutDashboard, IconPlus } from "@tabler/icons-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { Projeto, StatusProjeto, Semaforo } from "@/lib/types";

const STATUS_LABEL: Record<StatusProjeto, string> = {
  planejamento:  "Planejamento",
  execucao:      "Execução",
  monitoramento: "Monitoramento",
  encerrado:     "Encerrado",
  suspenso:      "Suspenso",
};

const STATUS_CLS: Record<StatusProjeto, string> = {
  planejamento:  "bg-blue-50 text-blue-600 border-blue-100",
  execucao:      "bg-brand-50 text-brand-700 border-brand-100",
  monitoramento: "bg-purple-50 text-purple-600 border-purple-100",
  encerrado:     "bg-green-50 text-green-700 border-green-200",
  suspenso:      "bg-gray-100 text-text-disabled border-gray-200",
};

const SEM_DOT: Record<Semaforo, string> = {
  verde:    "bg-green-500",
  amarelo:  "bg-amber-400",
  vermelho: "bg-red-500",
};

const SEM_BAR: Record<Semaforo, string> = {
  verde:    "bg-green-500",
  amarelo:  "bg-amber-400",
  vermelho: "bg-red-500",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(value);
}

interface ProjetosGridProps {
  projetos: Projeto[];
}

export function ProjetosGrid({ projetos }: ProjetosGridProps) {
  const [busca,  setBusca]  = useState("");
  const [status, setStatus] = useState<StatusProjeto | "">("");

  const filtrados = projetos.filter((p) => {
    const matchBusca  = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.codigo ?? "").toLowerCase().includes(busca.toLowerCase()) ||
      (p.cliente?.nome ?? "").toLowerCase().includes(busca.toLowerCase());
    const matchStatus = status === "" || p.status === status;
    return matchBusca && matchStatus;
  });

  if (projetos.length === 0) {
    return (
      <EmptyState
        icon={IconLayoutDashboard}
        title="Nenhum projeto na carteira"
        description="Crie o primeiro projeto para começar a gerenciar a carteira."
        actionLabel="Novo projeto"
        actionHref="/projetos/novo"
      />
    );
  }

  return (
    <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
      {/* Filtros */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-border bg-surface-page/60">
        <div className="relative flex-1 max-w-xs">
          <IconSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-disabled" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Filtrar projetos…"
            className="w-full pl-7 pr-3 py-1.5 text-[12px] bg-white border border-surface-border rounded-md text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusProjeto | "")}
          className="px-2.5 py-1.5 text-[12px] bg-white border border-surface-border rounded-md text-text-primary focus:outline-none focus:border-brand-500 transition-all"
        >
          <option value="">Todos</option>
          {Object.entries(STATUS_LABEL).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <span className="ml-auto text-[11px] text-text-disabled tabular-nums">
          {filtrados.length}/{projetos.length}
        </span>
      </div>

      {/* Cabeçalho da tabela */}
      <div
        className="grid items-center gap-3 px-4 py-2 bg-surface-page/40 border-b border-surface-border"
        style={{ gridTemplateColumns: "10px 96px 1fr 130px 110px 120px 76px 76px" }}
      >
        <span />
        <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Código</span>
        <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Projeto</span>
        <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Cliente</span>
        <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Status</span>
        <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Conclusão</span>
        <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-right">Prazo</span>
        <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-right">Valor</span>
      </div>

      {/* Linhas */}
      {filtrados.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="text-[13px] text-text-disabled">Nenhum projeto encontrado.</p>
        </div>
      ) : (
        <div className="divide-y divide-surface-border">
          {filtrados.map((p) => (
            <Link
              key={p.id}
              href={`/projetos/${p.id}`}
              className="grid items-center gap-3 px-4 py-2.5 hover:bg-surface-input/40 group transition-colors"
              style={{ gridTemplateColumns: "10px 96px 1fr 130px 110px 120px 76px 76px" }}
            >
              {/* Semáforo */}
              <span className={`w-2.5 h-2.5 rounded-full ${SEM_DOT[p.semaforo]}`} />

              {/* Código */}
              <span className="text-[11px] font-mono text-text-disabled truncate">
                {p.codigo ?? "—"}
              </span>

              {/* Nome */}
              <span className="text-[13px] font-medium text-text-primary truncate group-hover:text-brand-700 transition-colors">
                {p.nome}
              </span>

              {/* Cliente */}
              <span className="text-[12px] text-text-secondary truncate">
                {p.cliente?.nome ?? "—"}
              </span>

              {/* Status */}
              <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded border text-center justify-self-start ${STATUS_CLS[p.status]}`}>
                {STATUS_LABEL[p.status]}
              </span>

              {/* Progresso */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[3px] bg-surface-input rounded-full overflow-hidden">
                  <div
                    className={`h-full ${SEM_BAR[p.semaforo]} rounded-full`}
                    style={{ width: `${p.percentual_concluido}%` }}
                  />
                </div>
                <span className="text-[11px] tabular-nums text-text-disabled w-7 text-right shrink-0">
                  {p.percentual_concluido}%
                </span>
              </div>

              {/* Prazo */}
              <span className="text-[11px] text-text-disabled text-right">
                {p.data_fim_prevista ? formatDate(p.data_fim_prevista) : "—"}
              </span>

              {/* Valor */}
              <span className="text-[11px] font-medium text-text-primary text-right">
                {p.valor_contrato ? formatCurrency(p.valor_contrato) : "—"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
