---
tags: [plataforma-mca, claude, protocolo, manutencao]
---

> Hub: [[MCA]]

# Protocolo Claude — Plataforma MCA

Como o Claude Code deve usar e atualizar este cérebro a cada sessão.

## Em toda nova sessão

1. **Ler `MEMORY.md`** primeiro — carrega automático e dá contexto cronológico recente.
2. **Ler `MCA.md`** quando o projeto estiver no escopo — dá o mapa estável.
3. **Buscar arquivos relevantes em `cerebro/`** conforme o tema (ex: tarefa de IA → ler `ia-documentos-mca`).

## Regra de ouro — estável vs cronológico

| Tipo de info | Onde mora |
|---|---|
| "Como o sistema funciona" | `cerebro/` (este vault) |
| "O que aconteceu / quando / quem disse" | `~/.claude/.../memory/` (auto-load) |
| "Como atualizei o sistema HOJE" | `cerebro/historico-mca.md` (entrada nova) + memory (factual) |

**Não duplicar.** Memória é cronológica e datada. Cérebro é estável e descreve o presente.

## Quando atualizar `cerebro/`

| Mudança | Arquivo |
|---|---|
| Novo módulo implementado ou alterado | `modulos-mca` |
| Decisão arquitetural com peso | `decisoes-mca` (novo ADR no final) |
| Nova tabela / migration / RLS | `banco-dados-mca` |
| Mudança em prompt de IA | `ia-documentos-mca` |
| Mudança de token Tailwind / componente | `design-system-mca` |
| Novo termo do domínio PMBOK/MCA | `glossario-mca` |
| Sessão concluída com mudanças deployadas | `historico-mca` (entrada nova **no topo**) |

## Quando NÃO atualizar

- Bug fix trivial sem mudança de invariante → vai no commit
- Refactor local sem peso arquitetural → vai no commit
- Decisão cosmética → não entra

## Como atualizar (procedimento)

1. Faça a mudança no projeto
2. Identifique: a mudança altera **invariantes** ou **conhecimento estável**?
3. Se sim: ache o arquivo em `cerebro/`, atualize a seção
4. Se for ADR ou histórico: adicione **no topo** com data

## Localização das duas cópias

```
Vault Obsidian = Projeto:   C:\Users\Admin\Documents\PLATAFORMA - MCA\
```

Os dois devem estar sincronizados após cada update significativo.

## Padrão de sessão "execução + memória"

Ao terminar uma sessão de desenvolvimento:

1. ✅ Código commitado / deployado
2. ✅ Entrada nova em `historico-mca` (data, o que foi feito)
3. ✅ Arquivo do cérebro relevante atualizado se invariante mudou
4. ✅ Memória cronológica atualizada se houver fato novo importante

## Princípios de escrita do cérebro

- **Conciso > exaustivo.** Notas curtas (50-200 linhas) são mais úteis que tomos.
- **Linkar com `[[wikilinks]]`** entre arquivos do vault.
- **Citar arquivo** quando relevante (ex: `lib/ia/prompts/tap.ts`).
- **Usar tabelas** para mappings (módulo → status, sintoma → causa).
- **Frontmatter `tags`** para discoverability no Obsidian.

## Quando ler o cérebro vs perguntar ao usuário

- Antes de propor mudança arquitetural → checar `decisoes-mca`
- Antes de gerar novo documento IA → checar `ia-documentos-mca`
- Antes de nova tabela → checar `banco-dados-mca` para não conflitar
- Antes de novo componente → checar `design-system-mca` para tokens corretos

## Auto-update

Quando o usuário pedir "atualiza o cérebro", "salva isso no cérebro", "registra essa decisão":

1. Identifique qual arquivo do cérebro toca
2. Atualize **ambas** as cópias (vault + projeto)
3. Se for incidente/cirurgia, adicione entrada em `historico-mca`
4. Se for regra duradoura, adicione em `decisoes-mca` como ADR

Quando o usuário não pedir explicitamente mas a sessão executar mudanças com peso de invariante, **proponha** atualizar o cérebro antes de fechar.
