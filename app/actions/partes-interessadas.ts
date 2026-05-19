"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ParteInteressada } from "@/lib/types";

export async function getPartesInteressadas(projetoId: string): Promise<ParteInteressada[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partes_interessadas")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("influencia", { ascending: false })
    .order("interesse",  { ascending: false });
  return data ?? [];
}

export async function createParteInteressada(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("partes_interessadas").insert({
    projeto_id:           projetoId,
    nome:                 formData.get("nome") as string,
    organizacao:          (formData.get("organizacao") as string) || null,
    papel:                (formData.get("papel") as string) || null,
    contato:              (formData.get("contato") as string) || null,
    influencia:           parseInt(formData.get("influencia") as string, 10),
    interesse:            parseInt(formData.get("interesse") as string, 10),
    engajamento_atual:    formData.get("engajamento_atual") as string,
    engajamento_desejado: formData.get("engajamento_desejado") as string,
    estrategia:           (formData.get("estrategia") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/partes-interessadas`);
  return {};
}

export async function updateParteInteressada(
  projetoId: string,
  parteId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("partes_interessadas")
    .update({
      nome:                 formData.get("nome") as string,
      organizacao:          (formData.get("organizacao") as string) || null,
      papel:                (formData.get("papel") as string) || null,
      contato:              (formData.get("contato") as string) || null,
      influencia:           parseInt(formData.get("influencia") as string, 10),
      interesse:            parseInt(formData.get("interesse") as string, 10),
      engajamento_atual:    formData.get("engajamento_atual") as string,
      engajamento_desejado: formData.get("engajamento_desejado") as string,
      estrategia:           (formData.get("estrategia") as string) || null,
    })
    .eq("id", parteId);

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/partes-interessadas`);
  return {};
}

export async function deleteParteInteressada(
  projetoId: string,
  parteId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("partes_interessadas").delete().eq("id", parteId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/partes-interessadas`);
  return {};
}
