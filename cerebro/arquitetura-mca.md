---
tags: [plataforma-mca, arquitetura, stack]
---

> Hub: [[MCA]]

# Arquitetura — Plataforma MCA

SaaS de gerenciamento de carteira de obras (PMBOK) para a MCA.

## Stack

| Camada | Tecnologia | Notas |
|---|---|---|
| Framework | Next.js 14+ (App Router) | TypeScript estrito |
| UI Components | shadcn/ui | Não customizar primitivos |
| Estilização | Tailwind CSS | Paleta customizada em `tailwind.config.ts` |
| Backend/DB | Supabase (PostgreSQL) | RLS em todas as tabelas |
| Auth | Supabase Auth | Email+senha; magic link futuro |
| Storage | Supabase Storage | Evidências, PDFs exportados |
| IA | Anthropic Claude API | `claude-sonnet-4-20250514` |
| Gráficos | Recharts | Curva S, CapEx, KPIs |
| Formulários | react-hook-form + Zod | Validação client + server |
| Notificações | sonner | Toasts de sucesso/erro |
| PDF Export | @react-pdf/renderer | Relatórios e documentos |
| Editor Markdown | @uiw/react-md-editor | Editor de docs gerados por IA |
| Deploy | Vercel | CI/CD automático via GitHub |
| Estado global | Zustand | Apenas quando RSC não resolver |

## Variáveis de ambiente

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic — NUNCA expor no cliente, apenas server actions
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://app.mca.com.br
```

## Estrutura de diretórios (referência)

```
app/
  (auth)/
    login/page.tsx
  (dashboard)/
    layout.tsx                  # sidebar + header compartilhados
    projetos/page.tsx           # listagem da carteira
    projetos/[id]/
      page.tsx                  # visão geral do projeto
      escopo/
      cronograma/
      custos/
      qualidade/
      recursos/
      comunicacao/
      riscos/
      aquisicoes/
      partes-interessadas/
      mudancas/
      atas/
      documentos/
      encerramento/
    clientes/
    contratadas/
    configuracoes/
  actions/                      # server actions (Next.js)

lib/
  supabase/
    client.ts                   # browser client
    server.ts                   # server client
  ia/
    client.ts                   # Anthropic SDK wrapper
    prompts/                    # prompts por tipo de documento
  utils/

components/
  shared/
    semaforo.tsx                # componente semáforo verde/amarelo/vermelho
    skeleton.tsx
    empty-state.tsx
  forms/
  charts/

supabase/
  migrations/                   # migrations SQL com RLS
```

## Fluxo de autenticação

```
/ → middleware → /projetos (autenticado) ou /auth/login (não autenticado)
Supabase Auth trigger → cria profile automaticamente
```

## Fluxo de geração de documentos via IA

```
1. Usuário clica "Gerar [Documento] com IA"
2. Modal mostra dados que serão usados (transparência)
3. Server action busca dados do projeto no Supabase
4. Chama Claude API com prompt específico do tipo de documento
5. Resposta em streaming → editor markdown
6. Usuário revisa e aprova
7. Salvo em `documentos` + `documentos_versoes`
```

## Padrões de código

- **Server Actions** para mutações (não API routes quando possível)
- **Server Components** por padrão; `'use client'` apenas quando necessário (interatividade, hooks)
- **Zod** para validação em todos os inputs externos
- **RLS** como linha de defesa principal — nunca confiar só no frontend
- **ANTHROPIC_API_KEY** apenas em server actions, nunca exposta ao browser

## Deploy

- CI/CD automático via GitHub → Vercel
- `npx tsc --noEmit` antes de commits importantes
- URL produção: `https://app.mca.com.br`
