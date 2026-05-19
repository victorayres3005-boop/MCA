import { createContratada } from "@/app/actions/contratadas";
import { ContratadaForm } from "@/components/contratadas/contratada-form";
import { PageTitle } from "@/components/shared/page-title";

export default function NovaContratadaPage() {
  return (
    <>
      <PageTitle
        title="Nova contratada"
        backHref="/contratadas"
        backLabel="Contratadas"
      />
      <div className="p-8 max-w-3xl">
        <ContratadaForm action={createContratada} />
      </div>
    </>
  );
}
