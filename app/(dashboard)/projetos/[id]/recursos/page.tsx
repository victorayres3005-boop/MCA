import { notFound } from "next/navigation";
import { IconUsersGroup } from "@tabler/icons-react";
import { getProjeto } from "@/app/actions/projetos";
import { getRecursos, createRecurso } from "@/app/actions/recursos";
import { RecursoRow } from "@/components/recursos/recurso-row";
import { AddRecursoForm } from "@/components/recursos/add-recurso-form";

interface Props { params: Promise<{ id: string }> }

export default async function RecursosPage({ params }: Props) {
  const { id } = await params;
  const [projeto, recursos] = await Promise.all([getProjeto(id), getRecursos(id)]);
  if (!projeto) notFound();

  const addRecurso = createRecurso.bind(null, id);

  const internos    = recursos.filter((r) => r.tipo === "interno").length;
  const externos    = recursos.filter((r) => r.tipo === "externo" || r.tipo === "contratado").length;
  const dedicacaoMedia = recursos.length
    ? Math.round(recursos.reduce((s, r) => s + (r.dedicacao ?? 100), 0) / recursos.length)
    : 0;

  return (
    <div className="p-6 space-y-4 animate-page">

      {/* KPI strip */}
      {recursos.length > 0 && (
        <div className="flex items-center gap-0 bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden divide-x divide-[#E9EBF0] animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Equipe</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{recursos.length}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">membros</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Internos</p>
            <p className="text-lg font-bold text-blue-600 tabular-nums">{internos}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Externos</p>
            <p className="text-lg font-bold text-amber-500 tabular-nums">{externos}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">contratados</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Dedicação Média</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{dedicacaoMedia}%</p>
          </div>
        </div>
      )}

      {/* Tabela */}
      <div className="bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden">
        <div
          className="grid items-center gap-3 px-4 py-2 border-b border-surface-border bg-[#FAFBFC]"
          style={{ gridTemplateColumns: "1fr 130px 100px 80px 180px 32px" }}
        >
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Recurso</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Tipo</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Dedicação</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Início</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Saída</span>
          <span />
        </div>

        {recursos.length > 0 ? (
          <div className="divide-y divide-[#E9EBF0]">
            {recursos.map((r) => <RecursoRow key={r.id} recurso={r} projetoId={id} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center">
              <IconUsersGroup size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhum recurso alocado</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use o formulário abaixo para montar a equipe do projeto.</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulário */}
      <div className="bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-surface-border bg-[#FAFBFC]">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Adicionar Recurso
          </span>
        </div>
        <div className="p-4">
          <AddRecursoForm action={addRecurso} />
        </div>
      </div>

    </div>
  );
}
