import type { ContextoIA } from "./index";

export function buildTepPrompt({ projeto, encerramento, marcos = [], orcamento }: ContextoIA): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const fmtData = (d: string | null) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "A definir";
  const fmtValor = (v: number) =>
    `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const totalMarcos = marcos.length;
  const marcosConcluidos = marcos.filter((m) => m.status === "concluido").length;
  const prazoCumprido = projeto.data_fim_real
    ? new Date(projeto.data_fim_real + "T00:00:00") <= new Date((projeto.data_fim_prevista ?? projeto.data_fim_real) + "T00:00:00")
    : null;

  const desempenhoFinanceiro = orcamento
    ? `- Valor planejado: ${fmtValor(orcamento.planejado)}
- Valor realizado: ${fmtValor(orcamento.realizado)}
- CPI: ${orcamento.planejado > 0 ? (orcamento.planejado / Math.max(orcamento.realizado, 1)).toFixed(2) : "—"}
- Variação de custo: ${fmtValor(orcamento.planejado - orcamento.realizado)}`
    : "- Dados financeiros não disponíveis";

  const dadosEncerramento = encerramento
    ? `
DADOS DE ENCERRAMENTO:
- Aceite formal: ${encerramento.aceite_formal ? "Sim" : "Não"}
- Aceito por: ${encerramento.aceite_formal && encerramento.aceito_por ? encerramento.aceito_por : "—"}
- Data de encerramento: ${fmtData(encerramento.data_encerramento ?? null)}
- Lições aprendidas registradas: ${encerramento.licoes_aprendidas ? "Sim" : "Não"}
- Pontos positivos: ${encerramento.pontos_positivos ?? "Não informado"}
- Pontos de melhoria: ${encerramento.pontos_melhoria ?? "Não informado"}`
    : "\n(Dados de encerramento não registrados — elabore com base no desempenho do projeto)";

  return `Você é um consultor sênior de gerenciamento de projetos da MCA Consultoria, certificado PMP. Gere um Termo de Encerramento do Projeto (TEP) completo, formal e pronto para assinatura do cliente.

DADOS DO PROJETO:
- Nome: ${projeto.nome}
- Código: ${projeto.codigo ?? "—"}
- Tipo de Obra: ${projeto.tipo_obra ?? "Infraestrutura"}
- Cliente: ${projeto.cliente?.nome ?? "—"}
- Status: ${projeto.status}
- Percentual Concluído: ${projeto.percentual_concluido}%
- Data de Início: ${fmtData(projeto.data_inicio)}
- Prazo Previsto: ${fmtData(projeto.data_fim_prevista)}
- Data de Encerramento Real: ${fmtData(projeto.data_fim_real)}
- Valor do Contrato: ${projeto.valor_contrato ? fmtValor(projeto.valor_contrato) : "A definir"}
${projeto.descricao ? `- Contexto: ${projeto.descricao}` : ""}
${dadosEncerramento}

DESEMPENHO DE MARCOS:
- Total de marcos: ${totalMarcos}
- Marcos concluídos: ${marcosConcluidos}
- Taxa de conclusão: ${totalMarcos > 0 ? Math.round((marcosConcluidos / totalMarcos) * 100) : 0}%
${prazoCumprido !== null ? `- Prazo: ${prazoCumprido ? "Cumprido" : "Encerrado com atraso"}` : ""}

DESEMPENHO FINANCEIRO:
${desempenhoFinanceiro}

Gere o TEP completo em Markdown seguindo o PMBOK 6ª edição:

# Termo de Encerramento do Projeto (TEP)

## 1. Identificação do Projeto
| Campo | Valor |
|---|---|
| Nome do Projeto | ${projeto.nome} |
| Código | ${projeto.codigo ?? "—"} |
| Cliente / Contratante | ${projeto.cliente?.nome ?? "—"} |
| Empresa Gestora | MCA Consultoria |
| Gerente do Projeto | |
| Data de Emissão | ${hoje} |
| Versão | 1.0 |

## 2. Objeto do Encerramento
(Descrição clara do que está sendo encerrado: projeto, fase ou contrato específico.)

## 3. Verificação do Produto / Serviço / Resultado
### 3.1 Escopo Contratado vs. Realizado
(Tabela comparando o escopo original com o que foi efetivamente entregue)

### 3.2 Critérios de Aceitação — Verificação
(Tabela: critério | atendido (Sim/Não/Parcial) | observação)

### 3.3 Pendências e Ressalvas
(Lista de itens pendentes, se houver, com prazo de resolução)

## 4. Análise de Desempenho
### 4.1 Desempenho de Prazo
(Análise do cumprimento do cronograma, marcos concluídos, causas de desvios se houver)

### 4.2 Desempenho de Custo
(Análise financeira: planejado vs realizado, CPI, causas de desvios)

### 4.3 Desempenho de Qualidade
(Avaliação da qualidade das entregas, não conformidades registradas e tratadas)

## 5. Documentação Entregue
(Lista dos documentos técnicos, relatórios e registros entregues ao cliente com o encerramento)

## 6. Transferência de Responsabilidades
(Descrição formal de quem assumiu a responsabilidade pelos resultados entregues e termos de garantia)

## 7. Lições Aprendidas
(Resumo das principais lições aprendidas organizadas por: boas práticas, problemas enfrentados e recomendações para projetos futuros)
${encerramento?.licoes_aprendidas ? `\nBASEIE-SE NESTES DADOS REAIS: ${encerramento.licoes_aprendidas}` : ""}

## 8. Arquivamento e Rastreabilidade
(Localização do arquivo de projeto, documentos históricos e registros para auditoria futura)

## 9. Reconhecimentos
(Parágrafo de reconhecimento à equipe e às partes envolvidas)

## 10. Aceite Formal — Declaração de Encerramento
(Declaração formal de que o projeto foi concluído e aceito conforme os termos contratuais)

## 11. Assinaturas
| Papel | Nome | Assinatura | Data |
|---|---|---|---|
| Gerente do Projeto (MCA) | | | |
| Diretor MCA | | | |
| Representante do Cliente | | | |
| Fiscal / Responsável Técnico | | | |

---
*Termo de Encerramento elaborado pela MCA Consultoria em ${hoje}.*

IMPORTANTE: Este documento tem caráter formal e legal. Elabore conteúdo preciso, profissional e baseado nos dados reais do projeto. Não use placeholders nas seções de conteúdo — apenas nas linhas de assinatura que aguardam preenchimento manual.`;
}
