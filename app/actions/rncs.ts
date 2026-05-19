"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { RNC } from "@/lib/types";

export async function getRNCs(projetoId: string): Promise<RNC[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rncs")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("data_abertura", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createRNC(
  projetoId: string,
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("rncs").insert({
    projeto_id:     projetoId,
    numero:         formData.get("numero") as string,
    titulo:         formData.get("titulo") as string,
    descricao:      (formData.get("descricao") as string) || null,
    categoria:      formData.get("categoria") as string,
    status:         formData.get("status") as string,
    responsavel:    (formData.get("responsavel") as string) || null,
    data_abertura:  formData.get("data_abertura") as string,
    acao_corretiva: (formData.get("acao_corretiva") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/qualidade`);
  return {};
}

export async function updateRNCStatus(
  projetoId: string,
  rncId: string,
  status: string,
): Promise<void> {
  const supabase = await createClient();
  const patch: Record<string, unknown> = { status };
  if (status === "fechada") patch.data_fechamento = new Date().toISOString().slice(0, 10);
  await supabase.from("rncs").update(patch).eq("id", rncId);
  revalidatePath(`/projetos/${projetoId}/qualidade`);
}

export async function deleteRNC(projetoId: string, rncId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("rncs").delete().eq("id", rncId);
  revalidatePath(`/projetos/${projetoId}/qualidade`);
}
