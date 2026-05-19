# CLAUDE.md — Plataforma MCA

Leia este arquivo no início de cada sessão. Ele é o ponto de entrada do Claude Code para este projeto.

## O que é este projeto

SaaS de gerenciamento de carteira de obras para a MCA — consultora que atua como gestora intermediária entre clientes e contratadas. Digitaliza e automatiza o gerenciamento baseado na metodologia PMBOK (hoje feito manualmente via Excel e Word).

**Dois diferenciais:**
1. Geração automática de documentos PMBOK via IA (TAP, RACI, Planos, Relatórios, Atas, TEP)
2. Dashboard consolidado da carteira em tempo real com semáforos, KPIs e forecasts

## Onde está o conhecimento

### Cérebro Obsidian (conhecimento estável)
```
C:\Users\Admin\Documents\PLATAFORMA - MCA\
  MCA.md                          ← hub principal, leia aqui primeiro
  cerebro\
    arquitetura-mca.md            ← stack, estrutura de diretórios, fluxos
    modulos-mca.md                ← lista de módulos M01–M18 e status
    banco-dados-mca.md            ← schema Supabase, RLS, tabelas
    ia-documentos-mca.md          ← geração PMBOK via Claude API
    design-system-mca.md          ← paleta, tokens Tailwind, componentes
    decisoes-mca.md               ← ADRs — decisões arquiteturais
    glossario-mca.md              ← termos PMBOK e do domínio
    historico-mca.md              ← changelog datado de sessões
    protocolo-claude-mca.md       ← como usar e manter este cérebro
```

### Memória cronológica (auto-load)
- `MEMORY.md` em `~/.claude/projects/.../memory/` — carrega automaticamente

### Documento fonte
- `Plataforma MCA - Claude.md.pdf` — especificação completa de 46 páginas (stack, schema, módulos, design, prompts de IA). **Fonte de verdade absoluta** — consulte quando houver dúvida sobre qualquer detalhe.

## Stack

- **Next.js 14+** (App Router) + TypeScript estrito
- **Supabase** (PostgreSQL + Auth + Storage)
- **Anthropic Claude API** (`claude-sonnet-4-20250514`) — apenas em server actions
- **Tailwind CSS** + **shadcn/ui** (não customizar primitivos)
- **Recharts** para gráficos (curva S, KPIs)
- **@react-pdf/renderer** para exportação de PDFs
- **react-hook-form + Zod** para formulários
- **sonner** para toasts
- **Vercel** para deploy (CI/CD via GitHub)

## Variáveis de ambiente

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=              # NUNCA expor no cliente
NEXT_PUBLIC_APP_URL=https://app.mca.com.br
```

## Regras críticas

1. **RLS em todas as tabelas** — nunca criar tabela sem policy RLS
2. **ANTHROPIC_API_KEY apenas em server actions** — jamais expor ao browser
3. **Server Components por padrão** — `'use client'` apenas para interatividade real
4. **TypeScript estrito** — sem `any` implícito
5. **Não customizar primitivos do shadcn** — estender via className e tokens Tailwind
6. **`npx tsc --noEmit` antes de deploy**

## Roles do sistema

| Role | Pode fazer |
|---|---|
| `admin` | Tudo, incluindo gerenciar usuários e org |
| `gerente` | Criar/editar projetos, gerar e aprovar docs, aprovar mudanças |
| `analista` | Editar dados operacionais, gerar documentos via IA |
| `visualizador` | Somente leitura |

## Identidade visual (resumo)

- **Cor primária (brand):** `#00B4A6` (teal)
- **Cor secundária:** `#0D2B45` (navy)
- **Gradiente da marca:** `linear-gradient(110deg, #0D2B45 0%, #0D2B45 40%, #0A7B72 75%, #00B4A6 100%)`
- **Semáforos:** verde `#16A34A` | amarelo `#F59E0B` | vermelho `#DC2626`
- **Fonte da identidade:** extraída de `mca.vagas.solides.com.br` e `mca.srv.br`

## Protocolo de manutenção do cérebro

Ao finalizar uma sessão com mudanças com peso de invariante:
1. Atualizar o arquivo relevante em `cerebro/` (vault Obsidian)
2. Adicionar entrada em `historico-mca.md`
3. Atualizar memória cronológica se houver fato novo

Detalhe completo em: `cerebro/protocolo-claude-mca.md`

## Onde editar o quê

| Mudança | Arquivo |
|---|---|
| Novo módulo / página | `app/(dashboard)/...` |
| Prompt de IA para documento | `lib/ia/prompts/<tipo>.ts` |
| Schema banco | `supabase/migrations/*.sql` |
| Design tokens | `tailwind.config.ts` |
| Componentes compartilhados | `components/shared/` |
| Server Actions | `app/actions/` |
