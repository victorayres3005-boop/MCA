"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Recurso } from "@/lib/types";

export async function getRecursos(projetoId: string): Promise<Recurso[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recursos")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("nome");
  if (error) throw error;
  return data ?? [];
}

export async function createRecurso(
  projetoId: string,
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const dedicacaoRaw = formData.get("dedicacao") as string;
  const { error } = await supabase.from("recursos").insert({
    projeto_id:  projetoId,
    nome:        formData.get("nome") as string,
    papel:       (formData.get("papel") as string) || null,
    tipo:        formData.get("tipo") as string,
    dedicacao:   dedicacaoRaw ? Number(dedicacaoRaw) : 100,
    data_inicio: (formData.get("data_inicio") as string) || null,
    data_fim:    (formData.get("data_fim") as string) || null,
    observacao:  (formData.get("observacao") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/recursos`);
  return {};
}

export async function deleteRecurso(projetoId: string, recursoId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("recursos").delete().eq("id", recursoId);
  revalidatePath(`/projetos/${projetoId}/recursos`);
}
