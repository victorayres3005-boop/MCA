import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getComunicacoes, createComunicacao } from "@/app/actions/comunicacao";
import { ComunicacaoRow } from "@/components/comunicacao/comunicacao-row";
import { AddComunicacaoForm } from "@/components/comunicacao/add-comunicacao-form";
import { IconMessage } from "@tabler/icons-react";

interface Props { params: Promise<{ id: string }> }

export default async function ComunicacaoPage({ params }: Props) {
  const { id } = await params;
  const [projeto, comunicacoes] = await Promise.all([getProjeto(id), getComunicacoes(id)]);
  if (!projeto) notFound();

  const addComunicacao = createComunicacao.bind(null, id);

  const semanais       = comunicacoes.filter((c) => c.frequencia === "semanal").length;
  const mensais        = comunicacoes.filter((c) => c.frequencia === "mensal").length;
  const responsaveis   = new Set(comunicacoes.map((c) => c.responsavel).filter(Boolean)).size;

  return (
    <div className="p-6 space-y-4 animate-page">

      {/* KPI strip */}
      {comunicacoes.length > 0 && (
        <div className="flex items-center gap-0 bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden divide-x divide-[#E9EBF0] animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Comunicações</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{comunicacoes.length}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">na matriz</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Semanais</p>
            <p className="text-lg font-bold text-brand-600 tabular-nums">{semanais}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Mensais</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{mensais}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Responsáveis</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{responsaveis}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">únicos</p>
          </div>
        </div>
      )}
      {/* Formulário de adição compacto */}
      <div className="bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-border bg-[#FAFBFC]">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Nova comunicação</span>
        </div>
        <div className="p-4">
          <AddComunicacaoForm action={addComunicacao} />
        </div>
      </div>

      {/* Matriz */}
      <div className="bg-white border border-[#E9EBF0] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-[#FAFBFC]">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Matriz de Comunicação
          </span>
          {comunicacoes.length > 0 && (
            <span className="text-[11px] text-text-disabled tabular-nums">
              {comunicacoes.length} {comunicacoes.length === 1 ? "item" : "itens"}
            </span>
          )}
        </div>

        {comunicacoes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E9EBF0] bg-[#FAFBFC]">
                  <th className="px-4 py-2 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-[200px]">Assunto</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-[90px]">Tipo</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Destinatários</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-[110px]">Responsável</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-[100px]">Frequência</th>
                  <th className="px-4 py-2 text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-[120px]">Meio</th>
                  <th className="px-4 py-2 w-16" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EBF0]">
                {comunicacoes.map((c) => <ComunicacaoRow key={c.id} c={c} />)}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center">
              <IconMessage size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhuma comunicação planejada</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use o formulário acima para montar a matriz.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
