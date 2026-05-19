"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Aquisicao } from "@/lib/types";

export async function getAquisicoes(projetoId: string): Promise<Aquisicao[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("aquisicoes")
    .select("*, contratada:contratadas(id, nome, tipo), medicoes:aquisicoes_medicoes(*)")
    .eq("projeto_id", projetoId)
    .order("created_at");
  return (data ?? []) as Aquisicao[];
}

export async function createAquisicao(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("aquisicoes").insert({
    projeto_id:        projetoId,
    contratada_id:     (formData.get("contratada_id") as string) || null,
    objeto:            formData.get("objeto") as string,
    numero_contrato:   (formData.get("numero_contrato") as string) || null,
    valor_contrato:    parseFloat((formData.get("valor_contrato") as string) || "0"),
    data_inicio:       (formData.get("data_inicio") as string) || null,
    data_fim_prevista: (formData.get("data_fim_prevista") as string) || null,
    status:            (formData.get("status") as string) || "planejado",
    avaliacao:         (formData.get("avaliacao") as string) ? parseInt(formData.get("avaliacao") as string) : null,
    observacao:        (formData.get("observacao") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/aquisicoes`);
  return {};
}

export async function updateAquisicaoStatus(
  projetoId: string,
  aquisicaoId: string,
  status: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("aquisicoes")
    .update({ status, data_fim_real: status === "encerrado" ? new Date().toISOString().slice(0, 10) : null })
    .eq("id", aquisicaoId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/aquisicoes`);
  return {};
}

export async function deleteAquisicao(
  projetoId: string,
  aquisicaoId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("aquisicoes").delete().eq("id", aquisicaoId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/aquisicoes`);
  return {};
}

export async function addMedicao(
  aquisicaoId: string,
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("aquisicoes_medicoes").insert({
    aquisicao_id: aquisicaoId,
    competencia:  formData.get("competencia") as string,
    valor:        parseFloat((formData.get("valor") as string) || "0"),
    descricao:    (formData.get("descricao") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/aquisicoes`);
  return {};
}

export async function deleteMedicao(
  medicaoId: string,
  projetoId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("aquisicoes_medicoes").delete().eq("id", medicaoId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/aquisicoes`);
  return {};
}
