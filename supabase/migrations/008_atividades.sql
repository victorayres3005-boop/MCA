-- Migration 008 — Tabela de atividades do cronograma (M06)

CREATE TABLE atividades (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id           uuid        NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  eap_item_id          uuid        REFERENCES eap_itens(id) ON DELETE SET NULL,
  nome                 text        NOT NULL,
  descricao            text,
  responsavel          text,
  data_inicio_prevista date,
  data_fim_prevista    date        NOT NULL,
  data_inicio_real     date,
  data_fim_real        date,
  status               text        NOT NULL DEFAULT 'pendente'
                       CHECK (status IN ('pendente','em_andamento','concluida','cancelada')),
  percentual_concluido integer     NOT NULL DEFAULT 0
                       CHECK (percentual_concluido BETWEEN 0 AND 100),
  ordem                integer     NOT NULL DEFAULT 0,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

CREATE TRIGGER atividades_updated_at
  BEFORE UPDATE ON atividades
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE atividades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_org" ON atividades FOR SELECT
  USING (projeto_id IN (
    SELECT id FROM projetos WHERE organizacao_id = get_user_org()
  ));

CREATE POLICY "insert_org" ON atividades FOR INSERT
  WITH CHECK (
    projeto_id IN (SELECT id FROM projetos WHERE organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente','analista')
  );

CREATE POLICY "update_org" ON atividades FOR UPDATE
  USING (projeto_id IN (
    SELECT id FROM projetos WHERE organizacao_id = get_user_org()
  ))
  WITH CHECK (get_user_role() IN ('admin','gerente','analista'));

CREATE POLICY "delete_org" ON atividades FOR DELETE
  USING (
    projeto_id IN (SELECT id FROM projetos WHERE organizacao_id = get_user_org())
    AND get_user_role() IN ('admin','gerente')
  );
