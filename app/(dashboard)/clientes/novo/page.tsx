import { createCliente } from "@/app/actions/clientes";
import { ClienteForm } from "@/components/clientes/cliente-form";
import { PageTitle } from "@/components/shared/page-title";

export default function NovoClientePage() {
  return (
    <>
      <PageTitle
        title="Novo cliente"
        description="Cadastre uma nova empresa contratante"
        backHref="/clientes"
        backLabel="Clientes"
      />
      <div className="p-8 max-w-3xl">
        <ClienteForm action={createCliente} />
      </div>
    </>
  );
}
