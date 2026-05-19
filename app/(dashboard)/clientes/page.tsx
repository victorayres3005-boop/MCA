import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { getClientes } from "@/app/actions/clientes";
import { ClientesLista } from "@/components/clientes/clientes-lista";
import { PageTitle } from "@/components/shared/page-title";

export default async function ClientesPage() {
  const clientes = await getClientes();

  return (
    <>
      <PageTitle
        title="Clientes"
        description="Empresas e organizações vinculadas aos projetos"
        action={
          <Link
            href="/clientes/novo"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <IconPlus size={15} />
            Novo cliente
          </Link>
        }
      />
      <div className="p-8">
        <ClientesLista clientes={clientes} />
      </div>
    </>
  );
}
