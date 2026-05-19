import Link from "next/link";
import { IconPlus, IconHelmet } from "@tabler/icons-react";
import { getContratadas } from "@/app/actions/contratadas";
import { ContratadasLista } from "@/components/contratadas/contratadas-lista";
import { PageTitle } from "@/components/shared/page-title";

export default async function ContratadasPage() {
  const contratadas = await getContratadas();

  return (
    <>
      <PageTitle
        title="Contratadas"
        eyebrow="Cadastro"
        icon={IconHelmet}
        action={
          <Link
            href="/contratadas/novo"
            className="inline-flex items-center gap-1.5 text-white text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: "#00B4A6" }}
          >
            <IconPlus size={13} />
            Nova contratada
          </Link>
        }
      />
      <div className="p-6">
        <ContratadasLista contratadas={contratadas} />
      </div>
    </>
  );
}
