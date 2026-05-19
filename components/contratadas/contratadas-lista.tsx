"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSearch, IconPencil, IconHelmet } from "@tabler/icons-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { Contratada, TipoContratada } from "@/lib/types";

const TIPO_LABEL: Record<TipoContratada, string> = {
  construtora:  "Construtora",
  projetista:   "Projetista",
  fornecedor:   "Fornecedor",
  consultoria:  "Consultoria",
  outro:        "Outro",
};

interface ContratadasListaProps {
  contratadas: Contratada[];
}

export function ContratadasLista({ contratadas }: ContratadasListaProps) {
  const [busca, setBusca] = useState("");
  const [tipo,  setTipo]  = useState<TipoContratada | "">("");

  const filtradas = contratadas.filter((c) => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (c.cnpj ?? "").includes(busca);
    const matchTipo = tipo === "" || c.tipo === tipo;
    return matchBusca && matchTipo;
  });

  if (contratadas.length === 0) {
    return (
      <EmptyState
        icon={IconHelmet}
        title="Nenhuma contratada cadastrada"
        description="Adicione construtoras, projetistas e fornecedores para vincular a contratos."
        actionLabel="Nova contratada"
        actionHref="/contratadas/novo"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou CNPJ…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-surface-border rounded-lg text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
        </div>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as TipoContratada | "")}
          className="px-3 py-2 text-sm bg-white border border-surface-border rounded-lg text-text-primary focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
        >
          <option value="">Todos os tipos</option>
          {Object.entries(TIPO_LABEL).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-input/50">
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Nome</th>
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">CNPJ</th>
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Tipo</th>
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Contato</th>
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-text-secondary text-sm">
                  Nenhuma contratada encontrada para os filtros aplicados.
                </td>
              </tr>
            ) : (
              filtradas.map((c) => (
                <tr key={c.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-text-primary">{c.nome}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{c.cnpj ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
                      {TIPO_LABEL[c.tipo]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary">{c.contato_nome ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.ativo
                        ? "bg-green-50 text-status-green border border-green-200"
                        : "bg-gray-100 text-text-disabled border border-gray-200"
                    }`}>
                      {c.ativo ? "Ativa" : "Inativa"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/contratadas/${c.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-700 font-medium transition-colors"
                    >
                      <IconPencil size={14} />
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-disabled">
        {filtradas.length} de {contratadas.length} contratada{contratadas.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
