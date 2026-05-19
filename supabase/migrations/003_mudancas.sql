-- ============================================================
-- Migration 003 — M15 Mudanças (Controle de Mudanças PMBOK)
-- Execute no Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS mudancas (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id       uuid NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  numero           text NOT NULL,
  titulo           text NOT NULL,
  descricao        text,
  solicitante      text,
  data_solicitacao date NOT NULL DEFAULT CURRENT_DATE,
  status           text NOT NULL DEFAULT 'rascunho'
                   CHECK (status IN ('rascunho','em_analise','aprovada','rejeitada','implementada')),
  impacto_prazo    integer,
  impacto_custo    numeric(15,2),
  impacto_escopo   text,
  justificativa    text,
  aprovado_por     text,
  data_aprovacao   date,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TRIGGER mudancas_updated_at
  BEFORE UPDATE ON mudancas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE mudancas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mc_select" ON mudancas FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projetos p
    WHERE p.id = mudancas.projeto_id
      AND p.organizacao_id = get_user_org()
  ));

CREATE POLICY "mc_insert" ON mudancas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projetos p
      WHERE p.id = mudancas.projeto_id
        AND p.organizacao_id = get_user_org()
    )
    AND get_user_role() IN ('admin','gerente','analista')
  );

CREATE POLICY "mc_update" ON mudancas FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projetos p
    WHERE p.id = mudancas.projeto_id
      AND p.organizacao_id = get_user_org()
  ))
  WITH CHECK (get_user_role() IN ('admin','gerente','analista'));

CREATE POLICY "mc_delete" ON mudancas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projetos p
      WHERE p.id = mudancas.projeto_id
        AND p.organizacao_id = get_user_org()
    )
    AND get_user_role() IN ('admin','gerente')
  );
