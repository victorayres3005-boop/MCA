"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface Documento {
  id:            string;
  projeto_id:    string;
  tipo:          string;
  titulo:        string;
  conteudo:      string;
  status:        "rascunho" | "aprovado";
  gerado_por_ia: boolean;
  created_at:    string;
  updated_at:    string;
}

export async function getDocumentos(projetoId: string): Promise<Documento[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documentos")
    .select("*")
    .eq("projeto_id", projetoId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Documento[];
}

export async function salvarDocumento(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("organizacao_id")
    .eq("id", user.id)
    .single();
  if (!profile) return { error: "Perfil não encontrado" };

  const id        = formData.get("id") as string | null;
  const projetoId = formData.get("projeto_id") as string;
  const conteudo  = formData.get("conteudo") as string;
  const tipo      = formData.get("tipo") as string;
  const titulo    = formData.get("titulo") as string;

  if (id) {
    const { error } = await supabase
      .from("documentos")
      .update({ conteudo, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("documentos").insert({
      organizacao_id: profile.organizacao_id,
      projeto_id:     projetoId,
      tipo,
      titulo,
      conteudo,
      gerado_por_ia:  true,
      created_by:     user.id,
    });
    if (error) return { error: error.message };
  }

  revalidatePath(`/projetos/${projetoId}/documentos`);
  return { ok: true };
}

export async function aprovarDocumento(id: string, projetoId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("documentos")
    .update({ status: "aprovado" })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/documentos`);
  return { ok: true };
}

export async function deleteDocumento(id: string, projetoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("documentos").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/documentos`);
  return { ok: true };
}
