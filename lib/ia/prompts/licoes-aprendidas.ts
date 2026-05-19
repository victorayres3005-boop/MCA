import type { ContextoIA } from "./index";

export function buildLicoesAprendidasPrompt({
  projeto, encerramento, riscos = [], mudancas = [], atas = [],
}: ContextoIA): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const fmtData = (d: string | null) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "—";

  const licoesBruto = encerramento?.licoes_aprendidas ?? "";
  const positivosBruto = encerramento?.pontos_positivos ?? "";
  const melhoriasBruto = encerramento?.pontos_melhoria ?? "";

  const riscosOcorridos = riscos.filter((r) => r.status === "ocorrido");
  const riscosMitigados = riscos.filter((r) => r.status === "mitigado");
  const mudancasAprovadas = mudancas.filter((m) => m.status === "aprovada" || m.status === "implementada");
  const mudancasRejeitadas = mudancas.filter((m) => m.status === "rejeitada");
  const impactoCustoTotal = mudancasAprovadas.reduce((s, m) => s + (m.impacto_custo ?? 0), 0);
  const impactoPrazoTotal = mudancasAprovadas.reduce((s, m) => s + (m.impacto_prazo ?? 0), 0);

  const atasRecentes = [...atas]
    .sort((a, b) => b.data_reuniao.localeCompare(a.data_reuniao))
    .slice(0, 5);

  const contextoRiscos = riscos.length > 0 ? `
RISCOS DO PROJETO:
- Total identificados: ${riscos.length}
- Ocorridos: ${riscosOcorridos.length}${riscosOcorridos.length > 0 ? " — " + riscosOcorridos.map((r) => r.descricao.slice(0, 60)).join("; ") : ""}
- Mitigados com sucesso: ${riscosMitigados.length}` : "";

  const contextoMudancas = mudancas.length > 0 ? `
MUDANÇAS DO PROJETO:
- Total de solicitações: ${mudancas.length}
- Aprovadas/implementadas: ${mudancasAprovadas.length}
- Rejeitadas: ${mudancasRejeitadas.length}
- Impacto de custo aprovado: R$ ${impactoCustoTotal.toLocaleString("pt-BR")}
- Impacto de prazo aprovado: ${impactoPrazoTotal} dias` : "";

  const contextoAtas = atasRecentes.length > 0 ? `
ÚLTIMAS REUNIÕES (base para lições de comunicação e processo):
${atasRecentes.map((a) => `- ${fmtData(a.data_reuniao)}: ${a.titulo}${a.decisoes ? " | Decisões: " + a.decisoes.slice(0, 100) : ""}`).join("\n")}` : "";

  const dadosEncerramento = licoesBruto || positivosBruto || melhoriasBruto ? `
DADOS DE ENCERRAMENTO JÁ REGISTRADOS:
${licoesBruto ? `- Lições aprendidas: ${licoesBruto}` : ""}
${positivosBruto ? `- Pontos positivos: ${positivosBruto}` : ""}
${melhoriasBruto ? `- Pontos de melhoria: ${melhoriasBruto}` : ""}` : "\n(Sem dados de encerramento registrados — elabore com base no histórico do projeto)";

  return `Você é um consultor sênior de gerenciamento de projetos da MCA Consultoria, certificado PMP. Gere um Registro de Lições Aprendidas completo, estruturado e com alto valor para projetos futuros.

DADOS DO PROJETO:
- Nome: ${projeto.nome}
- Código: ${projeto.codigo ?? "—"}
- Tipo de Obra: ${projeto.tipo_obra ?? "Infraestrutura"}
- Cliente: ${projeto.cliente?.nome ?? "—"}
- Status: ${projeto.status}
- % Concluído: ${projeto.percentual_concluido}%
- Duração: ${fmtData(projeto.data_inicio)} a ${fmtData(projeto.data_fim_real ?? projeto.data_fim_prevista)}
${projeto.descricao ? `- Contexto: ${projeto.descricao}` : ""}
${dadosEncerramento}
${contextoRiscos}
${contextoMudancas}
${contextoAtas}

Gere o Registro de Lições Aprendidas completo em Markdown:

# Registro de Lições Aprendidas — ${projeto.nome}

## 1. Identificação
| Campo | Valor |
|---|---|
| Projeto | ${projeto.nome} |
| Código | ${projeto.codigo ?? "—"} |
| Cliente | ${projeto.cliente?.nome ?? "—"} |
| Tipo de Obra | ${projeto.tipo_obra ?? "—"} |
| Elaborado por | MCA Consultoria |
| Data | ${hoje} |
| Versão | 1.0 |

## 2. Resumo Executivo
(Parágrafo síntese do projeto: o que foi aprendido de mais relevante, contexto geral e importância deste registro para a base de conhecimento da MCA.)

## 3. Lições Aprendidas por Área de Conhecimento

Para cada área abaixo, forneça:
- **Situação observada**: o que aconteceu
- **Impacto**: qual foi o efeito (positivo ou negativo)
- **Lição aprendida**: o que deveria ser feito diferente ou mantido
- **Recomendação para projetos futuros**: ação específica e aplicável

### 3.1 Escopo
### 3.2 Prazo e Cronograma
### 3.3 Custos e Financeiro
### 3.4 Qualidade
### 3.5 Recursos Humanos e Equipe
### 3.6 Comunicação e Partes Interessadas
### 3.7 Riscos
${riscos.length > 0 ? "(Baseie-se nos riscos ocorridos e mitigados registrados no sistema)" : ""}
### 3.8 Aquisições e Contratos
### 3.9 Gerenciamento de Mudanças
${mudancas.length > 0 ? "(Analise o padrão de mudanças aprovadas e rejeitadas)" : ""}

## 4. Boas Práticas Identificadas
(Tabela: prática | área | resultado obtido | replicabilidade)
(Liste as práticas que funcionaram bem e devem ser adotadas como padrão)

## 5. Problemas Identificados e Soluções
(Tabela: problema | área | causa-raiz | solução adotada | prevenção futura)

## 6. Recomendações para Projetos Futuros
(Lista numerada de recomendações objetivas e acionáveis, ordenadas por prioridade de impacto)

## 7. Indicadores de Referência
(Tabela com os principais KPIs deste projeto como benchmarks:
% conclusão | variação de prazo | variação de custo | nº de mudanças | nº de riscos ocorridos | avaliação geral)

## 8. Histórico de Contribuições
| Data | Contribuidor | Área | Descrição |
|---|---|---|---|
| ${hoje} | MCA Consultoria | Geral | Geração inicial do registro |

---
*Registro de Lições Aprendidas elaborado pela MCA Consultoria em ${hoje}.*

IMPORTANTE: As lições aprendidas devem ser específicas, objetivas e baseadas em fatos reais do projeto. Evite generalidades — cada lição deve responder claramente "o que aprendemos e como aplicar isso no próximo projeto". Não use placeholders.`;
}
