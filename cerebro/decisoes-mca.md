---
tags: [plataforma-mca, decisoes, adr]
---

> Hub: [[MCA]]

# Decisões Arquiteturais (ADRs) — Plataforma MCA

Registro de decisões com peso arquitetural. Adicionar novos ADRs **no topo**, nunca apagar antigos.

---

## ADR-001 — Gemini como provedor de IA (revisado)

**Data inicial:** 2026-05-18 | **Revisado:** 2026-05-18
**Status:** Aceito

**Contexto:** A plataforma precisa gerar documentos PMBOK de alta qualidade (TAP, RACI, TEP, etc.) a partir de dados estruturados do projeto. O spec original previa Claude API, mas o acesso disponível no início do projeto é via Google Gemini.

**Decisão:** Usar Google Gemini (`gemini-2.5-flash`) via `@google/generative-ai`. Cliente centralizado em `lib/ia/client.ts` com `gerarTexto(prompt)` como interface principal.

**Consequências:**
- `GEMINI_API_KEY` obrigatória no ambiente — nunca expor no cliente
- `GEMINI_MODEL` configurável via env (default: `gemini-2.5-flash`)
- Troca futura para Claude ou outro LLM requer apenas alterar `lib/ia/client.ts`

---

## ADR-002 — Supabase como backend completo (DB + Auth + Storage)

**Data:** 2026-05-18
**Status:** Aceito

**Contexto:** Necessidade de banco relacional, autenticação e armazenamento de arquivos com mínimo de infraestrutura a gerenciar.

**Decisão:** Supabase gerencia banco (PostgreSQL), Auth (email+senha) e Storage (evidências, PDFs). RLS em todas as tabelas como linha de defesa principal.

**Consequências:**
- Toda mutação de dados deve respeitar as policies RLS
- Nunca confiar apenas na validação do frontend
- `SUPABASE_SERVICE_ROLE_KEY` apenas em server actions (bypass RLS quando necessário com cuidado)

---

## ADR-003 — Next.js 14 App Router com Server Components por padrão

**Data:** 2026-05-18
**Status:** Aceito

**Contexto:** Necessidade de SSR/SSG para SEO (mínimo) e performance, com TypeScript estrito.

**Decisão:** Next.js 14+ App Router. Server Components por padrão. `'use client'` apenas quando necessário (interatividade, hooks de estado). Server Actions para mutações (não API routes quando possível).

**Consequências:**
- Código de servidor não vaza para o bundle do cliente
- `ANTHROPIC_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` seguras por design
- TypeScript estrito — sem `any` implícito

---

## ADR-004 — shadcn/ui como base de componentes (sem customizar primitivos)

**Data:** 2026-05-18
**Status:** Aceito

**Contexto:** Necessidade de componentes acessíveis e consistentes com velocidade de desenvolvimento.

**Decisão:** shadcn/ui + Tailwind CSS. **Nunca customizar os primitivos** do shadcn — estender via className e tokens Tailwind customizados em `tailwind.config.ts`.

**Consequências:**
- Upgrades do shadcn não quebram customizações
- Paleta da MCA implementada como tokens Tailwind (`brand-500`, `navy-700`, etc.)
- Novos componentes seguem o mesmo padrão de tokens

---

## ADR-005 — Deploy via Vercel com CI/CD automático via GitHub

**Data:** 2026-05-18
**Status:** Aceito

**Decisão:** Deploy no Vercel com CI/CD via GitHub. Cada push para `main` dispara deploy de produção.

**Consequências:**
- `npx tsc --noEmit` antes de commits importantes para evitar falhas de CI
- Variáveis de ambiente gerenciadas no dashboard do Vercel
- URL produção: `https://app.mca.com.br`
