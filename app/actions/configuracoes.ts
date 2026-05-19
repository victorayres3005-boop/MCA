"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile, Role } from "@/lib/types";

interface Org {
  id: string;
  nome: string;
  created_at: string;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data ?? null;
}

export async function getOrg(): Promise<Org | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("organizacao_id").eq("id", user.id).single();
  if (!profile) return null;
  const { data } = await supabase.from("organizacoes").select("*").eq("id", profile.organizacao_id).single();
  return data ?? null;
}

export async function getMembers(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("nome");
  return data ?? [];
}

export async function updateProfile(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  const { error } = await supabase
    .from("profiles")
    .update({ nome: formData.get("nome") as string })
    .eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/configuracoes");
  return {};
}

export async function updateOrg(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };
  const { data: profile } = await supabase.from("profiles").select("organizacao_id, role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") return { error: "Permissão negada." };
  const { error } = await supabase
    .from("organizacoes")
    .update({ nome: formData.get("nome") as string })
    .eq("id", profile.organizacao_id);
  if (error) return { error: error.message };
  revalidatePath("/configuracoes");
  return {};
}

export async function updateMemberRole(memberId: string, role: Role): Promise<void> {
  const supabase = await createClient();
  await supabase.from("profiles").update({ role }).eq("id", memberId);
  revalidatePath("/configuracoes");
}

export async function inviteMember(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("organizacao_id, role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") return { error: "Apenas administradores podem convidar membros." };

  const email = (formData.get("email") as string).trim().toLowerCase();
  const role  = formData.get("role") as string;

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { organizacao_id: profile.organizacao_id, role },
  });

  if (error) return { error: error.message };
  revalidatePath("/configuracoes");
  return {};
}
