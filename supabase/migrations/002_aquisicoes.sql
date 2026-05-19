-- ============================================================
-- Migration 002 — M13 Aquisições + Medições
-- Execute no Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS aquisicoes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id        uuid NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  contratada_id     uuid REFERENCES contratadas(id) ON DELETE SET NULL,
  objeto            text NOT NULL,
  numero_contrato   text,
  valor_contrato    numeric(15,2) NOT NULL DEFAULT 0,
  data_inicio       date,
  data_fim_prevista date,
  data_fim_real     date,
  status            text NOT NULL DEFAULT 'planejado'
                    CHECK (status IN ('planejado','ativo','suspenso','encerrado')),
  avaliacao         smallint CHECK (avaliacao BETWEEN 1 AND 5),
  observacao        text,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS aquisicoes_medicoes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aquisicao_id uuid NOT NULL REFERENCES aquisicoes(id) ON DELETE CASCADE,
  competencia  text NOT NULL, -- formato YYYY-MM
  valor        numeric(15,2) NOT NULL DEFAULT 0,
  descricao    text,
  created_at   timestamptz DEFAULT now()
);

-- updated_at trigger
CREATE TRIGGER aquisicoes_updated_at
  BEFORE UPDATE ON aquisicoes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS — aquisicoes ─────────────────────────────────────────

ALTER TABLE aquisicoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aq_select" ON aquisicoes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projetos p
    WHERE p.id = aquisicoes.projeto_id
      AND p.organizacao_id = get_user_org()
  ));

CREATE POLICY "aq_insert" ON aquisicoes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projetos p
      WHERE p.id = aquisicoes.projeto_id
        AND p.organizacao_id = get_user_org()
    )
    AND get_user_role() IN ('admin','gerente','analista')
  );

CREATE POLICY "aq_update" ON aquisicoes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM projetos p
    WHERE p.id = aquisicoes.projeto_id
      AND p.organizacao_id = get_user_org()
  ))
  WITH CHECK (get_user_role() IN ('admin','gerente','analista'));

CREATE POLICY "aq_delete" ON aquisicoes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projetos p
      WHERE p.id = aquisicoes.projeto_id
        AND p.organizacao_id = get_user_org()
    )
    AND get_user_role() IN ('admin','gerente')
  );

-- ── RLS — aquisicoes_medicoes ─────────────────────────────────

ALTER TABLE aquisicoes_medicoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "med_select" ON aquisicoes_medicoes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM aquisicoes a
    JOIN projetos p ON p.id = a.projeto_id
    WHERE a.id = aquisicoes_medicoes.aquisicao_id
      AND p.organizacao_id = get_user_org()
  ));

CREATE POLICY "med_insert" ON aquisicoes_medicoes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM aquisicoes a
      JOIN projetos p ON p.id = a.projeto_id
      WHERE a.id = aquisicoes_medicoes.aquisicao_id
        AND p.organizacao_id = get_user_org()
    )
    AND get_user_role() IN ('admin','gerente','analista')
  );

CREATE POLICY "med_delete" ON aquisicoes_medicoes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM aquisicoes a
    JOIN projetos p ON p.id = a.projeto_id
    WHERE a.id = aquisicoes_medicoes.aquisicao_id
      AND p.organizacao_id = get_user_org()
  ));
