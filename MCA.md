---
tags: [plataforma-mca, hub, moc]
aliases: [Cérebro MCA, MCA Hub]
---

# 🏗️ Plataforma MCA — Cérebro

SaaS de gerenciamento de carteira de obras para a MCA, consultora que atua como gestora intermediária entre clientes (empresas contratantes) e contratadas (construtoras, projetistas, fornecedores). Digitaliza e automatiza o gerenciamento baseado na metodologia PMBOK — hoje feito manualmente via Excel e Word.

---

## Atalhos

### Conhecimento estável

| Vou para... | Quando |
|---|---|
| **[[arquitetura-mca]]** | Stack, fluxo, configs, deploy, variáveis de ambiente |
| **[[modulos-mca]]** | Módulos M01–M18, status de implementação, ordem |
| **[[banco-dados-mca]]** | Schema Supabase, tabelas, RLS, migrations |
| **[[ia-documentos-mca]]** | Geração de documentos PMBOK via Claude API, prompts |
| **[[design-system-mca]]** | Paleta, tokens Tailwind, componentes, layout |
| **[[decisoes-mca]]** | ADRs: escolhas de tecnologia, padrões arquiteturais |
| **[[glossario-mca]]** | Termos PMBOK e do domínio da MCA |
| **[[historico-mca]]** | Changelog datado de sessões e mudanças deployadas |
| **[[protocolo-claude-mca]]** | Como o Claude usa e mantém este cérebro |

### Memória cronológica
Carrega automaticamente em toda sessão do Claude Code.
- `MEMORY.md` em `~/.claude/projects/.../memory/`

---

## O que é a Plataforma MCA

### Missão
Eliminar o trabalho manual e repetitivo da MCA, permitindo que os gerentes foquem em decisões estratégicas — não em preencher planilhas e formatar documentos.

### Dois diferenciais principais
1. **Geração automática de documentos PMBOK via IA** — o gerente preenche os dados uma vez; o sistema gera TAP, RACI, Planos, Relatórios, Atas e TEP com qualidade profissional em segundos.
2. **Dashboard consolidado da carteira em tempo real** — visão executiva de N projetos simultâneos com semáforos, KPIs, desvios e forecasts, sem nenhuma planilha manual.

### Fluxo de negócio
```
CLIENTE (empresa contratante)
  → Contrato + Alinhamento Estratégico
MCA (consultora — USUÁRIA PRINCIPAL DO SAAS)
  → Planeja, gerencia, consolida, reporta
CONTRATADAS (por projeto)
  → Construtoras, projetistas, fornecedores
```

### Ciclo de vida de um projeto (5 fases PMBOK)
`INICIAÇÃO → PLANEJAMENTO → EXECUÇÃO → MONITORAMENTO E CONTROLE → ENCERRAMENTO`

---

## Quick Reference

### Stack & deploy
- Next.js 14+ (App Router) + TypeScript estrito
- Supabase (Postgres + Auth + Storage)
- Anthropic Claude API (`claude-sonnet-4-20250514`)
- Tailwind + shadcn/ui + Recharts
- Deploy: Vercel (CI/CD via GitHub)
- URL produção: `https://app.mca.com.br`

### Variáveis de ambiente obrigatórias
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=          # NUNCA expor no cliente — só server actions
NEXT_PUBLIC_APP_URL=https://app.mca.com.br
```

### Roles
| Role | Pode fazer |
|---|---|
| `admin` | Tudo, incluindo gerenciar usuários e org |
| `gerente` | Criar/editar projetos, gerar e aprovar docs, aprovar mudanças |
| `analista` | Editar dados operacionais, gerar documentos via IA |
| `visualizador` | Somente leitura |

### Comandos comuns
```bash
npm run dev          # desenvolvimento local
npx tsc --noEmit     # type-check antes de deploy
git push             # dispara CI/CD no Vercel
```

---

## Onde editar o quê

| Mudança | Arquivo |
|---|---|
| Novo módulo / página | `app/(dashboard)/...` |
| Prompt de IA para documento | `lib/ia/prompts/<tipo>.ts` |
| Schema banco | `supabase/migrations/*.sql` |
| Design tokens | `tailwind.config.ts` |
| Componentes compartilhados | `components/shared/` |
| RLS policies | `supabase/migrations/*.sql` |
| Server Actions | `app/actions/...` ou `lib/actions/...` |

---

## Padrão Claude Code para este projeto

- `CLAUDE.md` governa comportamentos persistentes do projeto
- `MEMORY.md` (em `~/.claude/...`) é o índice da memória cronológica
- Vault Obsidian: `C:\Users\Admin\Documents\Obsidian Vault\Plataforma MCA\`
- Protocolo de manutenção do cérebro: [[protocolo-claude-mca]]

---

## Estado atual

> Atualizar conforme o projeto avança.

- [ ] Projeto inicializado (Next.js + Supabase + shadcn)
- [ ] M01 — Auth implementado
- [ ] M02 — Clientes e Contratadas
- [ ] M03 — Projetos (CRUD)
- [ ] M04 — Dashboard da Carteira
- [ ] M05 — Escopo
- [ ] Geração de documentos via IA (primeiro doc)
