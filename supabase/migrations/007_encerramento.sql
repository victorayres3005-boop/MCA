-- ============================================================
-- Migration 007 — M17 Encerramento
-- Execute no Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS encerramento (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id         uuid NOT NULL UNIQUE REFERENCES projetos(id) ON DELETE CASCADE,
  data_encerramento  date,
  aceite_formal      boolean DEFAULT false,
  aceito_por         text,
  licoes_aprendidas  text,
  pontos_positivos   text,
  pontos_melhoria    text,
  pendencias         text,
  observacoes        text,
  created_at         timestamptz DEFAULT now(),
  updated_at         timestamptz DEFAULT now()
);

CREATE TRIGGER encerramento_updated_at
  BEFORE UPDATE ON encerramento
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE encerramento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enc_select" ON encerramento FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projetos p WHERE p.id = encerramento.projeto_id AND p.organizacao_id = get_user_org()
  ));

CREATE POLICY "enc_insert" ON encerramento FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM projetos p WHERE p.id = encerramento.projeto_id AND p.organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente','analista')
  );

CREATE POLICY "enc_update" ON encerramento FOR UPDATE
  USING (EXISTS (SELECT 1 FROM projetos p WHERE p.id = encerramento.projeto_id AND p.organizacao_id = get_user_org()))
  WITH CHECK (get_user_role() IN ('admin','gerente','analista'));

CREATE POLICY "enc_delete" ON encerramento FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM projetos p WHERE p.id = encerramento.projeto_id AND p.organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente')
  );
