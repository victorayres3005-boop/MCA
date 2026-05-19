"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Ata } from "@/lib/types";

export async function getAtas(projetoId: string): Promise<Ata[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("atas")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("data_reuniao", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createAta(
  projetoId: string,
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("atas").insert({
    projeto_id:      projetoId,
    titulo:          formData.get("titulo") as string,
    data_reuniao:    formData.get("data_reuniao") as string,
    local_reuniao:   (formData.get("local_reuniao") as string) || null,
    participantes:   (formData.get("participantes") as string) || null,
    pauta:           (formData.get("pauta") as string) || null,
    decisoes:        (formData.get("decisoes") as string) || null,
    encaminhamentos: (formData.get("encaminhamentos") as string) || null,
    observacoes:     (formData.get("observacoes") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/atas`);
  return {};
}

export async function deleteAta(
  projetoId: string,
  ataId: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("atas").delete().eq("id", ataId);
  revalidatePath(`/projetos/${projetoId}/atas`);
}
