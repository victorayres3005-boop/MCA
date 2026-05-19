import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { getContratadas } from "@/app/actions/contratadas";
import { ContratadasLista } from "@/components/contratadas/contratadas-lista";
import { PageTitle } from "@/components/shared/page-title";

export default async function ContratadasPage() {
  const contratadas = await getContratadas();

  return (
    <>
      <PageTitle
        title="Contratadas"
        description="Construtoras, projetistas e fornecedores dos projetos"
        action={
          <Link
            href="/contratadas/novo"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <IconPlus size={15} />
            Nova contratada
          </Link>
        }
      />
      <div className="p-8">
        <ContratadasLista contratadas={contratadas} />
      </div>
    </>
  );
}
