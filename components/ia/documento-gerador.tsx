"use client";

import { useState, useTransition, useRef } from "react";
import {
  IconSparkles, IconLoader2, IconDeviceFloppy,
  IconCheck, IconX, IconRefresh,
} from "@tabler/icons-react";
import { salvarDocumento } from "@/app/actions/documentos";
import { DOCUMENTOS_IA } from "@/lib/ia/prompts";
import type { TipoDocumentoIA } from "@/lib/ia/prompts";

type Stage = "idle" | "gerando" | "editando" | "salvando" | "salvo" | "erro";

interface DocumentoGeradorProps {
  projetoId: string;
  onSalvo?:  () => void;
}

export function DocumentoGerador({ projetoId, onSalvo }: DocumentoGeradorProps) {
  const [tipo,     setTipo]     = useState<TipoDocumentoIA>("TAP");
  const [stage,    setStage]    = useState<Stage>("idle");
  const [conteudo, setConteudo] = useState("");
  const [erro,     setErro]     = useState("");
  const [isSaving, startSaving] = useTransition();
  const abortRef  = useRef<AbortController | null>(null);

  const docInfo = DOCUMENTOS_IA.find((d) => d.tipo === tipo)!;

  async function handleGerar() {
    setStage("gerando");
    setConteudo("");
    setErro("");
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ia/gerar", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ projetoId, tipo }),
        signal:  abortRef.current.signal,
      });

      if (!res.ok) {
        setErro("Erro ao conectar com a IA. Verifique a ANTHROPIC_API_KEY.");
        setStage("erro");
        return;
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let   texto   = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        texto += decoder.decode(value, { stream: true });
        setConteudo(texto);
      }
      setStage("editando");
    } catch (e: unknown) {
      if ((e as Error).name === "AbortError") setStage("idle");
      else { setErro("Falha na geração. Tente novamente."); setStage("erro"); }
    }
  }

  function handleCancelar() {
    abortRef.current?.abort();
    setStage("idle");
    setConteudo("");
  }

  function handleSalvar() {
    startSaving(async () => {
      setStage("salvando");
      const fd = new FormData();
      fd.set("projeto_id", projetoId);
      fd.set("tipo",       tipo);
      fd.set("titulo",     docInfo.titulo);
      fd.set("conteudo",   conteudo);
      const res = await salvarDocumento(fd);
      if (res?.error) { setErro(res.error); setStage("editando"); }
      else { setStage("salvo"); onSalvo?.(); setTimeout(() => setStage("idle"), 1500); }
    });
  }

  return (
    <div className="space-y-0">
      {/* Seletor de tipo — chips compactos */}
      {(stage === "idle" || stage === "erro") && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-1.5">
            {DOCUMENTOS_IA.map((doc) => (
              <button
                key={doc.tipo}
                type="button"
                onClick={() => setTipo(doc.tipo as TipoDocumentoIA)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                  tipo === doc.tipo
                    ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500/20"
                    : "border-surface-border hover:border-brand-300 hover:bg-surface-input/50"
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                  tipo === doc.tipo ? "bg-brand-500" : "bg-surface-border"
                }`} />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-text-primary leading-none">{doc.titulo}</p>
                  <p className="text-[11px] text-text-disabled mt-0.5 leading-snug line-clamp-1">{doc.descricao}</p>
                </div>
              </button>
            ))}
          </div>

          {erro && (
            <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            onClick={handleGerar}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-700 text-white text-[12px] font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <IconSparkles size={14} />
            Gerar com IA
          </button>
        </div>
      )}

      {/* Gerando */}
      {stage === "gerando" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-text-secondary">
              <IconLoader2 size={14} className="animate-spin text-brand-500" />
              <span>Gerando <strong className="text-text-primary">{docInfo.titulo}</strong>…</span>
            </div>
            <button onClick={handleCancelar}
              className="text-[11px] text-text-disabled hover:text-text-secondary flex items-center gap-1 transition-colors">
              <IconX size={12} /> Cancelar
            </button>
          </div>
          <div className="bg-surface-input rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            <pre className="text-[11px] text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
              {conteudo}
              <span className="inline-block w-1.5 h-3 bg-brand-500 ml-0.5 animate-pulse align-middle" />
            </pre>
          </div>
        </div>
      )}

      {/* Editando */}
      {(stage === "editando" || stage === "salvando") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[12px] text-text-secondary">
              Revise e salve o documento.
            </p>
            <button onClick={() => { setStage("idle"); setConteudo(""); }}
              className="text-[11px] text-text-disabled hover:text-text-secondary flex items-center gap-1 transition-colors">
              <IconRefresh size={12} /> Gerar novo
            </button>
          </div>
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            rows={20}
            className="w-full px-3 py-2.5 text-[11px] font-mono bg-surface-input border border-surface-border rounded-lg text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none leading-relaxed"
          />
          <div className="flex gap-2">
            <button onClick={handleSalvar} disabled={isSaving || stage === "salvando"}
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-700 text-white text-[12px] font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
              {stage === "salvando" ? <IconLoader2 size={13} className="animate-spin" /> : <IconDeviceFloppy size={13} />}
              Salvar
            </button>
            <button onClick={() => { setStage("idle"); setConteudo(""); }}
              className="text-[12px] text-text-secondary hover:text-text-primary border border-surface-border px-3 py-2 rounded-lg transition-colors">
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* Salvo */}
      {stage === "salvo" && (
        <div className="flex items-center gap-2 text-green-600 text-[13px] font-medium py-6 justify-center">
          <IconCheck size={16} />
          Documento salvo com sucesso!
        </div>
      )}
    </div>
  );
}
