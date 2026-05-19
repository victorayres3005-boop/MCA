import { notFound } from "next/navigation";
import { getProjeto } from "@/app/actions/projetos";
import { getMarcos } from "@/app/actions/cronograma";
import { getOrcamentoItens } from "@/app/actions/custos";
import { getRiscos } from "@/app/actions/riscos";
import { getComunicacoes } from "@/app/actions/comunicacao";
import { getPartesInteressadas } from "@/app/actions/partes-interessadas";
import { getMudancas } from "@/app/actions/mudancas";
import { getAquisicoes } from "@/app/actions/aquisicoes";
import { RelatorioDoc } from "@/components/relatorio/relatorio-doc";

interface Props { params: Promise<{ id: string }> }

export default async function RelatorioPage({ params }: Props) {
  const { id } = await params;

  const [projeto, marcos, orcamento, riscos, comunicacoes, partes, mudancas, aquisicoes] = await Promise.all([
    getProjeto(id),
    getMarcos(id),
    getOrcamentoItens(id),
    getRiscos(id),
    getComunicacoes(id),
    getPartesInteressadas(id),
    getMudancas(id),
    getAquisicoes(id),
  ]);

  if (!projeto) notFound();

  const dataGeracao = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <RelatorioDoc
      projeto={projeto}
      marcos={marcos}
      orcamento={orcamento}
      riscos={riscos}
      comunicacoes={comunicacoes}
      partes={partes}
      mudancas={mudancas}
      aquisicoes={aquisicoes}
      dataGeracao={dataGeracao}
    />
  );
}
