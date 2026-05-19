import { notFound } from "next/navigation";
import { IconBuildingStore } from "@tabler/icons-react";
import { getProjeto } from "@/app/actions/projetos";
import { getAquisicoes, createAquisicao, addMedicao } from "@/app/actions/aquisicoes";
import { getContratadas } from "@/app/actions/contratadas";
import { AquisicaoRow } from "@/components/aquisicoes/aquisicao-row";
import { AddAquisicaoForm } from "@/components/aquisicoes/add-aquisicao-form";

interface Props { params: Promise<{ id: string }> }

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export default async function AquisicoesPage({ params }: Props) {
  const { id } = await params;
  const [projeto, aquisicoes, contratadas] = await Promise.all([
    getProjeto(id),
    getAquisicoes(id),
    getContratadas(),
  ]);
  if (!projeto) notFound();

  const addAquisicao = createAquisicao.bind(null, id);

  // KPIs
  const ativos        = aquisicoes.filter((a) => a.status === "ativo").length;
  const totalContrato = aquisicoes.reduce((s, a) => s + a.valor_contrato, 0);
  const totalMedido   = aquisicoes.reduce((s, a) => {
    return s + (a.medicoes ?? []).reduce((ms, m) => ms + m.valor, 0);
  }, 0);
  const saldoGlobal   = totalContrato - totalMedido;
  const avaliacoes    = aquisicoes.filter((a) => a.avaliacao).map((a) => a.avaliacao as number);
  const mediaAval     = avaliacoes.length > 0
    ? (avaliacoes.reduce((s, n) => s + n, 0) / avaliacoes.length).toFixed(1)
    : null;

  return (
    <div className="p-6 space-y-4 animate-page">

      {/* KPI strip */}
      {aquisicoes.length > 0 && (
        <div className="flex items-center gap-0 bg-white border border-surface-border rounded-xl overflow-hidden divide-x divide-surface-border animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Contratos</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{aquisicoes.length}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">{ativos} ativos</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Valor total</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{fmt(totalContrato)}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Medido</p>
            <p className="text-lg font-bold text-green-600 tabular-nums">{fmt(totalMedido)}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">
              {totalContrato > 0 ? `${Math.round((totalMedido / totalContrato) * 100)}% do total` : "—"}
            </p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Saldo</p>
            <p className={`text-lg font-bold tabular-nums ${saldoGlobal < 0 ? "text-red-600" : "text-text-primary"}`}>
              {fmt(saldoGlobal)}
            </p>
            <p className="text-[11px] text-text-disabled mt-0.5">a medir</p>
          </div>
          {mediaAval && (
            <div className="flex-1 px-5 py-3.5">
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Avaliação média</p>
              <p className="text-lg font-bold text-amber-500 tabular-nums">{mediaAval} / 5</p>
            </div>
          )}
        </div>
      )}

      {/* Tabela de aquisições */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        {/* Header */}
        <div
          className="grid items-center gap-3 px-4 py-2 border-b border-surface-border bg-surface-page/50"
          style={{ gridTemplateColumns: "20px 1fr 110px 120px 120px 110px 120px 32px" }}
        >
          <span />
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Contrato / Objeto</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Nº Contrato</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-right">Valor</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-right">Medido</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider text-right">Saldo</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Status</span>
          <span />
        </div>

        {/* Linhas */}
        {aquisicoes.length > 0 ? (
          <div>
            {aquisicoes.map((aq) => {
              const medicaoAction = addMedicao.bind(null, aq.id, id);
              return (
                <AquisicaoRow
                  key={aq.id}
                  aquisicao={aq}
                  projetoId={id}
                  addMedicaoFn={medicaoAction}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-surface-input flex items-center justify-center">
              <IconBuildingStore size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhum contrato cadastrado</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use o formulário abaixo para registrar contratos e medições.</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulário de nova aquisição */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-surface-border bg-surface-page/40">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Novo Contrato
          </span>
        </div>
        <div className="p-4">
          <AddAquisicaoForm action={addAquisicao} contratadas={contratadas} />
        </div>
      </div>

    </div>
  );
}
