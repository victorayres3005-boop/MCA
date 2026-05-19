"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Risco, StatusRisco } from "@/lib/types";

export async function getRiscos(projetoId: string): Promise<Risco[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("riscos")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createRisco(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("riscos").insert({
    projeto_id:    projetoId,
    descricao:     formData.get("descricao") as string,
    categoria:     formData.get("categoria") as string,
    probabilidade: parseInt(formData.get("probabilidade") as string, 10),
    impacto:       parseInt(formData.get("impacto") as string, 10),
    plano_resposta: (formData.get("plano_resposta") as string) || null,
    responsavel:   (formData.get("responsavel") as string) || null,
    status:        "identificado",
  });

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/riscos`);
  return {};
}

export async function updateRisco(
  projetoId: string,
  riscoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("riscos")
    .update({
      descricao:      formData.get("descricao") as string,
      categoria:      formData.get("categoria") as string,
      probabilidade:  parseInt(formData.get("probabilidade") as string, 10),
      impacto:        parseInt(formData.get("impacto") as string, 10),
      plano_resposta: (formData.get("plano_resposta") as string) || null,
      responsavel:    (formData.get("responsavel") as string) || null,
    })
    .eq("id", riscoId);

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/riscos`);
  return {};
}

export async function setRiscoStatus(
  projetoId: string,
  riscoId: string,
  status: StatusRisco
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("riscos").update({ status }).eq("id", riscoId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/riscos`);
  return {};
}

export async function deleteRisco(
  projetoId: string,
  riscoId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("riscos").delete().eq("id", riscoId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/riscos`);
  return {};
}
