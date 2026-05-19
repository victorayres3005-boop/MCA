"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Escopo, EapItem } from "@/lib/types";

// ─── Declaração de Escopo ─────────────────────────────────────────────────────

export async function getEscopo(projetoId: string): Promise<Escopo | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("escopos")
    .select("*")
    .eq("projeto_id", projetoId)
    .maybeSingle();
  return data ?? null;
}

export async function upsertEscopo(
  projetoId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const payload = {
    projeto_id:       projetoId,
    declaracao:       formData.get("declaracao") as string | null,
    exclusoes:        formData.get("exclusoes")  as string | null,
    premissas:        formData.get("premissas")  as string | null,
    restricoes:       formData.get("restricoes") as string | null,
    criterios_aceite: formData.get("criterios_aceite") as string | null,
  };

  const { error } = await supabase
    .from("escopos")
    .upsert(payload, { onConflict: "projeto_id" });

  if (error) return { error: error.message };

  revalidatePath(`/projetos/${projetoId}/escopo`);
  return {};
}

// ─── EAP / WBS ───────────────────────────────────────────────────────────────

export async function getEapItens(projetoId: string): Promise<EapItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eap_itens")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("nivel")
    .order("ordem");
  return data ?? [];
}

export async function createEapItem(
  projetoId: string,
  item: {
    parent_id:   string | null;
    codigo:      string;
    nome:        string;
    descricao?:  string | null;
    responsavel?: string | null;
    nivel:       number;
    ordem:       number;
  }
): Promise<{ data?: EapItem; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eap_itens")
    .insert({ projeto_id: projetoId, ...item })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/escopo`);
  return { data };
}

export async function updateEapItem(
  projetoId: string,
  itemId: string,
  patch: Partial<Pick<EapItem, "codigo" | "nome" | "descricao" | "responsavel" | "ordem">>
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("eap_itens")
    .update(patch)
    .eq("id", itemId);

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/escopo`);
  return {};
}

export async function deleteEapItem(
  projetoId: string,
  itemId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("eap_itens")
    .delete()
    .eq("id", itemId);

  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/escopo`);
  return {};
}
