"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Atividade, StatusAtividade } from "@/lib/types";

export async function getAtividades(projetoId: string): Promise<Atividade[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("atividades")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("ordem")
    .order("data_fim_prevista");
  return data ?? [];
}

export async function createAtividade(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("atividades").insert({
    projeto_id:        projetoId,
    nome:              formData.get("nome") as string,
    responsavel:       (formData.get("responsavel") as string) || null,
    data_fim_prevista: formData.get("data_fim_prevista") as string,
    status:            "pendente",
    ordem:             0,
  });
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/cronograma`);
  return {};
}

export async function updateAtividade(
  projetoId: string,
  atividadeId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("atividades")
    .update({
      nome:              formData.get("nome") as string,
      responsavel:       (formData.get("responsavel") as string) || null,
      data_fim_prevista: formData.get("data_fim_prevista") as string,
    })
    .eq("id", atividadeId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/cronograma`);
  return {};
}

export async function setAtividadeStatus(
  projetoId: string,
  atividadeId: string,
  status: StatusAtividade
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const updates: Record<string, unknown> = { status };
  if (status === "concluida") {
    updates.data_fim_real = new Date().toISOString().slice(0, 10);
    updates.percentual_concluido = 100;
  } else if (status === "pendente") {
    updates.data_fim_real = null;
    updates.percentual_concluido = 0;
  }
  const { error } = await supabase
    .from("atividades")
    .update(updates)
    .eq("id", atividadeId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/cronograma`);
  return {};
}

export async function deleteAtividade(
  projetoId: string,
  atividadeId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("atividades").delete().eq("id", atividadeId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/cronograma`);
  return {};
}
