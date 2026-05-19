"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Contratada } from "@/lib/types";

export async function getContratadas(): Promise<Contratada[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contratadas")
    .select("*")
    .order("nome");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getContratada(id: string): Promise<Contratada | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("contratadas").select("*").eq("id", id).single();
  return data;
}

export async function createContratada(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("organizacao_id")
    .eq("id", user.id)
    .single();
  if (!profile) return { error: "Perfil não encontrado" };

  const { error } = await supabase.from("contratadas").insert({
    organizacao_id:   profile.organizacao_id,
    nome:             formData.get("nome") as string,
    cnpj:             (formData.get("cnpj") as string)             || null,
    tipo:             formData.get("tipo") as string,
    contato_nome:     (formData.get("contato_nome") as string)     || null,
    contato_email:    (formData.get("contato_email") as string)    || null,
    contato_telefone: (formData.get("contato_telefone") as string) || null,
  });
  if (error) return { error: error.message };

  revalidatePath("/contratadas");
  redirect("/contratadas");
}

export async function updateContratada(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contratadas")
    .update({
      nome:             formData.get("nome") as string,
      cnpj:             (formData.get("cnpj") as string)             || null,
      tipo:             formData.get("tipo") as string,
      contato_nome:     (formData.get("contato_nome") as string)     || null,
      contato_email:    (formData.get("contato_email") as string)    || null,
      contato_telefone: (formData.get("contato_telefone") as string) || null,
      ativo:            formData.get("ativo") === "true",
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/contratadas");
  revalidatePath(`/contratadas/${id}`);
  redirect("/contratadas");
}

export async function deleteContratada(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contratadas").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/contratadas");
  redirect("/contratadas");
}
