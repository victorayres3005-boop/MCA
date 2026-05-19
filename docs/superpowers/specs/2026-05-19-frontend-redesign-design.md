# Frontend Redesign — Plataforma MCA
**Data:** 2026-05-19  
**Status:** Aprovado  
**Scope:** Redesign visual da interface — layout, sidebar, hero, lista de projetos e tokens de refinamento

---

## Contexto

A plataforma já possui uma fundação sólida: tokens Tailwind corretos, gradiente de marca navy→teal, sistema de semáforos e shadcn/ui. O objetivo deste redesign é elevar a coesão visual e o polimento para nível de produto SaaS premium, sem quebrar estrutura de dados ou server actions.

**Decisão central:** nenhuma mudança em server actions, schema, RLS ou lógica de negócio. Apenas camada de apresentação.

---

## Decisões de Design (validadas via Visual Companion)

| Decisão | Escolha |
|---|---|
| Direção visual | Hybrid Pro — sidebar dark + conteúdo light + header navy |
| Sidebar | Estruturada com seções (group headers PRINCIPAL / SISTEMA) |
| Lista de projetos | Rich List — semáforo com fundo colorido + metadados em linha |
| Hero do dashboard | Slim V2 — badge pill + título + CTA teal sólido + KPI strip |

---

## 1. Sidebar

**Arquivo:** `components/layout/sidebar.tsx`

### Especificação

- **Largura:** 150px (reduzido de 200px)
- **Fundo:** `#0D2B45` puro — sem gradiente (gradiente foi para o header)
- **Border right:** `1px solid rgba(255,255,255,0.06)`

### Estrutura de seções

```
┌─────────────────────┐
│  Logo área (56px)   │  logo 22px rounded + "MCA Gestão" + "Carteira de Obras"
├─────────────────────┤
│  PRINCIPAL          │  group label: 6px, weight 700, white/20, uppercase, tracking-wide
│  ▌ Carteira         │  ativo: barra left 2px teal + bg teal/15% + text white, weight 600
│    Clientes         │  inativo: text white/38%, hover bg white/[0.05]
│    Contratadas      │
├─────────────────────┤  divisor: 1px white/6%
│  SISTEMA            │  group label
│    Configurações    │
├─────────────────────┤
│  User footer        │  avatar inicial + email truncado + botão Sair
└─────────────────────┘
```

### Tokens de item

| Estado | Background | Texto | Ícone |
|---|---|---|---|
| Ativo | `rgba(0,180,166,0.15)` | `white` weight 600 | `#00B4A6` |
| Hover | `rgba(255,255,255,0.05)` | `white/70` | `white/50` |
| Inativo | transparent | `white/38` | `white/30` |

- Barra lateral ativa: `2px`, `border-radius: 0 2px 2px 0`, `background: #00B4A6`
- Padding item: `py-[5px] px-[6px]`, `border-radius: 4px`
- Ícone: Tabler, `size={14}`, `stroke={active ? 2 : 1.5}`
- Font size nav: `text-[12px]`

---

## 2. Hero da Carteira — Slim V2

**Arquivo:** `app/(dashboard)/projetos/page.tsx`

### Header navbar

```tsx
// Fundo: linear-gradient(135deg, #0D2B45 0%, #112e48 60%, #0e3341 100%)
// Padding: px-6 py-3

<div> // left
  <div class="badge-pill"> ● MCA Engenharia </div>
  <h1> Carteira de Obras </h1>
</div>
<button> + Novo projeto </button> // teal sólido #00B4A6
```

**Badge pill:**
- `bg: rgba(0,180,166,0.12)`, `border: 1px solid rgba(0,180,166,0.22)`
- `border-radius: 4px`, `px-2 py-0.5`
- Dot: `4px`, `background: #00B4A6`
- Texto: `7px`, weight 700, `rgba(0,180,166,0.8)`, uppercase, tracking-[0.15em]

**Título:**
- `font-size: 18px`, weight 800, color white, `letter-spacing: -0.02em`

**Botão CTA:**
- `background: #00B4A6`, text white, weight 700, `font-size: 9px`
- `border-radius: 7px`, `px-3 py-1.5`
- Hover: `background: #0A7B72`

### KPI strip

Fundo branco, `border-bottom: 1px solid #e2e8e8`, altura determinada pelo conteúdo

```
│  12          │  ● 7  ·  ● 3  ·  ● 2   │  R$ 15.5M    │  67%        │
│  projetos    │  semáforos              │  contratado  │  conclusão  │
```

- Separadores: `1px solid #eff2f2` entre células
- Números: `font-family: monospace`, weight 900
- Semáforos: três dots em linha — `6px rounded-full` verde/amarelo/vermelho + número ao lado
- Labels: `8px`, `#94a3a3`, weight 500
- Padding célula: `px-4 py-2`

---

## 3. Lista de Projetos — Rich List

**Arquivo:** `components/projetos/projetos-grid.tsx`

### Estrutura de cada linha

```
[SEM] Nome do Projeto   [badge-status]          R$ 2.1M
      OBR-001 · Cliente · Prazo: 15 dez   [████░░] 82%
```

### Specs do item

**Semáforo icon (lado esquerdo):**
- Container: `22×22px`, `border-radius: 6px`
- Fundo: `green-50` / `amber-50` / `red-50` conforme semáforo
- Dot interno: `7×7px rounded-full`, cor plena

**Coluna principal (flex-1):**
- Linha 1: nome em `font-size: 13px`, weight 600, `#0F1F1F` + badge de status inline
- Linha 2: `font-size: 11px`, `#94a3a3` — `{codigo} · {cliente} · Prazo: {data}`

**Coluna direita:**
- Valor: `font-size: 11px`, weight 700, monospace, `#0F1F1F`
- Progress bar: `3px height`, `border-radius: 2px`, cor conforme semáforo
- Porcentagem: `font-size: 10px`, monospace, `#94a3a3`

**Row container:**
- `padding: 8px 12px`
- `border-bottom: 1px solid #F5F7F7`
- Hover: `background: rgba(241,245,245,0.6)`
- Transição: `transition-all duration-150`

### Filtros (topo da lista)

- Container: `bg-surface-page/60`, `border-bottom: 1px solid #e2e8e8`
- Input busca: `text-[12px]`, `border-radius: 6px`, focus ring `brand-500/20`
- Select status: mesmo estilo do input
- Contador: `text-[11px] text-text-disabled tabular-nums` à direita

---

## 4. Tokens de refinamento global

### globals.css — adições

```css
/* Scrollbar refinada */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d0d8d8; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #94a3a3; }

/* Selection color */
::selection { background: rgba(0,180,166,0.18); }
```

### Transições padrão

- Substituir `transition-colors` por `transition-all duration-150 ease-out` nos itens de lista e nav

### Border radius

| Elemento | Valor |
|---|---|
| Cards e panels | `border-radius: 10px` |
| Itens de lista, badges | `border-radius: 6px` |
| Badges de status | `border-radius: 5px` |
| Inputs | `border-radius: 6px` |
| Botões primários | `border-radius: 7px` |

### Separadores

- Trocar `divide-gray-200` por `divide-[#F5F7F7]` — quase invisível, mais elegante

---

## 5. O que não muda

- Tokens de cor da marca (`brand-*`, `navy-*`, `status-*`) — já corretos
- Componentes shadcn/ui — não customizar primitivos
- Sistema de semáforos (lógica) — apenas visual do container
- Server Actions e schema Supabase
- Animações existentes (`animate-stagger`, `animate-page`)
- Componentes internos de projeto (`project-tab-bar`, módulos M01–M18)

---

## 6. Arquivos a modificar

| Arquivo | Tipo de mudança |
|---|---|
| `components/layout/sidebar.tsx` | Refactor completo de markup e estilos |
| `app/(dashboard)/projetos/page.tsx` | Novo hero slim V2 + KPI strip |
| `components/projetos/projetos-grid.tsx` | Rich list rows (substitui table grid) |
| `app/globals.css` | Scrollbar + selection color |
| `tailwind.config.ts` | Nenhuma mudança necessária |

---

## 7. Critérios de sucesso

- [ ] Sidebar 150px com group labels PRINCIPAL / SISTEMA
- [ ] Header da Carteira com badge pill teal + título 18px + CTA teal sólido
- [ ] KPI strip com semáforos em linha (3 dots coloridos)
- [ ] Lista de projetos em rich list com semáforo icon container colorido
- [ ] Scrollbar customizada visível na sidebar e lista
- [ ] `npx tsc --noEmit` passa sem erros após implementação
