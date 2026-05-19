import { notFound } from "next/navigation";
import { IconCircleCheck, IconCalendar, IconCoin, IconList } from "@tabler/icons-react";
import { getProjeto } from "@/app/actions/projetos";
import { getEncerramento, upsertEncerramento } from "@/app/actions/encerramento";
import { getMarcos } from "@/app/actions/cronograma";
import { getOrcamentoItens } from "@/app/actions/custos";
import { EncerramentoForm } from "@/components/encerramento/encerramento-form";

interface Props { params: Promise<{ id: string }> }

function fmtCurrency(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: "compact", maximumFractionDigits: 1 }).format(v);
}

export default async function EncerramentoPage({ params }: Props) {
  const { id } = await params;
  const [projeto, enc, marcos, orcamento] = await Promise.all([
    getProjeto(id),
    getEncerramento(id),
    getMarcos(id),
    getOrcamentoItens(id),
  ]);
  if (!projeto) notFound();

  const saveEncerramento = upsertEncerramento.bind(null, id);

  const marcosTotal     = marcos.length;
  const marcosConcluidos = marcos.filter((m) => m.status === "concluido").length;
  const valorPlanejado  = orcamento.reduce((s, i) => s + i.valor_planejado, 0);
  const valorRealizado  = orcamento.reduce((s, i) => s + i.valor_realizado, 0);
  const cpi = valorPlanejado > 0 ? valorRealizado / valorPlanejado : null;

  return (
    <div className="p-6 space-y-5 animate-page">

      {/* Header de status */}
      <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
        enc?.aceite_formal
          ? "border-green-300 bg-green-50"
          : "border-surface-border bg-white"
      }`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          enc?.aceite_formal ? "bg-green-100" : "bg-surface-input"
        }`}>
          <IconCircleCheck size={20} className={enc?.aceite_formal ? "text-green-600" : "text-text-disabled"} />
        </div>
        <div>
          <p className={`text-[13px] font-semibold ${enc?.aceite_formal ? "text-green-700" : "text-text-primary"}`}>
            {enc?.aceite_formal ? "Projeto encerrado com aceite formal" : "Encerramento pendente de aceite formal"}
          </p>
          {enc?.aceite_formal && enc.aceito_por && (
            <p className="text-[12px] text-green-600">
              Aceito por {enc.aceito_por}
              {enc.data_encerramento && ` · ${new Date(enc.data_encerramento + "T00:00:00").toLocaleDateString("pt-BR")}`}
            </p>
          )}
          {!enc?.aceite_formal && (
            <p className="text-[12px] text-text-disabled">{projeto.percentual_concluido}% concluído · Preencha os campos abaixo e conceda o aceite formal</p>
          )}
        </div>
      </div>

      {/* KPIs resumo */}
      <div className="grid grid-cols-4 gap-3 animate-stagger">
        <div className="bg-white border border-surface-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconList size={14} className="text-text-disabled" />
            <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Marcos</span>
          </div>
          <p className="text-2xl font-bold text-text-primary tabular-nums">{marcosConcluidos}<span className="text-sm font-normal text-text-disabled">/{marcosTotal}</span></p>
          <p className="text-[11px] text-text-disabled mt-0.5">concluídos</p>
        </div>

        <div className="bg-white border border-surface-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconCalendar size={14} className="text-text-disabled" />
            <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Conclusão</span>
          </div>
          <p className="text-2xl font-bold text-text-primary tabular-nums">{projeto.percentual_concluido}%</p>
          <p className="text-[11px] text-text-disabled mt-0.5">progresso geral</p>
        </div>

        <div className="bg-white border border-surface-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconCoin size={14} className="text-text-disabled" />
            <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Custo Realizado</span>
          </div>
          <p className="text-2xl font-bold text-text-primary tabular-nums">{fmtCurrency(valorRealizado)}</p>
          <p className="text-[11px] text-text-disabled mt-0.5">de {fmtCurrency(valorPlanejado)} planejados</p>
        </div>

        <div className="bg-white border border-surface-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <IconCoin size={14} className="text-text-disabled" />
            <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">CPI</span>
          </div>
          <p className={`text-2xl font-bold tabular-nums ${
            cpi === null ? "text-text-disabled"
            : cpi >= 1 ? "text-green-600"
            : cpi >= 0.9 ? "text-amber-500"
            : "text-red-600"
          }`}>
            {cpi !== null ? cpi.toFixed(2) : "—"}
          </p>
          <p className="text-[11px] text-text-disabled mt-0.5">índice custo/planejado</p>
        </div>
      </div>

      {/* Formulário de encerramento */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-surface-border bg-surface-page/40">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Termo de Encerramento
          </span>
        </div>
        <div className="p-5">
          <EncerramentoForm action={saveEncerramento} encerramento={enc} />
        </div>
      </div>

    </div>
  );
}
