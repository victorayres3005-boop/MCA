import { getClientes } from "@/app/actions/clientes";
import { createProjeto } from "@/app/actions/projetos";
import { ProjetoForm } from "@/components/projetos/projeto-form";
import { PageTitle } from "@/components/shared/page-title";

export default async function NovoProjetoPage() {
  const clientes = await getClientes();

  return (
    <>
      <PageTitle
        title="Novo projeto"
        backHref="/projetos"
        backLabel="Carteira de Projetos"
      />
      <div className="p-8">
        <ProjetoForm action={createProjeto} clientes={clientes} />
      </div>
    </>
  );
}
