import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconChevronLeft,
} from "@tabler/icons-react";
import { getProjeto } from "@/app/actions/projetos";
import { ProjectTabBar } from "@/components/projetos/project-tab-bar";
import type { Projeto } from "@/lib/types";

const SEM_DOT: Record<Projeto["semaforo"], string> = {
  verde:    "bg-green-500",
  amarelo:  "bg-amber-400",
  vermelho: "bg-red-500",
};

const SEM_BAR: Record<Projeto["semaforo"], string> = {
  verde:    "bg-green-500",
  amarelo:  "bg-amber-400",
  vermelho: "bg-red-500",
};

const STATUS_LABEL: Record<Projeto["status"], string> = {
  planejamento:  "Planejamento",
  execucao:      "Execução",
  monitoramento: "Monitoramento",
  encerrado:     "Encerrado",
  suspenso:      "Suspenso",
};

const STATUS_CLS: Record<Projeto["status"], string> = {
  planejamento:  "bg-blue-500/20 text-blue-200 border-blue-400/30",
  execucao:      "bg-teal-400/20 text-teal-200 border-teal-400/30",
  monitoramento: "bg-purple-500/20 text-purple-200 border-purple-400/30",
  encerrado:     "bg-green-500/20 text-green-200 border-green-400/30",
  suspenso:      "bg-white/10 text-white/50 border-white/20",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL",
    notation: "compact", maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
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
        {/* Gradient identity bar */}
        <div
          style={{ background: "linear-gradient(110deg, #0D2B45 0%, #0D2B45 40%, #0A7B72 75%, #00B4A6 100%)" }}
        >
          <div className="flex items-center gap-2 px-6 h-12">
            <Link
              href="/projetos"
              className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white/80 transition-colors shrink-0"
            >
              <IconChevronLeft size={12} />
              Carteira
            </Link>
            <span className="text-white/20 shrink-0">/</span>
            <h1 className="text-[14px] font-semibold text-white truncate">{projeto.nome}</h1>

            <div className="ml-2 flex items-center gap-2 shrink-0">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_CLS[projeto.status]}`}>
                {STATUS_LABEL[projeto.status]}
              </span>
              <span className={`w-2 h-2 rounded-full ${SEM_DOT[projeto.semaforo]}`} />
            </div>

            <div className="ml-auto flex items-center gap-4 shrink-0">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-16 h-[3px] bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${SEM_BAR[projeto.semaforo]} rounded-full`}
                    style={{ width: `${projeto.percentual_concluido}%` }}
                  />
                </div>
                <span className="text-[11px] text-white/60 tabular-nums">{projeto.percentual_concluido}%</span>
              </div>

              {projeto.data_fim_prevista && (
                <span className="hidden md:flex flex-col items-end leading-none gap-0.5">
                  <span className="text-[9px] text-white/40 uppercase tracking-wider">Prazo</span>
                  <span className="text-[11px] text-white/80 font-medium">{formatDate(projeto.data_fim_prevista)}</span>
                </span>
              )}

              {projeto.valor_contrato && projeto.valor_contrato > 0 && (
                <span className="hidden lg:flex flex-col items-end leading-none gap-0.5">
                  <span className="text-[9px] text-white/40 uppercase tracking-wider">Contrato</span>
                  <span className="text-[11px] text-white/80 font-medium">{formatCurrency(projeto.valor_contrato)}</span>
                </span>
              )}

              {projeto.codigo && (
                <span className="hidden md:block text-[10px] font-mono text-white/40 bg-white/10 px-1.5 py-0.5 rounded">
                  {projeto.codigo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab bar on white */}
        <div className="bg-white border-b border-surface-border">
          <ProjectTabBar projetoId={id} />
        </div>
      </div>

      {/* Conteúdo do módulo */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
