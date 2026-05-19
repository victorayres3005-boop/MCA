import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { buildPrompt, type TipoDocumentoIA, type ContextoIA } from "@/lib/ia/prompts";
import type { Projeto } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Não autenticado", { status: 401 });

  const { projetoId, tipo } = (await request.json()) as {
    projetoId: string;
    tipo: TipoDocumentoIA;
  };

  const { data: projeto, error } = await supabase
    .from("projetos")
    .select("*, cliente:clientes(nome)")
    .eq("id", projetoId)
    .single();

  if (error || !projeto) return new Response("Projeto não encontrado", { status: 404 });

  // Montar contexto com dados adicionais conforme o tipo do documento
  const ctx: ContextoIA = { projeto: projeto as Projeto & { cliente?: { nome: string } | null } };

  if (tipo === "RACI" || tipo === "PGP") {
    const { data } = await supabase
      .from("recursos")
      .select("nome, papel, tipo")
      .eq("projeto_id", projetoId)
      .order("created_at");
    ctx.recursos = (data ?? []) as ContextoIA["recursos"];
  }

  if (tipo === "declaracao_escopo" || tipo === "PGP") {
    const { data } = await supabase
      .from("escopos")
      .select("declaracao, exclusoes, premissas, restricoes, criterios_aceite")
      .eq("projeto_id", projetoId)
      .single();
    ctx.escopo = data ?? null;
  }

  if (tipo === "declaracao_escopo" || tipo === "TEP" || tipo === "PGP") {
    const { data } = await supabase
      .from("marcos")
      .select("nome, data_prevista, status")
      .eq("projeto_id", projetoId)
      .order("data_prevista");
    ctx.marcos = (data ?? []) as ContextoIA["marcos"];
  }

  if (tipo === "TEP" || tipo === "PGP") {
    const { data } = await supabase
      .from("orcamento_itens")
      .select("valor_planejado, valor_realizado")
      .eq("projeto_id", projetoId);
    if (data && data.length > 0) {
      ctx.orcamento = {
        planejado: data.reduce((s, i) => s + i.valor_planejado, 0),
        realizado: data.reduce((s, i) => s + i.valor_realizado, 0),
      };
    }
  }

  if (tipo === "TEP" || tipo === "licoes_aprendidas") {
    const { data } = await supabase
      .from("encerramento")
      .select("licoes_aprendidas, pontos_positivos, pontos_melhoria, data_encerramento, aceite_formal, aceito_por")
      .eq("projeto_id", projetoId)
      .single();
    ctx.encerramento = data ?? null;
  }

  if (tipo === "PGP" || tipo === "licoes_aprendidas") {
    const [riscosRes, mudancasRes] = await Promise.all([
      supabase.from("riscos").select("descricao, status, categoria, probabilidade, impacto").eq("projeto_id", projetoId),
      supabase.from("mudancas").select("titulo, status, impacto_custo, impacto_prazo").eq("projeto_id", projetoId),
    ]);
    ctx.riscos = (riscosRes.data ?? []) as ContextoIA["riscos"];
    ctx.mudancas = (mudancasRes.data ?? []) as ContextoIA["mudancas"];
  }

  if (tipo === "licoes_aprendidas") {
    const { data } = await supabase
      .from("atas")
      .select("titulo, data_reuniao, decisoes, encaminhamentos")
      .eq("projeto_id", projetoId)
      .order("data_reuniao", { ascending: false })
      .limit(10);
    ctx.atas = (data ?? []) as ContextoIA["atas"];
  }

  const prompt = buildPrompt(tipo, ctx);

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = anthropic.messages.stream({
    model:      "claude-sonnet-4-6",
    max_tokens: 4096,
    messages:   [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type":      "text/plain; charset=utf-8",
      "Cache-Control":     "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
