import { notFound } from "next/navigation";
import { getClientes } from "@/app/actions/clientes";
import { getProjeto, updateProjeto, deleteProjeto } from "@/app/actions/projetos";
import { ProjetoForm } from "@/components/projetos/projeto-form";

interface Props { params: Promise<{ id: string }> }

export default async function ProjetoDetailPage({ params }: Props) {
  const { id } = await params;
  const [projeto, clientes] = await Promise.all([getProjeto(id), getClientes()]);
  if (!projeto) notFound();

  const update = updateProjeto.bind(null, id);
  const remove = deleteProjeto.bind(null, id);

  return (
    <div className="p-6">
      <ProjetoForm
        action={update}
        deleteAction={remove}
        defaultValues={projeto}
        clientes={clientes}
      />
    </div>
  );
}
