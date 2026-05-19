-- ============================================================
-- Migration 004 — M16 Atas de Reunião
-- Execute no Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS atas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id      uuid NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  titulo          text NOT NULL,
  data_reuniao    date NOT NULL,
  local_reuniao   text,
  participantes   text,
  pauta           text,
  decisoes        text,
  encaminhamentos text,
  observacoes     text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TRIGGER atas_updated_at
  BEFORE UPDATE ON atas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE atas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "at_select" ON atas FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projetos p
    WHERE p.id = atas.projeto_id AND p.organizacao_id = get_user_org()
  ));

CREATE POLICY "at_insert" ON atas FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM projetos p WHERE p.id = atas.projeto_id AND p.organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente','analista')
  );

CREATE POLICY "at_update" ON atas FOR UPDATE
  USING (EXISTS (SELECT 1 FROM projetos p WHERE p.id = atas.projeto_id AND p.organizacao_id = get_user_org()))
  WITH CHECK (get_user_role() IN ('admin','gerente','analista'));

CREATE POLICY "at_delete" ON atas FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM projetos p WHERE p.id = atas.projeto_id AND p.organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente','analista')
  );
