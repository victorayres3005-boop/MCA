"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Marco, StatusMarco } from "@/lib/types";

export async function getMarcos(projetoId: string): Promise<Marco[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("marcos")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("data_prevista")
    .order("ordem");
  return data ?? [];
}

export async function createMarco(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("marcos").insert({
    projeto_id:    projetoId,
    nome:          formData.get("nome") as string,
    descricao:     (formData.get("descricao") as string) || null,
    responsavel:   (formData.get("responsavel") as string) || null,
    data_prevista: formData.get("data_prevista") as string,
    status:        "pendente",
    ordem:         0,
  });

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/cronograma`);
  return {};
}

export async function updateMarco(
  projetoId: string,
  marcoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("marcos")
    .update({
      nome:          formData.get("nome") as string,
      descricao:     (formData.get("descricao") as string) || null,
      responsavel:   (formData.get("responsavel") as string) || null,
      data_prevista: formData.get("data_prevista") as string,
    })
    .eq("id", marcoId);

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/cronograma`);
  return {};
}

export async function setMarcoStatus(
  projetoId: string,
  marcoId: string,
  status: StatusMarco,
  dataReal?: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("marcos")
    .update({
      status,
      data_real: status === "concluido" ? (dataReal ?? new Date().toISOString().slice(0, 10)) : null,
    })
    .eq("id", marcoId);

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/cronograma`);
  return {};
}

export async function deleteMarco(
  projetoId: string,
  marcoId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("marcos").delete().eq("id", marcoId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/cronograma`);
  return {};
}
