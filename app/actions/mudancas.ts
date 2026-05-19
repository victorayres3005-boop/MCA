"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Mudanca } from "@/lib/types";

export async function getMudancas(projetoId: string): Promise<Mudanca[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mudancas")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("data_solicitacao", { ascending: false })
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createMudanca(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("mudancas").insert({
    projeto_id:       projetoId,
    numero:           (formData.get("numero") as string) || gerarNumero(),
    titulo:           formData.get("titulo") as string,
    descricao:        (formData.get("descricao") as string) || null,
    solicitante:      (formData.get("solicitante") as string) || null,
    data_solicitacao: (formData.get("data_solicitacao") as string) || new Date().toISOString().slice(0, 10),
    status:           (formData.get("status") as string) || "rascunho",
    impacto_prazo:    (formData.get("impacto_prazo") as string) ? parseInt(formData.get("impacto_prazo") as string) : null,
    impacto_custo:    (formData.get("impacto_custo") as string) ? parseFloat(formData.get("impacto_custo") as string) : null,
    impacto_escopo:   (formData.get("impacto_escopo") as string) || null,
    justificativa:    (formData.get("justificativa") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/mudancas`);
  return {};
}

export async function updateMudancaStatus(
  projetoId: string,
  mudancaId: string,
  status: string,
  aprovadoPor?: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("mudancas")
    .update({
      status,
      aprovado_por:   ["aprovada", "rejeitada"].includes(status) ? (aprovadoPor ?? null) : null,
      data_aprovacao: ["aprovada", "rejeitada"].includes(status) ? new Date().toISOString().slice(0, 10) : null,
    })
    .eq("id", mudancaId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/mudancas`);
  return {};
}

export async function deleteMudanca(
  projetoId: string,
  mudancaId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("mudancas").delete().eq("id", mudancaId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/mudancas`);
  return {};
}

function gerarNumero() {
  return `M-${String(Date.now()).slice(-4)}`;
}
