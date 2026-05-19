"use client";

import { useState, useTransition } from "react";
import {
  IconChevronDown,
  IconChevronRight,
  IconTrash,
  IconUsers,
  IconMapPin,
} from "@tabler/icons-react";
import { deleteAta } from "@/app/actions/atas";
import type { Ata } from "@/lib/types";

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function countLines(text: string) {
  return text.split(/[,;\n]+/).filter((s) => s.trim()).length;
}

interface AtaCardProps {
  ata:       Ata;
  projetoId: string;
}

export function AtaCard({ ata, projetoId }: AtaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Remover ata "${ata.titulo}"?`)) return;
    startTransition(async () => { await deleteAta(projetoId, ata.id); });
  }

  const hasBody = ata.pauta || ata.decisoes || ata.encaminhamentos || ata.observacoes;
  const participantCount = ata.participantes ? countLines(ata.participantes) : 0;

  return (
    <div className={`border-b border-surface-border last:border-0 ${isPending ? "opacity-60" : ""}`}>
      {/* Cabeçalho do card */}
      <div
        className="flex items-center gap-3 px-4 py-3 hover:bg-surface-page/50 transition-colors cursor-pointer"
        onClick={() => hasBody && setExpanded((v) => !v)}
      >
        {/* Chevron */}
        <span className="text-text-disabled shrink-0 w-[13px]">
          {hasBody
            ? expanded
              ? <IconChevronDown size={13} />
              : <IconChevronRight size={13} />
            : null}
        </span>

        {/* Data */}
        <span className="text-[11px] font-mono text-text-disabled shrink-0 w-[110px]">
          {fmtDate(ata.data_reuniao)}
        </span>

        {/* Título */}
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-text-primary truncate">{ata.titulo}</p>
          <div className="flex items-center gap-3 mt-0.5">
            {ata.local_reuniao && (
              <span className="flex items-center gap-1 text-[11px] text-text-disabled">
                <IconMapPin size={10} />
                {ata.local_reuniao}
              </span>
            )}
            {participantCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-text-disabled">
                <IconUsers size={10} />
                {participantCount} participante{participantCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Badges de seções preenchidas */}
        <div className="flex items-center gap-1.5 shrink-0">
          {ata.pauta           && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">Pauta</span>}
          {ata.decisoes        && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200 uppercase tracking-wider">Decisões</span>}
          {ata.encaminhamentos && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">Encaminhamentos</span>}
        </div>

        {/* Delete */}
        <button
          onClick={(e) => { e.stopPropagation(); handleDelete(); }}
          className="shrink-0 flex items-center justify-center w-6 h-6 rounded text-text-disabled hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <IconTrash size={13} />
        </button>
      </div>

      {/* Painel expandido */}
      {expanded && hasBody && (
        <div className="bg-surface-page/40 border-t border-surface-border/60 px-10 py-4 grid grid-cols-2 gap-5 text-[12px]">
          {ata.pauta && (
            <Section label="Pauta">
              <pre className="whitespace-pre-wrap font-sans text-text-secondary leading-relaxed">{ata.pauta}</pre>
            </Section>
          )}
          {ata.decisoes && (
            <Section label="Decisões">
              <pre className="whitespace-pre-wrap font-sans text-text-secondary leading-relaxed">{ata.decisoes}</pre>
            </Section>
          )}
          {ata.encaminhamentos && (
            <Section label="Encaminhamentos">
              <pre className="whitespace-pre-wrap font-sans text-text-secondary leading-relaxed">{ata.encaminhamentos}</pre>
            </Section>
          )}
          {ata.observacoes && (
            <Section label="Observações">
              <pre className="whitespace-pre-wrap font-sans text-text-secondary leading-relaxed">{ata.observacoes}</pre>
            </Section>
          )}
          {ata.participantes && (
            <div className="col-span-2">
              <Section label="Participantes">
                <p className="text-text-secondary">{ata.participantes}</p>
              </Section>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-wider mb-1.5">{label}</p>
      {children}
    </div>
  );
}
