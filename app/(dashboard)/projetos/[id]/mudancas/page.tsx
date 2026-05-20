import { notFound } from "next/navigation";
import { IconGitPullRequest } from "@tabler/icons-react";
import { getProjeto } from "@/app/actions/projetos";
import { getMudancas, createMudanca } from "@/app/actions/mudancas";
import { MudancaRow, MUDANCA_COLS } from "@/components/mudancas/mudanca-row";
import { AddMudancaForm } from "@/components/mudancas/add-mudanca-form";
import { DataTable } from "@/components/shared/data-table";

interface Props { params: Promise<{ id: string }> }

function fmtCusto(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(Math.abs(v));
}

export default async function MudancasPage({ params }: Props) {
  const { id } = await params;
  const [projeto, mudancas] = await Promise.all([getProjeto(id), getMudancas(id)]);
  if (!projeto) notFound();

  const addMudanca = createMudanca.bind(null, id);

  const pendentes    = mudancas.filter((m) => m.status === "rascunho" || m.status === "em_analise").length;
  const aprovadas    = mudancas.filter((m) => m.status === "aprovada" || m.status === "implementada").length;
  const rejeitadas   = mudancas.filter((m) => m.status === "rejeitada").length;
  const impactoCusto = mudancas
    .filter((m) => m.status === "aprovada" || m.status === "implementada")
    .reduce((s, m) => s + (m.impacto_custo ?? 0), 0);
  const impactoPrazo = mudancas
    .filter((m) => m.status === "aprovada" || m.status === "implementada")
    .reduce((s, m) => s + (m.impacto_prazo ?? 0), 0);

  const nextNumero = `M-${String(mudancas.length + 1).padStart(3, "0")}`;

  const ativas     = mudancas.filter((m) => m.status !== "rejeitada" && m.status !== "implementada");
  const encerradas = mudancas.filter((m) => m.status === "rejeitada" || m.status === "implementada");

  return (
    <div className="p-6 space-y-4 animate-page">

      {/* KPI strip */}
      {mudancas.length > 0 && (
        <div className="flex items-center gap-0 bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden divide-x divide-[#E9EBF0] animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Total</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{mudancas.length}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">solicitações</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Pendentes</p>
            <p className={`text-lg font-bold tabular-nums ${pendentes > 0 ? "text-amber-500" : "text-text-primary"}`}>{pendentes}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">aguardando decisão</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Aprovadas</p>
            <p className="text-lg font-bold text-green-600 tabular-nums">{aprovadas}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Rejeitadas</p>
            <p className={`text-lg font-bold tabular-nums ${rejeitadas > 0 ? "text-red-500" : "text-text-primary"}`}>{rejeitadas}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">± Custo aprovado</p>
            <p className={`text-lg font-bold tabular-nums ${impactoCusto > 0 ? "text-red-600" : impactoCusto < 0 ? "text-green-600" : "text-text-disabled"}`}>
              {impactoCusto !== 0 ? `${impactoCusto > 0 ? "+" : "-"}${fmtCusto(impactoCusto)}` : "—"}
            </p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">± Prazo aprovado</p>
            <p className={`text-lg font-bold tabular-nums ${impactoPrazo > 0 ? "text-red-600" : impactoPrazo < 0 ? "text-green-600" : "text-text-disabled"}`}>
              {impactoPrazo !== 0 ? `${impactoPrazo > 0 ? "+" : ""}${impactoPrazo}d` : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Tabela */}
      <DataTable
        cols={MUDANCA_COLS}
        headers={[
          { label: "" },
          { label: "Nº" },
          { label: "Mudança" },
          { label: "Data" },
          { label: "± Prazo", align: "right" },
          { label: "± Custo", align: "right" },
          { label: "Status" },
          { label: "" },
        ]}
      >
        {ativas.length > 0 && (
          <div className="divide-y divide-[#E9EBF0]">
            {ativas.map((m) => <MudancaRow key={m.id} mudanca={m} projetoId={id} />)}
          </div>
        )}

        {mudancas.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center">
              <IconGitPullRequest size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhuma solicitação de mudança</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use o formulário abaixo para registrar mudanças no projeto.</p>
            </div>
          </div>
        )}

        {encerradas.length > 0 && (
          <div className="border-t border-surface-border">
            <div className="px-4 py-2 bg-[#FAFBFC]">
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
                Encerradas · {encerradas.length}
              </p>
            </div>
            <div className="divide-y divide-[#E9EBF0] opacity-60">
              {encerradas.map((m) => <MudancaRow key={m.id} mudanca={m} projetoId={id} />)}
            </div>
          </div>
        )}
      </DataTable>

      {/* Formulário de nova mudança */}
      <div className="bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-surface-border bg-[#FAFBFC]">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Nova Solicitação de Mudança
          </span>
        </div>
        <div className="p-4">
          <AddMudancaForm action={addMudanca} nextNumero={nextNumero} />
        </div>
      </div>

    </div>
  );
}
