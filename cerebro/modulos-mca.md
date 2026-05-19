---
tags: [plataforma-mca, modulos, roadmap]
---

> Hub: [[MCA]]

# Módulos — Plataforma MCA

## Fase 1 — MVP (meses 1–3)

| # | Módulo | Status | Descrição |
|---|---|---|---|
| M01 | Auth e Setup | ⬜ | Login, perfil, configurações da org |
| M02 | Clientes e Contratadas | ⬜ | CRUD com histórico de projetos |
| M03 | Projetos (CRUD) | ⬜ | Criar/listar/detalhar projetos com semáforo |
| M04 | Dashboard da Carteira | ⬜ | Visão executiva multi-projeto com KPIs |
| M05 | Escopo | ⬜ | EAP, dicionário, declaração de escopo |
| M06 | Cronograma | ⬜ | Atividades, marcos, curva S, semáforo prazo |
| M07 | Custos / CapEx | ⬜ | Orçamento, medições, curva S financeira |
| M08 | Geração de Docs via IA | ⬜ | TAP, RACI, Planos, Relatórios, Atas, TEP |

## Fase 2 (meses 4–6)

| # | Módulo | Status | Descrição |
|---|---|---|---|
| M09 | Qualidade | ⬜ | Plano de qualidade, RNCs, checklists de inspeção |
| M10 | Recursos | ⬜ | Organograma, histograma, utilização |
| M11 | Comunicação | ⬜ | Plano de comunicação, matriz, distribuição |
| M12 | Riscos | ⬜ | Registro de riscos, matriz probabilidade × impacto |
| M13 | Aquisições | ⬜ | Contratos, medições mensais, avaliação de fornecedores |
| M14 | Partes Interessadas | ⬜ | Registro, nível de engajamento, estratégia |

## Fase 3 (meses 7–9)

| # | Módulo | Status | Descrição |
|---|---|---|---|
| M15 | Mudanças | ⬜ | Solicitações de mudança, aprovação, impacto |
| M16 | Atas de Reunião | ⬜ | CRUD + geração via IA |
| M17 | Encerramento | ⬜ | TEP, lições aprendidas, aceite formal |
| M18 | Relatório Gerencial | ⬜ | PDF executivo consolidado do projeto |

**Status:** ⬜ Não iniciado | 🔄 Em andamento | ✅ Concluído

---

## Detalhamento M01 — Auth e Setup

- Login email + senha via Supabase Auth
- Middleware: redirecionar `/` → `/projetos` (autenticado) ou `/auth/login` (não)
- Trigger Supabase cria `profile` automaticamente ao criar usuário
- Página de configurações: dados da org, logo, dados do perfil

## Detalhamento M02 — Clientes e Contratadas

**Clientes:**
- CRUD com listagem, busca por nome/CNPJ, filtro por setor
- Detalhe do cliente: histórico de projetos vinculados

**Contratadas:**
- CRUD com listagem, filtro por tipo (construtora, projetista, fornecedor)
- Detalhe: histórico de contratos, avaliações por projeto

## Detalhamento M03 — Projetos

- Criar projeto: wizard com dados básicos (nome, código OBR-YYYY-NNN, cliente, tipo de obra, fases PMBOK)
- Listagem: cards com semáforo de saúde, KPIs, % conclusão
- Hero banner do projeto com gradiente da marca
- Status: `planejamento | execucao | monitoramento | encerrado | suspenso`

## Detalhamento M08 — Geração de Documentos via IA

Ver [[ia-documentos-mca]] para detalhes de prompts e fluxo.

Documentos suportados:
- TAP (Termo de Abertura do Projeto)
- RACI (Matriz de Responsabilidades)
- Declaração de Escopo
- Plano de Gerenciamento do Projeto (PGP)
- Relatório de Status (RMA)
- Relatório de Desempenho
- Ata de Reunião
- TEP (Termo de Encerramento)
- Lições Aprendidas
