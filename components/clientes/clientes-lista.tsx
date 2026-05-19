"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSearch, IconPencil, IconBuilding } from "@tabler/icons-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { Cliente, Setor } from "@/lib/types";

const SETOR_LABEL: Record<Setor, string> = {
  industria:       "Indústria",
  infraestrutura:  "Infraestrutura",
  energia:         "Energia",
  mineracao:       "Mineração",
  agronegocio:     "Agronegócio",
  saneamento:      "Saneamento",
  outro:           "Outro",
};

interface ClientesListaProps {
  clientes: Cliente[];
}

export function ClientesLista({ clientes }: ClientesListaProps) {
  const [busca,  setBusca]  = useState("");
  const [setor,  setSetor]  = useState<Setor | "">("");

  const filtrados = clientes.filter((c) => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (c.cnpj ?? "").includes(busca);
    const matchSetor = setor === "" || c.setor === setor;
    return matchBusca && matchSetor;
  });

  if (clientes.length === 0) {
    return (
      <EmptyState
        icon={IconBuilding}
        title="Nenhum cliente cadastrado"
        description="Adicione o primeiro cliente para começar a vincular projetos."
        actionLabel="Novo cliente"
        actionHref="/clientes/novo"
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
          value={setor}
          onChange={(e) => setSetor(e.target.value as Setor | "")}
          className="px-3 py-2 text-sm bg-white border border-surface-border rounded-lg text-text-primary focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
        >
          <option value="">Todos os setores</option>
          {Object.entries(SETOR_LABEL).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E9EBF0] bg-[#FAFBFC]">
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Nome</th>
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">CNPJ</th>
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Setor</th>
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Contato</th>
              <th className="text-left px-5 py-3 font-semibold text-text-secondary text-xs uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2F5]">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-text-secondary text-sm">
                  Nenhum cliente encontrado para os filtros aplicados.
                </td>
              </tr>
            ) : (
              filtrados.map((c) => (
                <tr key={c.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-text-primary">{c.nome}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{c.cnpj ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    {c.setor ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
                        {SETOR_LABEL[c.setor]}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary">{c.contato_nome ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      c.ativo
                        ? "bg-green-50 text-status-green border border-green-200"
                        : "bg-gray-100 text-text-disabled border border-gray-200"
                    }`}>
                      {c.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/clientes/${c.id}`}
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
        {filtrados.length} de {clientes.length} cliente{clientes.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
