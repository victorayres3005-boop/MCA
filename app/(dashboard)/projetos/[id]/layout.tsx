import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconChevronLeft,
  IconLayoutList,
  IconCalendar,
  IconCoin,
  IconAlertTriangle,
  IconMessage,
  IconUsers,
  IconSparkles,
  IconPencil,
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
  planejamento:  "bg-blue-50 text-blue-600 border-blue-100",
  execucao:      "bg-teal-50 text-teal-700 border-teal-200",
  monitoramento: "bg-purple-50 text-purple-600 border-purple-100",
  encerrado:     "bg-green-50 text-green-700 border-green-200",
  suspenso:      "bg-gray-100 text-gray-500 border-gray-200",
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
      <div className="print:hidden bg-white border-b border-surface-border shrink-0">
        <div className="h-[3px] bg-brand-gradient" />

        {/* Breadcrumb + título */}
        <div className="flex items-center gap-2 px-6 h-11 border-b border-surface-border/50">
          <Link
            href="/projetos"
            className="flex items-center gap-1 text-[12px] text-text-disabled hover:text-brand-700 transition-colors shrink-0"
          >
            <IconChevronLeft size={13} />
            Carteira
          </Link>
          <span className="text-surface-border text-sm shrink-0">/</span>
          <h1 className="text-[14px] font-semibold text-text-primary truncate">{projeto.nome}</h1>

          {/* Badges */}
          <div className="ml-2 flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${STATUS_CLS[projeto.status]}`}>
              {STATUS_LABEL[projeto.status]}
            </span>
            <span className={`w-2 h-2 rounded-full ${SEM_DOT[projeto.semaforo]}`} />
          </div>

          {/* Metrics strip — right side */}
          <div className="ml-auto flex items-center gap-4 shrink-0">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-16 h-[3px] bg-surface-input rounded-full overflow-hidden">
                <div
                  className={`h-full ${SEM_BAR[projeto.semaforo]} rounded-full`}
                  style={{ width: `${projeto.percentual_concluido}%` }}
                />
              </div>
              <span className="text-[11px] text-text-disabled tabular-nums">{projeto.percentual_concluido}%</span>
            </div>

            {projeto.data_fim_prevista && (
              <span className="hidden md:block text-[11px] text-text-disabled">
                Prazo: <span className="text-text-secondary font-medium">{formatDate(projeto.data_fim_prevista)}</span>
              </span>
            )}

            {projeto.valor_contrato && projeto.valor_contrato > 0 && (
              <span className="hidden lg:block text-[11px] text-text-disabled">
                Contrato: <span className="text-text-secondary font-medium">{formatCurrency(projeto.valor_contrato)}</span>
              </span>
            )}

            {projeto.codigo && (
              <span className="hidden md:block text-[11px] font-mono text-text-disabled bg-surface-input px-1.5 py-0.5 rounded">
                {projeto.codigo}
              </span>
            )}
          </div>
        </div>

        {/* Tabs de módulos */}
        <ProjectTabBar projetoId={id} />
      </div>

      {/* Conteúdo do módulo */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
