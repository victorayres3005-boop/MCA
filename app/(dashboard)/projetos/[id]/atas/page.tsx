import { notFound } from "next/navigation";
import { IconNotes } from "@tabler/icons-react";
import { getProjeto } from "@/app/actions/projetos";
import { getAtas, createAta } from "@/app/actions/atas";
import { AtaCard } from "@/components/atas/ata-card";
import { AddAtaForm } from "@/components/atas/add-ata-form";

interface Props { params: Promise<{ id: string }> }

export default async function AtasPage({ params }: Props) {
  const { id } = await params;
  const [projeto, atas] = await Promise.all([getProjeto(id), getAtas(id)]);
  if (!projeto) notFound();

  const addAta = createAta.bind(null, id);

  const hoje     = new Date();
  const atasMes  = atas.filter((a) => {
    const d = new Date(a.data_reuniao + "T00:00:00");
    return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
  }).length;
  const ultimaAta = [...atas].sort((a, b) => b.data_reuniao.localeCompare(a.data_reuniao))[0];
  const comEncaminhamentos = atas.filter((a) => a.encaminhamentos && a.encaminhamentos.trim().length > 0).length;

  function fmtDate(iso: string) {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="p-6 space-y-4 animate-page">

      {/* KPI strip */}
      {atas.length > 0 && (
        <div className="flex items-center gap-0 bg-white border border-surface-border rounded-xl overflow-hidden divide-x divide-surface-border animate-stagger">
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Total de atas</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{atas.length}</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Este mês</p>
            <p className="text-lg font-bold text-brand-600 tabular-nums">{atasMes}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">reuniões registradas</p>
          </div>
          <div className="flex-1 px-5 py-3.5">
            <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Com encaminhamentos</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{comEncaminhamentos}</p>
            <p className="text-[11px] text-text-disabled mt-0.5">de {atas.length} atas</p>
          </div>
          {ultimaAta && (
            <div className="flex-[2] px-5 py-3.5">
              <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1">Última reunião</p>
              <p className="text-[13px] font-semibold text-text-primary truncate">{ultimaAta.titulo}</p>
              <p className="text-[11px] text-text-disabled mt-0.5">{fmtDate(ultimaAta.data_reuniao)}</p>
            </div>
          )}
        </div>
      )}

      {/* Lista de atas */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        {/* Header da tabela */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-surface-border bg-surface-page/50">
          <span className="w-[13px]" />
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider w-[110px]">Data</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider flex-1">Reunião</span>
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">Conteúdo</span>
          <span className="w-6" />
        </div>

        {/* Atas ou estado vazio */}
        {atas.length > 0 ? (
          <div className="divide-y divide-surface-border">
            {atas.map((ata) => (
              <AtaCard key={ata.id} ata={ata} projetoId={id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-surface-input flex items-center justify-center">
              <IconNotes size={18} className="text-text-disabled" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-text-secondary">Nenhuma ata registrada</p>
              <p className="text-[12px] text-text-disabled mt-0.5">Use o formulário abaixo para registrar as atas de reunião.</p>
            </div>
          </div>
        )}
      </div>

      {/* Formulário de nova ata */}
      <div className="bg-white border border-surface-border rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-surface-border bg-surface-page/40">
          <span className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider">
            Nova Ata de Reunião
          </span>
        </div>
        <div className="p-4">
          <AddAtaForm action={addAta} />
        </div>
      </div>

    </div>
  );
}
