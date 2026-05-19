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
  planejamento:  "bg-blue-50 text-blue-600 border-blue-200",
  execucao:      "bg-teal-50 text-teal-600 border-teal-200",
  monitoramento: "bg-purple-50 text-purple-600 border-purple-200",
  encerrado:     "bg-green-50 text-green-600 border-green-200",
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

        {/* Slim info bar */}
        <div className="flex items-center gap-3 px-6 h-[56px] bg-white border-b-2 border-[#00B4A6]">
          <Link
            href="/projetos"
            className="flex items-center gap-1 text-[11.5px] text-text-disabled hover:text-text-secondary transition-colors shrink-0"
          >
            <IconChevronLeft size={13} />
            Carteira
          </Link>
          <span className="text-[#E9EBF0] shrink-0 text-xs">/</span>

          <h1 className="text-[14px] font-semibold text-[#0D2B45] truncate flex-1 min-w-0">
            {projeto.nome}
          </h1>

          <div className="flex items-center gap-4 shrink-0">

            {/* Status */}
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-md border ${STATUS_CLS[projeto.status]}`}>
              {STATUS_LABEL[projeto.status]}
            </span>

            <div className="h-4 w-px bg-[#E9EBF0]" />

            {/* Saúde + progresso */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: SEM_COLOR[projeto.semaforo] }} />
              <div className="w-20 h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${projeto.percentual_concluido}%`, background: SEM_COLOR[projeto.semaforo] }}
                />
              </div>
              <span className="text-[12px] font-semibold text-[#0D2B45] tabular-nums w-8">
                {projeto.percentual_concluido}%
              </span>
            </div>

            {projeto.data_fim_prevista && (
              <>
                <div className="hidden md:block h-4 w-px bg-[#E9EBF0]" />
                <div className="hidden md:flex flex-col items-start leading-none gap-[3px]">
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-text-disabled">Prazo</span>
                  <span className="text-[12px] font-medium text-[#0D2B45]">{formatDate(projeto.data_fim_prevista)}</span>
                </div>
              </>
            )}

            {projeto.valor_contrato && projeto.valor_contrato > 0 && (
              <>
                <div className="hidden lg:block h-4 w-px bg-[#E9EBF0]" />
                <div className="hidden lg:flex flex-col items-start leading-none gap-[3px]">
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-text-disabled">Contrato</span>
                  <span className="text-[12px] font-medium text-[#0D2B45]">{formatCurrency(projeto.valor_contrato)}</span>
                </div>
              </>
            )}

            {projeto.codigo && (
              <>
                <div className="hidden md:block h-4 w-px bg-[#E9EBF0]" />
                <span className="hidden md:block text-[10.5px] font-mono text-text-disabled">
                  #{projeto.codigo}
                </span>
              </>
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
