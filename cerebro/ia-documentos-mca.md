---
tags: [plataforma-mca, ia, claude-api, documentos, pmbok]
---

> Hub: [[MCA]]

# IA — Geração de Documentos PMBOK

A principal diferença da Plataforma MCA: geração automática de documentos PMBOK via Claude API.

## Modelo

`claude-sonnet-4-20250514` via Anthropic SDK.

**Regra crítica:** `ANTHROPIC_API_KEY` apenas em server actions — **nunca** exposta ao browser.

## Fluxo de geração

```
1. Usuário clica "✨ Gerar [Documento] com IA"
2. Modal mostra os dados que serão usados (transparência)
3. Server action busca todos os dados relevantes do projeto no Supabase
4. Monta prompt com contexto completo
5. Chama Claude API (streaming)
6. Resposta renderizada no editor markdown (@uiw/react-md-editor)
7. Usuário revisa → pode editar → aprova
8. Salvo em tabela `documentos` + entrada em `documentos_versoes`
```

## Estados visuais do componente de geração

```
[botão] ✨ Gerar com IA
  → [modal] "Dados que serão usados" (lista de campos)
    → [loading] skeleton + mensagem "Gerando documento..."
      → [editor] markdown com streaming
        → [ações] Aprovar | Editar | Regenerar
```

## Documentos e seus prompts

| Documento | Tipo | Dados necessários |
|---|---|---|
| TAP | `TAP` | Dados básicos do projeto, cliente, objetivos, escopo preliminar |
| RACI | `RACI` | Equipe, atividades, fases PMBOK |
| Declaração de Escopo | `declaracao_escopo` | EAP, entregas, exclusões |
| PGP | `PGP` | Todos os planos subsidiários |
| Relatório de Status (RMA) | `RMA` | Cronograma, custos, riscos, progresso |
| Ata de Reunião | `ata` | Participantes, pauta, decisões, encaminhamentos |
| TEP | `TEP` | Entregas formais, lições aprendidas, avaliação final |

## Localização dos prompts

```
lib/ia/prompts/
  tap.ts
  raci.ts
  declaracao-escopo.ts
  pgp.ts
  rma.ts
  ata.ts
  tep.ts
  [tipo].ts         # um arquivo por tipo de documento
```

## Padrão de server action

```typescript
// app/actions/gerar-documento.ts
'use server'
import Anthropic from '@anthropic-ai/sdk'

export async function gerarDocumento(projetoId: string, tipo: TipoDocumento) {
  // 1. Buscar dados do projeto (autenticação via Supabase server client)
  // 2. Montar prompt específico do tipo
  // 3. Chamar Claude API
  // 4. Salvar em documentos + documentos_versoes
  // 5. Retornar conteúdo para o editor
}
```

## Princípios de prompt engineering para este contexto

- Incluir **contexto completo do projeto** (nome, tipo de obra, cliente, fase, dados quantitativos)
- Especificar **formato PMBOK** esperado (seções obrigatórias de cada documento)
- Solicitar **tom profissional** de consultoria de engenharia
- Incluir **dados reais** (datas, valores, nomes) — não placeholders
- Pedir saída em **markdown bem estruturado** para o editor
