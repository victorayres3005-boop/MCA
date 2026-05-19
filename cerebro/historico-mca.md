---
tags: [plataforma-mca, historico, changelog]
---

> Hub: [[MCA]]

## 2026-05-18 — Sessão 2: inicialização do projeto Next.js

**O que foi feito:**
- Next.js 14.2.35 inicializado (App Router + TypeScript strict + Tailwind)
- shadcn/ui v4 configurado (new-york, CSS variables)
- Stack completa instalada: Supabase SSR, Anthropic SDK, Recharts, react-hook-form, Zod, Sonner, Zustand, Tabler Icons, Lucide
- Tailwind configurado com paleta MCA completa (brand teal, navy, surface tokens, semáforos)
- `globals.css` com CSS variables oklch mapeadas para a identidade MCA
- Supabase client/server/middleware criados (`lib/supabase/`)
- Middleware de autenticação (`middleware.ts`) — redireciona `/` → `/projetos` (auth) ou `/login` (não auth)
- Estrutura de pastas: `app/(auth)`, `app/(dashboard)`, `components/shared`, `lib/ia/prompts`, `types/`, `supabase/migrations/`
- Tipos base criados: `Role`, `StatusProjeto`, `CorSemaforo`, `FasePmbok`, `TipoDocumento`, `Projeto`, `Cliente`, `Contratada`
- Componente `Semaforo` criado (`components/shared/semaforo.tsx`)
- `.env.local` com variáveis de ambiente necessárias (chaves a preencher)
- TypeScript check: zero erros

**Próximo passo:** preencher `.env.local` com credenciais do Supabase → M01 (tela de login)

# Histórico — Plataforma MCA

Changelog datado de sessões e mudanças. Entradas novas sempre **no topo**.

---

## 2026-05-18 — Sessão inicial: setup do cérebro Obsidian

**O que foi feito:**
- Criado o cérebro Obsidian para a Plataforma MCA
- Vault: `C:\Users\Admin\Documents\Obsidian Vault\Plataforma MCA\`
- Arquivos criados: `MCA.md` (hub), `protocolo-claude-mca`, `arquitetura-mca`, `modulos-mca`, `banco-dados-mca`, `ia-documentos-mca`, `design-system-mca`, `decisoes-mca` (ADRs 001–005), `glossario-mca`, `historico-mca`
- Criado `CLAUDE.md` no diretório do projeto
- Conectado ao sistema de memória cronológica do Claude Code

**Estado do projeto:**
- Projeto ainda não inicializado (sem código ainda)
- CLAUDE.md e cérebro Obsidian configurados como ponto de partida

**Próximos passos:**
- Inicializar projeto Next.js com as configurações definidas
- Configurar Supabase (criar projeto, migrations iniciais)
- Implementar M01 — Auth e Setup
