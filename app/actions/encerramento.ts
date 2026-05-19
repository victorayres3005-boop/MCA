"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Encerramento } from "@/lib/types";

export async function getEncerramento(projetoId: string): Promise<Encerramento | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("encerramento")
    .select("*")
    .eq("projeto_id", projetoId)
    .maybeSingle();
  return data ?? null;
}

export async function upsertEncerramento(
  projetoId: string,
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const payload = {
    projeto_id:        projetoId,
    data_encerramento: (formData.get("data_encerramento") as string) || null,
    aceite_formal:     formData.get("aceite_formal") === "true",
    aceito_por:        (formData.get("aceito_por") as string) || null,
    licoes_aprendidas: (formData.get("licoes_aprendidas") as string) || null,
    pontos_positivos:  (formData.get("pontos_positivos") as string) || null,
    pontos_melhoria:   (formData.get("pontos_melhoria") as string) || null,
    pendencias:        (formData.get("pendencias") as string) || null,
    observacoes:       (formData.get("observacoes") as string) || null,
  };
  const { error } = await supabase
    .from("encerramento")
    .upsert(payload, { onConflict: "projeto_id" });
  if (error) return { error: error.message };
  revalidatePath(`/projetos/${projetoId}/encerramento`);
  return {};
}
