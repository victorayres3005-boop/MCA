import { IconLayoutDashboard } from "@tabler/icons-react";
import { getProjetos } from "@/app/actions/projetos";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { ProjetosGrid } from "@/components/projetos/projetos-grid";
import { Alertas } from "@/components/dashboard/alertas";
import { SemaforoChart } from "@/components/dashboard/semaforo-chart";
import { StatusChart } from "@/components/dashboard/status-chart";
import { PageTitle } from "@/components/shared/page-title";

export default async function ProjetosPage() {
  const projetos = await getProjetos();
  const temProjetos = projetos.length > 0;

  return (
    <div className="flex flex-col h-full">

      <PageTitle
        title="Carteira de Obras"
        eyebrow="MCA Gestão"
        icon={IconLayoutDashboard}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 overflow-y-auto bg-[#F5F7FA]">
        <div className="p-6 space-y-5 max-w-[1400px]">

          {/* KPI cards — SnowUI metric row */}
          <KpiCards projetos={projetos} />

          {/* Layout 2-colunas: tabela + painel lateral */}
          <div className="flex gap-5 items-start">

            {/* Coluna principal — tabela de projetos */}
            <div className="flex-1 min-w-0 space-y-4">
              {temProjetos && <Alertas projetos={projetos} />}
              <ProjetosGrid projetos={projetos} />
            </div>

            {/* Painel lateral — analytics */}
            {temProjetos && (
              <div className="w-[280px] shrink-0 space-y-4">

                {/* Saúde da carteira — donut */}
                <div className="bg-white rounded-2xl border border-[#E9EBF0] p-5">
                  <p className="text-[12.5px] font-semibold text-text-primary mb-4">
                    Saúde da Carteira
                  </p>
                  <SemaforoChart projetos={projetos} />
                </div>

                {/* Distribuição por status — bar */}
                <div className="bg-white rounded-2xl border border-[#E9EBF0] p-5">
                  <p className="text-[12.5px] font-semibold text-text-primary mb-4">
                    Por Status
                  </p>
                  <StatusChart projetos={projetos} />
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
