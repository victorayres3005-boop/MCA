import Link from "next/link";
import { IconPlus, IconBuilding } from "@tabler/icons-react";
import { getClientes } from "@/app/actions/clientes";
import { ClientesLista } from "@/components/clientes/clientes-lista";
import { PageTitle } from "@/components/shared/page-title";

export default async function ClientesPage() {
  const clientes = await getClientes();

  return (
    <>
      <PageTitle
        title="Clientes"
        eyebrow="Cadastro"
        icon={IconBuilding}
        action={
          <Link
            href="/clientes/novo"
            className="inline-flex items-center gap-1.5 text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <IconPlus size={13} />
            Novo cliente
          </Link>
        }
      />
      <div className="p-6">
        <ClientesLista clientes={clientes} />
      </div>
    </>
  );
}
