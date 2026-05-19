import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getEscopo, getEapItens, upsertEscopo } from "@/app/actions/escopo";
import { DeclaracaoForm } from "@/components/escopo/declaracao-form";
import { EapLista } from "@/components/escopo/eap-lista";

interface Props { params: Promise<{ id: string }> }

export default async function EscopoPage({ params }: Props) {
  const { id } = await params;
  const [projeto, escopo, eapItens] = await Promise.all([
    getProjeto(id), getEscopo(id), getEapItens(id),
  ]);
  if (!projeto) notFound();

  const saveEscopo = upsertEscopo.bind(null, id);

  return (
    <div className="p-6 space-y-5 animate-page">
      {/* Declaração de escopo */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-surface-border bg-surface-page/40">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Declaração de Escopo
          </span>
          <span className="ml-auto text-[11px] text-text-disabled">
            {escopo ? "Preenchido" : "Não preenchido"}
          </span>
          <span className={`w-2 h-2 rounded-full ${escopo?.declaracao ? "bg-green-500" : "bg-surface-border"}`} />
        </div>
        <div className="p-5">
          <DeclaracaoForm escopo={escopo} action={saveEscopo} />
        </div>
      </div>

      {/* EAP */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border bg-surface-page/40">
          <div>
            <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
              EAP — Estrutura Analítica do Projeto
            </span>
            <p className="text-[11px] text-text-disabled mt-0.5">
              Hierarquia de entregas. Hover para adicionar subitens. Duplo-clique para renomear.
            </p>
          </div>
          <span className="text-[11px] text-text-disabled tabular-nums shrink-0 ml-4">
            {eapItens.length} {eapItens.length === 1 ? "elemento" : "elementos"}
          </span>
        </div>
        <div className="p-4">
          <EapLista projetoId={id} itens={eapItens} />
        </div>
      </div>
    </div>
  );
}
