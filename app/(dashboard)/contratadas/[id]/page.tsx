import { notFound } from "next/navigation";
import { getContratada, updateContratada, deleteContratada } from "@/app/actions/contratadas";
import { ContratadaForm } from "@/components/contratadas/contratada-form";
import { PageTitle } from "@/components/shared/page-title";

interface Props { params: Promise<{ id: string }> }

export default async function ContratadaDetailPage({ params }: Props) {
  const { id } = await params;
  const contratada = await getContratada(id);
  if (!contratada) notFound();

  const update = updateContratada.bind(null, id);
  const remove = deleteContratada.bind(null, id);

  return (
    <>
      <PageTitle
        title={contratada.nome}
        backHref="/contratadas"
        backLabel="Contratadas"
      />
      <div className="p-8 max-w-3xl">
        <ContratadaForm action={update} defaultValues={contratada} deleteAction={remove} />
      </div>
    </>
  );
}
