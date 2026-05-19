import { notFound } from "next/navigation";
import { getCliente, updateCliente, deleteCliente } from "@/app/actions/clientes";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { PageTitle } from "@/components/shared/page-title";

interface Props { params: Promise<{ id: string }> }

export default async function ClienteDetailPage({ params }: Props) {
  const { id } = await params;
  const cliente = await getCliente(id);
  if (!cliente) notFound();

  const update = updateCliente.bind(null, id);
  const remove = deleteCliente.bind(null, id);

  return (
    <>
      <PageTitle
        title={cliente.nome}
        description="Editando dados do cliente"
        backHref="/clientes"
        backLabel="Clientes"
      />
      <div className="p-8 max-w-3xl">
        <ClienteForm action={update} defaultValues={cliente} deleteAction={remove} />
      </div>
    </>
  );
}
