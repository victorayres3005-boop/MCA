import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getPartesInteressadas, createParteInteressada } from "@/app/actions/partes-interessadas";
import { ParteRow, PARTE_COLS } from "@/components/partes-interessadas/parte-row";
import { AddParteForm } from "@/components/partes-interessadas/add-parte-form";
import { DataTable } from "@/components/shared/data-table";
import { IconUsers } from "@tabler/icons-react";
import type { ParteInteressada } from "@/lib/types";

interface Props { params: Promise<{ id: string }> }

export default async function PartesInteressadasPage({ params }: Props) {
  const { id } = await params;
  const [projeto, partes] = await Promise.all([getProjeto(id), getPartesInteressadas(id)]);
  if (!projeto) notFound();

  const addParte = createParteInteressada.bind(null, id);
  const total    = partes.length;
  const comGap   = partes.filter((p: ParteInteressada) => p.engajamento_atual !== p.engajamento_desejado).length;
  const altaInfl = partes.filter((p: ParteInteressada) => p.influencia >= 4).length;

  return (
    <div className="p-6 space-y-4 animate-page">

      {/* KPI strip */}
      {total > 0 && (
        <div className="flex items-center gap-0 bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden divide-x divide-[#E9EBF0] animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Mapeadas</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{total}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Alta influência</p>
            <p className={`text-lg font-bold tabular-nums ${altaInfl > 0 ? "text-navy-700" : "text-text-primary"}`}>{altaInfl}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">influência ≥ 4</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Gap de engajamento</p>
            <p className={`text-lg font-bold tabular-nums ${comGap > 0 ? "text-amber-600" : "text-green-600"}`}>{comGap}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">{comGap === 0 ? "todos alinhados" : "precisam atenção"}</p>
          </div>
        </div>
      )}

      {/* Tabela de partes */}
      <DataTable
        cols={PARTE_COLS}
        headers={[
          { label: "Nome" },
          { label: "Papel / Organização" },
          { label: "Infl.", align: "center" },
          { label: "Int.", align: "center" },
          { label: "Engajamento" },
          { label: "Contato" },
          { label: "" },
        ]}
      >
        {partes.length > 0 && (
          <div className="divide-y divide-[#E9EBF0]">
            {partes.map((p) => <ParteRow key={p.id} parte={p} />)}
          </div>
        )}

        <div className={`border-t ${partes.length > 0 ? "border-dashed" : ""} border-surface-border p-4`}>
          <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-3">
            Nova parte interessada
          </p>
          <AddParteForm action={addParte} />
        </div>

        {total === 0 && (
          <div className="flex flex-col items-center gap-3 py-8 text-center border-t border-surface-border">
            <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center">
              <IconUsers size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhuma parte interessada mapeada</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Registre os stakeholders do projeto acima.</p>
            </div>
          </div>
        )}
      </DataTable>
    </div>
  );
}
