import Link from "next/link";
import { notFound } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { getProjeto } from "@/app/actions/projetos";
import { ProjectTabBar } from "@/components/projetos/project-tab-bar";
import type { Projeto } from "@/lib/types";

const SEM_COLOR: Record<Projeto["semaforo"], string> = {
  verde:    "#16A34A",
  amarelo:  "#F59E0B",
  vermelho: "#DC2626",
};

const STATUS_LABEL: Record<Projeto["status"], string> = {
  planejamento:  "Planejamento",
  execucao:      "Execução",
  monitoramento: "Monitoramento",
  encerrado:     "Encerrado",
  suspenso:      "Suspenso",
};

const STATUS_CLS: Record<Projeto["status"], string> = {
  planejamento:  "bg-blue-500/20 text-blue-200 border-blue-400/25",
  execucao:      "bg-teal-400/20 text-teal-200 border-teal-400/25",
  monitoramento: "bg-purple-500/20 text-purple-200 border-purple-400/25",
  encerrado:     "bg-green-500/20 text-green-200 border-green-400/25",
  suspenso:      "bg-white/10 text-white/45 border-white/15",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short",
  });
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function ProjetoLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const projeto = await getProjeto(id);
  if (!projeto) notFound();

  return (
    <div className="flex flex-col h-full">

      {/* Header do projeto */}
      <div className="print:hidden shrink-0">

        {/* Slim brand bar */}
        <div
          className="flex items-center gap-3 px-6 h-[56px]"
          style={{
            background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 50%, #0A7B72 80%, #00B4A6 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Link
            href="/projetos"
            className="flex items-center gap-1 text-[11.5px] text-white/50 hover:text-white/80 transition-colors shrink-0"
          >
            <IconChevronLeft size={13} />
            Carteira
          </Link>
          <span className="text-white/15 shrink-0 text-xs">/</span>

          <h1 className="text-[14px] font-semibold text-white truncate flex-1 min-w-0">
            {projeto.nome}
          </h1>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`text-[10.5px] font-medium px-2 py-0.5 rounded-md border ${STATUS_CLS[projeto.status]}`}
            >
              {STATUS_LABEL[projeto.status]}
            </span>

            <span
              className="w-2 h-2 rounded-full"
              style={{ background: SEM_COLOR[projeto.semaforo] }}
            />

            {/* Progresso */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-16 h-[3px] bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${projeto.percentual_concluido}%`,
                    background: SEM_COLOR[projeto.semaforo],
                  }}
                />
              </div>
              <span className="text-[11px] font-mono text-white/55 tabular-nums">
                {projeto.percentual_concluido}%
              </span>
            </div>

            {projeto.data_fim_prevista && (
              <div className="hidden md:flex flex-col items-end leading-none gap-0.5">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-white/30">Prazo</span>
                <span className="text-[11px] font-mono text-white/70">{formatDate(projeto.data_fim_prevista)}</span>
              </div>
            )}

            {projeto.valor_contrato && projeto.valor_contrato > 0 && (
              <div className="hidden lg:flex flex-col items-end leading-none gap-0.5">
                <span className="text-[9px] font-semibold uppercase tracking-wider text-white/30">Contrato</span>
                <span className="text-[11px] font-mono text-white/70">{formatCurrency(projeto.valor_contrato)}</span>
              </div>
            )}

            {projeto.codigo && (
              <span className="hidden md:block text-[10px] font-mono text-white/35 bg-white/[0.08] px-1.5 py-0.5 rounded">
                {projeto.codigo}
              </span>
            )}
          </div>
        </div>

        {/* Tab bar — branca, SnowUI style */}
        <div className="bg-white border-b border-[#E9EBF0]">
          <ProjectTabBar projetoId={id} />
        </div>
      </div>

      {/* Conteúdo do módulo */}
      <div className="flex-1 overflow-y-auto bg-[#F5F7FA]">
        {children}
      </div>
    </div>
  );
}
