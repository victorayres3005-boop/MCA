-- ============================================================
-- Migration 006 — M10 Recursos
-- Execute no Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS recursos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id  uuid NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  nome        text NOT NULL,
  papel       text,
  tipo        text NOT NULL DEFAULT 'interno'
              CHECK (tipo IN ('interno','externo','contratado')),
  dedicacao   integer DEFAULT 100 CHECK (dedicacao BETWEEN 0 AND 100),
  data_inicio date,
  data_fim    date,
  observacao  text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE TRIGGER recursos_updated_at
  BEFORE UPDATE ON recursos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE recursos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rec_select" ON recursos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projetos p WHERE p.id = recursos.projeto_id AND p.organizacao_id = get_user_org()
  ));

CREATE POLICY "rec_insert" ON recursos FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM projetos p WHERE p.id = recursos.projeto_id AND p.organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente','analista')
  );

CREATE POLICY "rec_update" ON recursos FOR UPDATE
  USING (EXISTS (SELECT 1 FROM projetos p WHERE p.id = recursos.projeto_id AND p.organizacao_id = get_user_org()))
  WITH CHECK (get_user_role() IN ('admin','gerente','analista'));

CREATE POLICY "rec_delete" ON recursos FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM projetos p WHERE p.id = recursos.projeto_id AND p.organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente','analista')
  );
