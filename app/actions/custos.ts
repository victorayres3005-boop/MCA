"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrcamentoItem } from "@/lib/types";

export async function getOrcamentoItens(projetoId: string): Promise<OrcamentoItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orcamento_itens")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("categoria")
    .order("ordem");
  return data ?? [];
}

export async function createOrcamentoItem(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("orcamento_itens").insert({
    projeto_id:      projetoId,
    categoria:       formData.get("categoria") as string,
    descricao:       formData.get("descricao") as string,
    valor_planejado: parseFloat((formData.get("valor_planejado") as string) || "0"),
    valor_realizado: parseFloat((formData.get("valor_realizado") as string) || "0"),
    data_referencia: (formData.get("data_referencia") as string) || null,
    observacao:      (formData.get("observacao") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/custos`);
  return {};
}

export async function updateOrcamentoItem(
  projetoId: string,
  itemId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orcamento_itens")
    .update({
      categoria:       formData.get("categoria") as string,
      descricao:       formData.get("descricao") as string,
      valor_planejado: parseFloat((formData.get("valor_planejado") as string) || "0"),
      valor_realizado: parseFloat((formData.get("valor_realizado") as string) || "0"),
      data_referencia: (formData.get("data_referencia") as string) || null,
      observacao:      (formData.get("observacao") as string) || null,
    })
    .eq("id", itemId);

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/custos`);
  return {};
}

export async function deleteOrcamentoItem(
  projetoId: string,
  itemId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("orcamento_itens").delete().eq("id", itemId);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/custos`);
  return {};
}
