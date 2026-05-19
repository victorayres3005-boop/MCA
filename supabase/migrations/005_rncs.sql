-- ============================================================
-- Migration 005 — M09 Qualidade (RNCs)
-- Execute no Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS rncs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id       uuid NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  numero           text NOT NULL,
  titulo           text NOT NULL,
  descricao        text,
  categoria        text NOT NULL DEFAULT 'outro'
                   CHECK (categoria IN ('tecnica','seguranca','documental','ambiental','outro')),
  status           text NOT NULL DEFAULT 'aberta'
                   CHECK (status IN ('aberta','em_tratamento','fechada','cancelada')),
  responsavel      text,
  data_abertura    date NOT NULL DEFAULT current_date,
  data_fechamento  date,
  acao_corretiva   text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TRIGGER rncs_updated_at
  BEFORE UPDATE ON rncs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE rncs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rnc_select" ON rncs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projetos p WHERE p.id = rncs.projeto_id AND p.organizacao_id = get_user_org()
  ));

CREATE POLICY "rnc_insert" ON rncs FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM projetos p WHERE p.id = rncs.projeto_id AND p.organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente','analista')
  );

CREATE POLICY "rnc_update" ON rncs FOR UPDATE
  USING (EXISTS (SELECT 1 FROM projetos p WHERE p.id = rncs.projeto_id AND p.organizacao_id = get_user_org()))
  WITH CHECK (get_user_role() IN ('admin','gerente','analista'));

CREATE POLICY "rnc_delete" ON rncs FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM projetos p WHERE p.id = rncs.projeto_id AND p.organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente','analista')
  );
