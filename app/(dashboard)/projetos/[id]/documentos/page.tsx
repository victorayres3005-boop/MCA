import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getDocumentos } from "@/app/actions/documentos";
import { DocumentoGerador } from "@/components/ia/documento-gerador";
import { DocumentosLista } from "@/components/ia/documentos-lista";

interface Props { params: Promise<{ id: string }> }

export default async function DocumentosPage({ params }: Props) {
  const { id }   = await params;
  const projeto  = await getProjeto(id);
  if (!projeto) notFound();

  const documentos = await getDocumentos(id);

  return (
    <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Gerador */}
          <div>
            <h2 className="text-sm font-semibold text-text-primary mb-3">✨ Gerar com IA</h2>
            <DocumentoGerador projetoId={id} />
          </div>

          {/* Documentos salvos */}
          <div>
            <h2 className="text-sm font-semibold text-text-primary mb-3">
              Documentos salvos
              {documentos.length > 0 && (
                <span className="ml-2 text-xs font-normal text-text-disabled">({documentos.length})</span>
              )}
            </h2>
            <DocumentosLista documentos={documentos} projetoId={id} />
          </div>
        </div>
    </div>
  );
}
