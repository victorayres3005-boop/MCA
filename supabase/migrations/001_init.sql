-- ============================================================
-- Migration 001 — Setup inicial: organizacoes + profiles
-- ============================================================

-- Organizações (tenant principal)
CREATE TABLE organizacoes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome          text NOT NULL,
  cnpj          text,
  logo_url      text,
  created_at    timestamptz DEFAULT now()
);

-- Profiles (estende auth.users)
CREATE TABLE profiles (
  id               uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organizacao_id   uuid NOT NULL REFERENCES organizacoes(id),
  nome             text NOT NULL,
  email            text NOT NULL,
  role             text NOT NULL DEFAULT 'analista'
                   CHECK (role IN ('admin','gerente','analista','visualizador')),
  avatar_url       text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- Trigger: cria profile automaticamente ao cadastrar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, organizacao_id, nome, email, role)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'organizacao_id')::uuid,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'analista')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: updated_at automático
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Funções RLS base (usadas em todas as tabelas)
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_org()
RETURNS uuid AS $$
  SELECT organizacao_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- RLS — organizacoes
-- ============================================================

ALTER TABLE organizacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_org" ON organizacoes FOR SELECT
  USING (id = get_user_org());

CREATE POLICY "update_own_org" ON organizacoes FOR UPDATE
  USING (id = get_user_org())
  WITH CHECK (get_user_role() = 'admin');

-- ============================================================
-- RLS — profiles
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_same_org" ON profiles FOR SELECT
  USING (organizacao_id = get_user_org());

CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "admin_update_any" ON profiles FOR UPDATE
  USING (organizacao_id = get_user_org())
  WITH CHECK (get_user_role() = 'admin');
