---
tags: [plataforma-mca, banco-dados, supabase, schema]
---

> Hub: [[MCA]]

# Banco de Dados — Plataforma MCA

Supabase (PostgreSQL). RLS obrigatório em **todas** as tabelas.

## Funções RLS base

```sql
-- Retorna organizacao_id do usuário autenticado
CREATE OR REPLACE FUNCTION get_user_org()
RETURNS uuid AS $$
  SELECT organizacao_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Retorna role do usuário autenticado
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

## Tabelas — visão geral

| Tabela | Descrição | Chave FK principal |
|---|---|---|
| `organizacoes` | Empresa usando o SaaS | — |
| `profiles` | Usuários (estende auth.users) | `organizacao_id` |
| `clientes` | Empresas contratantes | `organizacao_id` |
| `contratadas` | Construtoras, projetistas, fornecedores | `organizacao_id` |
| `projetos` | Obras gerenciadas | `organizacao_id`, `cliente_id` |
| `escopos` | EAP e declaração de escopo | `projeto_id` |
| `eap_itens` | Itens da EAP hierárquica | `projeto_id` |
| `atividades` | Atividades do cronograma | `projeto_id`, `eap_item_id` |
| `marcos` | Milestones do projeto | `projeto_id` |
| `capex_itens` | Orçamento (itens de custo) | `projeto_id` |
| `medicoes` | Medições mensais de custo | `projeto_id` |
| `riscos` | Registro de riscos | `projeto_id` |
| `aquisicoes` | Contratos com contratadas | `projeto_id`, `contratada_id` |
| `aquisicoes_medicoes` | Medições mensais de contratos | `aquisicao_id` |
| `partes_interessadas` | Stakeholders do projeto | `projeto_id` |
| `atas` | Atas de reunião | `projeto_id` |
| `mudancas` | Solicitações de mudança | `projeto_id` |
| `documentos` | Docs PMBOK (gerados por IA ou manuais) | `projeto_id` |
| `documentos_versoes` | Histórico de versões de documentos | `documento_id` |
| `licoes_aprendidas` | Lições aprendidas por fase PMBOK | `projeto_id` |

## Padrão de RLS (projetos como exemplo)

```sql
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_org" ON projetos FOR SELECT
  USING (organizacao_id = get_user_org());

CREATE POLICY "insert_org" ON projetos FOR INSERT
  WITH CHECK (
    organizacao_id = get_user_org()
    AND get_user_role() IN ('admin','gerente')
  );

CREATE POLICY "update_org" ON projetos FOR UPDATE
  USING (organizacao_id = get_user_org())
  WITH CHECK (get_user_role() IN ('admin','gerente'));

CREATE POLICY "delete_org" ON projetos FOR DELETE
  USING (
    organizacao_id = get_user_org()
    AND get_user_role() = 'admin'
  );
```

## Regras RLS especiais

- `mudancas`: aprovação requer role `gerente` ou `admin`
- `documentos`: publicar requer role `gerente` ou `admin`
- `profiles`: usuário edita apenas o próprio perfil; admin edita todos da org

## Tipos de documento (tabela `documentos`)

```
'TAP', 'PGP', 'relatorio_status', 'relatorio_desempenho', 'RMA',
'declaracao_escopo', 'EAP', 'dicionario_eap', 'relatorio_criticas_escopo',
'cronograma', 'relatorio_cronograma',
'capex', 'relatorio_custos', 'relatorio_financeiro',
'plano_qualidade', 'relatorio_rnc', 'checklist_inspecao',
'plano_recursos', 'organograma', 'histograma', 'relatorio_utilizacao',
'plano_comunicacao', 'matriz_comunicacao', 'relatorio_distribuicao',
'plano_riscos', 'registro_riscos', 'relatorio_riscos',
'MAS', 'plano_aquisicoes', 'controle_contratos', 'relatorio_fornecedores',
'registro_partes_interessadas', 'plano_engajamento', 'relatorio_engajamento',
'TEP', 'licoes_aprendidas',
'RACI', 'relatorio_gerencial', 'ata', 'outro'
```

## Campos padrão em todas as tabelas

- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `created_at timestamptz DEFAULT now()`
- `updated_at timestamptz DEFAULT now()` (trigger automático)
