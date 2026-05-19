---
tags: [plataforma-mca, design, tailwind, ui]
---

> Hub: [[MCA]]

# Design System — Plataforma MCA

Identidade visual extraída do portal oficial da MCA (`mca.vagas.solides.com.br`) e do site institucional (`mca.srv.br`).

## Paleta de Cores

### Cores principais (brand)

| Token | Hex | Uso |
|---|---|---|
| `brand-500` / teal primário | `#00B4A6` | Botões principais, links ativos, badges, ícones de destaque, borda de foco |
| `brand-700` / teal hover | `#0A7B72` | Hover de botões, estado ativo de sidebar |
| `brand-900` / teal profundo | `#054F4A` | Textos sobre fundo teal claro |
| `navy-700` | `#0D2B45` | Cor secundária — header hero, fundo da sidebar, backgrounds escuros |
| `navy-600` | `#163D5C` | Variação mais clara do navy para hover e gradientes |
| `brand-50` / teal suave | `#E0F5F3` | Fundo de tags, badges suaves, highlight de linhas em tabela |
| `brand-100` | `#B2E4E1` | Borda de tags teal, hover de itens |

### Paleta neutra

| Token | Hex | Uso |
|---|---|---|
| `white` | `#FFFFFF` | Fundo de cards, fundo principal da aplicação |
| `gray-50` | `#F8FAFB` | Fundo de página (body background) |
| `gray-100` | `#F1F5F5` | Fundo de inputs, fundo de tabela alternado |
| `gray-200` | `#E2E8E8` | Bordas de cards, separadores, bordas de inputs |
| `gray-400` | `#94A3A3` | Placeholder de inputs, ícones desabilitados |
| `gray-600` | `#4A6060` | Texto secundário, labels, metadados |
| `gray-900` | `#0F1F1F` | Texto principal (headings, body text denso) |

### Cores semânticas (semáforos e status)

| Status | Token | Hex | Fundo suave |
|---|---|---|---|
| No prazo / Verde | `green-600` | `#16A34A` | `#F0FDF4` |
| Em risco / Amarelo | `amber-500` | `#F59E0B` | `#FFFBEB` |
| Atrasado / Vermelho | `red-600` | `#DC2626` | `#FEF2F2` |
| Informativo / Azul | `blue-600` | `#2563EB` | `#EFF6FF` |
| Encerrado / Roxo | `purple-600` | `#9333EA` | `#FAF5FF` |
| Suspenso / Cinza | `gray-500` | `#6B7280` | `#F9FAFB` |

## Gradiente característico da marca

```css
/* Gradiente horizontal — hero banner, cabeçalhos especiais, loading screens */
background: linear-gradient(110deg, #0D2B45 0%, #0D2B45 40%, #0A7B72 75%, #00B4A6 100%);

/* Variação sutil para fundo de card */
background: linear-gradient(135deg, #0D2B45 0%, #163D5C 100%);
```

Em Tailwind: classe `bg-brand-gradient` (customizada em `tailwind.config.ts`).

## Logo da MCA

- **Símbolo:** globo formado por meridianos e paralelos em linhas finas, sem preenchimento sólido.
- **Wordmark:** letras "MCA" em caixa alta, peso bold, letter-spacing ~0.15em.

**Regras:**
- Fundo escuro (navy `#0D2B45` ou preto): logo em branco `#FFFFFF`
- Fundo branco ou claro: logo na cor teal primária `#00B4A6`
- Nunca distorcer proporções ou adicionar sombra
- Espaço de proteção = altura da letra "M" em todos os lados

## Layout da Aplicação

### Sidebar (240px, fundo navy-700)

```css
/* Sidebar container */
width: 240px;
background: #0D2B45; /* navy-700 */
border-right: 1px solid rgba(255,255,255,0.08);

/* Item inativo */
color: rgba(255, 255, 255, 0.60);
padding: 8px 16px;
border-radius: 6px;

/* Item hover */
background: rgba(255, 255, 255, 0.06);
color: rgba(255, 255, 255, 0.85);

/* Item ativo */
background: rgba(0, 180, 166, 0.15); /* brand-500 @ 15% opacidade */
border-left: 3px solid #00B4A6;
color: #FFFFFF;
padding-left: 13px; /* compensar a borda */
```

### Header da página (56px)

- `bg-white`, `border-bottom: 1px solid #E2E8E8`
- Breadcrumb + ações rápidas contextuais

### Hero banner do projeto

```tsx
<div className="bg-brand-gradient rounded-xl p-6 mb-6 text-white">
  {/* código OBR, nome do projeto, cliente, cidade */}
  {/* 4 KPI cards em glass morphism sobre o gradiente */}
</div>
```

## Componentes chave

### Semáforo
```tsx
// components/shared/semaforo.tsx
type Cor = 'verde' | 'amarelo' | 'vermelho'
// Bolinha colorida + label + tooltip
// bg suave (verde-50, amber-50, red-50) com borda correspondente
```

### Empty State
- Ícone SVG simples (Tabler icon)
- Mensagem amigável
- Botão de ação primária (CTA)
- **Nunca** tela em branco

### Skeleton Loading
- Toda tabela, card e lista tem skeleton que replica o layout exato do conteúdo

## Princípios de Design

1. **Interface técnica e densa** — contexto de engenharia. Tabelas densas são bem-vindas.
2. **Hierarquia de cor** — teal = ação/positivo; navy = estrutura/confiança; vermelho = alerta; amarelo = atenção. Nunca decorativo.
3. **Consistência sobre criatividade** — sempre usar tokens definidos, nunca valores hardcoded.
4. **Semáforos onipresentes** — todo KPI com meta tem semáforo. Status de tudo visível de relance.
5. **Feedback imediato** — toda ação tem resposta visual < 200ms. Validação inline. Toasts (sonner).
6. **States definidos** — loading (skeleton), vazio (empty state com CTA), erro (toast + mensagem inline).
