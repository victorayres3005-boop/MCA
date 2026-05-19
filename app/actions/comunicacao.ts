"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Comunicacao } from "@/lib/types";

export async function getComunicacoes(projetoId: string): Promise<Comunicacao[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comunicacoes")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("tipo")
    .order("created_at");
  return data ?? [];
}

export async function createComunicacao(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("comunicacoes").insert({
    projeto_id:    projetoId,
    assunto:       formData.get("assunto") as string,
    tipo:          formData.get("tipo") as string,
    destinatarios: formData.get("destinatarios") as string,
    responsavel:   (formData.get("responsavel") as string) || null,
    frequencia:    formData.get("frequencia") as string,
    meio:          formData.get("meio") as string,
    observacao:    (formData.get("observacao") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/comunicacao`);
  return {};
}

export async function updateComunicacao(
  projetoId: string,
  comunicacaoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("comunicacoes")
    .update({
      assunto:       formData.get("assunto") as string,
      tipo:          formData.get("tipo") as string,
      destinatarios: formData.get("destinatarios") as string,
      responsavel:   (formData.get("responsavel") as string) || null,
      frequencia:    formData.get("frequencia") as string,
      meio:          formData.get("meio") as string,
      observacao:    (formData.get("observacao") as string) || null,
    })
    .eq("id", comunicacaoId);

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/comunicacao`);
  return {};
}

export async function deleteComunicacao(
  projetoId: string,
  comunicacaoId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("comunicacoes").delete().eq("id", comunicacaoId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/comunicacao`);
  return {};
}
