import type { ContextoIA } from "./index";

export function buildPgpPrompt({ projeto, escopo, recursos = [], riscos = [] }: ContextoIA): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const fmtData = (d: string | null) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "A definir";
  const fmtValor = (v: number | null) =>
    v ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "A definir";

  const equipe = recursos.length > 0
    ? recursos.map((r) => `- ${r.nome}${r.papel ? ` — ${r.papel}` : ""}`).join("\n")
    : "- Equipe a ser definida (padrão MCA: GP, engenheiro responsável, analista, fiscal)";

  const riscosAltos = riscos.filter((r) => r.probabilidade * r.impacto >= 15).length;
  const riscosMedios = riscos.filter((r) => { const s = r.probabilidade * r.impacto; return s >= 6 && s < 15; }).length;

  const dadosEscopo = escopo?.declaracao
    ? `Escopo declarado: ${escopo.declaracao.slice(0, 300)}${escopo.declaracao.length > 300 ? "..." : ""}`
    : "Escopo: a ser detalhado no plano";

  return `Você é um consultor sênior de gerenciamento de projetos da MCA Consultoria, certificado PMP e especializado em projetos de infraestrutura industrial no Brasil. Gere um Plano de Gerenciamento do Projeto (PGP) completo, executivo e pronto para aprovação.

DADOS DO PROJETO:
- Nome: ${projeto.nome}
- Código: ${projeto.codigo ?? "—"}
- Tipo de Obra: ${projeto.tipo_obra ?? "Infraestrutura"}
- Cliente: ${projeto.cliente?.nome ?? "—"}
- Status: ${projeto.status}
- Início: ${fmtData(projeto.data_inicio)}
- Prazo Previsto: ${fmtData(projeto.data_fim_prevista)}
- Valor do Contrato: ${fmtValor(projeto.valor_contrato)}
- % Concluído: ${projeto.percentual_concluido}%
${projeto.descricao ? `- Contexto: ${projeto.descricao}` : ""}

${dadosEscopo}

EQUIPE DO PROJETO:
${equipe}

PERFIL DE RISCOS:
- Riscos de alto nível: ${riscosAltos}
- Riscos de nível médio: ${riscosMedios}
- Total identificados: ${riscos.length}

Gere o PGP completo em Markdown, cobrindo TODOS os planos subsidiários do PMBOK 6ª edição:

# Plano de Gerenciamento do Projeto (PGP)

## 1. Identificação e Controle do Documento
| Campo | Valor |
|---|---|
| Projeto | ${projeto.nome} |
| Código | ${projeto.codigo ?? "—"} |
| Cliente | ${projeto.cliente?.nome ?? "—"} |
| Gerente do Projeto | — |
| Data de emissão | ${hoje} |
| Versão | 1.0 |
| Status | Em elaboração |

## 2. Visão Geral do Projeto
(Resumo executivo: propósito, objetivos SMART, principais entregas e critérios de sucesso — 3 a 4 parágrafos)

## 3. Ciclo de Vida e Abordagem de Gerenciamento
(Descrição das fases do projeto, abordagem de gerenciamento escolhida e justificativa)

---

## 4. Plano de Gerenciamento do Escopo
### 4.1 Como o escopo será definido
### 4.2 Como a EAP será criada e mantida
### 4.3 Processo de controle de mudanças de escopo
### 4.4 Critérios de aceitação das entregas

## 5. Plano de Gerenciamento do Cronograma
### 5.1 Metodologia e ferramentas de cronograma
### 5.2 Nível de precisão e unidades de medida
### 5.3 Limites de controle (variações aceitáveis)
### 5.4 Reuniões de acompanhamento (frequência, participantes, pauta padrão)
### 5.5 Critérios de atualização do cronograma

## 6. Plano de Gerenciamento dos Custos
### 6.1 Unidades de medida e precisão
### 6.2 Processo de estimativa e orçamentação
### 6.3 Limites de controle de custos
### 6.4 Processo de aprovação de gastos (tabela de alçadas)
### 6.5 Formato dos relatórios financeiros

## 7. Plano de Gerenciamento da Qualidade
### 7.1 Padrões de qualidade aplicáveis (normas ABNT, regulatórias)
### 7.2 Atividades de garantia da qualidade (auditorias, inspeções)
### 7.3 Atividades de controle da qualidade (checklists, ensaios)
### 7.4 Processo de não conformidades (RNC)

## 8. Plano de Gerenciamento dos Recursos
### 8.1 Identificação de recursos necessários
### 8.2 Papéis, responsabilidades e autoridades (resumo)
### 8.3 Gestão de competências e treinamentos
### 8.4 Reconhecimento e recompensas

## 9. Plano de Gerenciamento das Comunicações
### 9.1 Requisitos de comunicação das partes interessadas
### 9.2 Matriz de comunicação resumida
(tabela: informação | formato | frequência | responsável | destinatários)
### 9.3 Ferramentas e plataformas utilizadas
### 9.4 Língua, formato e restrições de confidencialidade

## 10. Plano de Gerenciamento dos Riscos
### 10.1 Metodologia de gestão de riscos
### 10.2 Categorias de risco (RBS — Risk Breakdown Structure)
### 10.3 Escala de probabilidade e impacto utilizada
### 10.4 Matriz de probabilidade × impacto e limiares
### 10.5 Frequência de revisão do registro de riscos
### 10.6 Reservas de contingência (% do orçamento)

## 11. Plano de Gerenciamento das Aquisições
### 11.1 Política de aquisições da organização
### 11.2 Tipos de contratos preferenciais
### 11.3 Processo de contratação e aprovação
### 11.4 Critérios de seleção de fornecedores
### 11.5 Métricas de desempenho de contratos

## 12. Plano de Engajamento das Partes Interessadas
### 12.1 Abordagem de identificação e análise
### 12.2 Estratégias de engajamento por grupo
### 12.3 Monitoramento do nível de engajamento
### 12.4 Gestão de expectativas e conflitos

## 13. Linha de Base Integrada
### 13.1 Linha de base do escopo
### 13.2 Linha de base do cronograma
### 13.3 Linha de base dos custos (orçamento aprovado)

## 14. Gestão de Mudanças
### 14.1 Processo de solicitação de mudança
### 14.2 Comitê de controle de mudanças (CCM)
### 14.3 Categorias e impacto mínimo para escalonamento
### 14.4 Atualização das linhas de base

## 15. Aprovações
| Papel | Nome | Assinatura | Data |
|---|---|---|---|
| Gerente do Projeto | | | |
| Sponsor / Patrocinador | | | |
| Diretor MCA | | | |
| Representante do Cliente | | | |

---
*Plano de Gerenciamento do Projeto elaborado pela MCA Consultoria em ${hoje}.*

IMPORTANTE: Elabore cada seção com conteúdo substantivo e específico para um projeto de ${projeto.tipo_obra ?? "infraestrutura"}, não apenas descrições genéricas. Use tabelas onde aplicável. O documento deve estar pronto para aprovação do cliente.`;
}
