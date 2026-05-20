import { notFound } from "next/navigation";
import { IconClipboardCheck } from "@tabler/icons-react";
import { getProjeto } from "@/app/actions/projetos";
import { getRNCs, createRNC } from "@/app/actions/rncs";
import { RNCRow, RNC_COLS } from "@/components/qualidade/rnc-row";
import { AddRNCForm } from "@/components/qualidade/add-rnc-form";
import { DataTable } from "@/components/shared/data-table";

interface Props { params: Promise<{ id: string }> }

export default async function QualidadePage({ params }: Props) {
  const { id } = await params;
  const [projeto, rncs] = await Promise.all([getProjeto(id), getRNCs(id)]);
  if (!projeto) notFound();

  const addRNC = createRNC.bind(null, id);
  const nextNumero = `RNC-${String(rncs.length + 1).padStart(3, "0")}`;

  const abertas      = rncs.filter((r) => r.status === "aberta").length;
  const emTratamento = rncs.filter((r) => r.status === "em_tratamento").length;
  const fechadas     = rncs.filter((r) => r.status === "fechada").length;

  const ativas     = rncs.filter((r) => r.status !== "fechada" && r.status !== "cancelada");
  const encerradas = rncs.filter((r) => r.status === "fechada" || r.status === "cancelada");

  return (
    <div className="p-6 space-y-4 animate-page">

      {/* KPI strip */}
      {rncs.length > 0 && (
        <div className="flex items-center gap-0 bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden divide-x divide-[#E9EBF0] animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Total</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{rncs.length}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">não conformidades</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Abertas</p>
            <p className={`text-lg font-bold tabular-nums ${abertas > 0 ? "text-red-600" : "text-text-primary"}`}>{abertas}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Em Tratamento</p>
            <p className={`text-lg font-bold tabular-nums ${emTratamento > 0 ? "text-amber-500" : "text-text-primary"}`}>{emTratamento}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Fechadas</p>
            <p className="text-lg font-bold text-green-600 tabular-nums">{fechadas}</p>
          </div>
        </div>
      )}

      {/* Tabela */}
      <DataTable
        cols={RNC_COLS}
        headers={[
          { label: "" },
          { label: "Nº" },
          { label: "Não Conformidade" },
          { label: "Categoria" },
          { label: "Abertura" },
          { label: "Status" },
          { label: "" },
        ]}
      >
        {ativas.length > 0 && (
          <div className="divide-y divide-[#E9EBF0]">
            {ativas.map((r) => <RNCRow key={r.id} rnc={r} projetoId={id} />)}
          </div>
        )}

        {rncs.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center">
              <IconClipboardCheck size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhuma não conformidade registrada</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use o formulário abaixo para registrar RNCs.</p>
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
              {encerradas.map((r) => <RNCRow key={r.id} rnc={r} projetoId={id} />)}
            </div>
          </div>
        )}
      </DataTable>

      {/* Formulário */}
      <div className="bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-surface-border bg-[#FAFBFC]">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Nova Não Conformidade
          </span>
        </div>
        <div className="p-4">
          <AddRNCForm action={addRNC} nextNumero={nextNumero} />
        </div>
      </div>

    </div>
  );
}
