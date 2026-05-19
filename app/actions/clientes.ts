"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Cliente } from "@/lib/types";

export async function getClientes(): Promise<Cliente[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nome");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCliente(id: string): Promise<Cliente | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("clientes").select("*").eq("id", id).single();
  return data;
}

export async function createCliente(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("organizacao_id")
    .eq("id", user.id)
    .single();
  if (!profile) return { error: "Perfil não encontrado" };

  const { error } = await supabase.from("clientes").insert({
    organizacao_id:   profile.organizacao_id,
    nome:             formData.get("nome") as string,
    cnpj:             (formData.get("cnpj") as string)             || null,
    setor:            (formData.get("setor") as string)            || null,
    contato_nome:     (formData.get("contato_nome") as string)     || null,
    contato_email:    (formData.get("contato_email") as string)    || null,
    contato_telefone: (formData.get("contato_telefone") as string) || null,
  });
  if (error) return { error: error.message };

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function updateCliente(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clientes")
    .update({
      nome:             formData.get("nome") as string,
      cnpj:             (formData.get("cnpj") as string)             || null,
      setor:            (formData.get("setor") as string)            || null,
      contato_nome:     (formData.get("contato_nome") as string)     || null,
      contato_email:    (formData.get("contato_email") as string)    || null,
      contato_telefone: (formData.get("contato_telefone") as string) || null,
      ativo:            formData.get("ativo") === "true",
    })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  redirect("/clientes");
}

export async function deleteCliente(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/clientes");
  redirect("/clientes");
}
