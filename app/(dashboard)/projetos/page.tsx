import { IconLayoutDashboard } from "@tabler/icons-react";
import { getProjetos } from "@/app/actions/projetos";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { ProjetosGrid } from "@/components/projetos/projetos-grid";
import { Alertas } from "@/components/dashboard/alertas";
import { SemaforoChart } from "@/components/dashboard/semaforo-chart";
import { StatusChart } from "@/components/dashboard/status-chart";

export default async function ProjetosPage() {
  const projetos = await getProjetos();
  const temProjetos = projetos.length > 0;

  return (
    <div className="flex flex-col h-full">

      {/* Brand header */}
      <div
        className="shrink-0 flex items-center justify-between px-7 h-[60px] print:hidden"
        style={{
          background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 50%, #0A7B72 80%, #00B4A6 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.10)" }}
          >
            <IconLayoutDashboard size={15} className="text-white/80" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35 leading-none mb-[5px]">
              MCA Gestão
            </p>
            <h1 className="text-[15px] font-semibold text-white tracking-tight leading-none">
              Carteira de Obras
            </h1>
          </div>
        </div>
      </div>

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
