"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Projeto } from "@/lib/types";

export async function getProjetos(): Promise<Projeto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projetos")
    .select("*, cliente:clientes(nome)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Projeto[];
}

export async function getProjeto(id: string): Promise<Projeto | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projetos")
    .select("*, cliente:clientes(nome)")
    .eq("id", id)
    .single();
  return data as Projeto | null;
}

export async function createProjeto(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("organizacao_id")
    .eq("id", user.id)
    .single();
  if (!profile) return { error: "Perfil não encontrado" };

  const valorRaw = formData.get("valor_contrato") as string;
  const percRaw  = formData.get("percentual_concluido") as string;

  const { error } = await supabase.from("projetos").insert({
    organizacao_id:       profile.organizacao_id,
    nome:                 formData.get("nome") as string,
    codigo:               (formData.get("codigo") as string)    || null,
    descricao:            (formData.get("descricao") as string) || null,
    cliente_id:           (formData.get("cliente_id") as string) || null,
    tipo_obra:            (formData.get("tipo_obra") as string) || null,
    status:               (formData.get("status") as string)    || "planejamento",
    semaforo:             (formData.get("semaforo") as string)  || "verde",
    data_inicio:          (formData.get("data_inicio") as string)       || null,
    data_fim_prevista:    (formData.get("data_fim_prevista") as string)  || null,
    data_fim_real:        (formData.get("data_fim_real") as string)      || null,
    valor_contrato:       valorRaw ? parseFloat(valorRaw.replace(",", ".")) : null,
    percentual_concluido: percRaw  ? parseInt(percRaw) : 0,
  });
  if (error) return { error: error.message };

  revalidatePath("/projetos");
  redirect("/projetos");
}

export async function updateProjeto(id: string, formData: FormData) {
  const supabase = await createClient();
  const valorRaw = formData.get("valor_contrato") as string;
  const percRaw  = formData.get("percentual_concluido") as string;

  const { error } = await supabase.from("projetos").update({
    nome:                 formData.get("nome") as string,
    codigo:               (formData.get("codigo") as string)    || null,
    descricao:            (formData.get("descricao") as string) || null,
    cliente_id:           (formData.get("cliente_id") as string) || null,
    tipo_obra:            (formData.get("tipo_obra") as string) || null,
    status:               formData.get("status") as string,
    semaforo:             formData.get("semaforo") as string,
    data_inicio:          (formData.get("data_inicio") as string)       || null,
    data_fim_prevista:    (formData.get("data_fim_prevista") as string)  || null,
    data_fim_real:        (formData.get("data_fim_real") as string)      || null,
    valor_contrato:       valorRaw ? parseFloat(valorRaw.replace(",", ".")) : null,
    percentual_concluido: percRaw  ? parseInt(percRaw) : 0,
  }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/projetos");
  revalidatePath(`/projetos/${id}`);
  redirect("/projetos");
}

export async function deleteProjeto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projetos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/projetos");
  redirect("/projetos");
}
