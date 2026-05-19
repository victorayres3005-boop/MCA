import type { ContextoIA } from "./index";

const SEMAFORO_LABEL = { verde: "Verde — Saudável", amarelo: "Amarelo — Atenção", vermelho: "Vermelho — Crítico" };

export function buildRmaPrompt({ projeto }: ContextoIA): string {
  const hoje     = new Date().toLocaleDateString("pt-BR");
  const mesAno   = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const fmtData  = (d: string | null) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "A definir";
  const fmtValor = (v: number | null) =>
    v ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "A definir";

  return `Você é um consultor sênior de gerenciamento de projetos da MCA Consultoria, certificado PMP. Gere um Relatório Mensal de Acompanhamento (RMA) completo e profissional para o período de ${mesAno}.

DADOS DO PROJETO:
- Nome: ${projeto.nome}
- Código: ${projeto.codigo ?? "—"}
- Cliente: ${projeto.cliente?.nome ?? "—"}
- Status: ${projeto.status}
- Semáforo de Saúde: ${SEMAFORO_LABEL[projeto.semaforo]}
- % Concluído: ${projeto.percentual_concluido}%
- Início: ${fmtData(projeto.data_inicio)}
- Prazo Previsto: ${fmtData(projeto.data_fim_prevista)}
- Valor do Contrato: ${fmtValor(projeto.valor_contrato)}
${projeto.descricao ? `- Contexto: ${projeto.descricao}` : ""}

Gere o RMA completo em Markdown com as seguintes seções:

# Relatório Mensal de Acompanhamento — ${mesAno}
## Informações do Projeto
(tabela: nome, código, cliente, gerente, período, versão)

## Sumário Executivo
(parágrafo de 3-4 linhas com situação geral do projeto, semáforo e principais destaques do mês)

## Indicadores de Desempenho
(tabela com: indicador, previsto, realizado, variação, status — para prazo, custo, escopo e qualidade)

## Status por Área de Conhecimento
### Escopo
### Prazo / Cronograma
### Custos
### Qualidade
### Riscos e Problemas

## Atividades Realizadas no Período
(lista com as principais atividades concluídas no mês)

## Atividades Previstas para o Próximo Período
(lista com as principais atividades planejadas para o próximo mês)

## Problemas e Pendências
(tabela: problema, impacto, responsável, prazo, status)

## Riscos Monitorados
(tabela: risco, probabilidade, impacto, ação de resposta, status)

## Solicitações de Mudança
(se houver, lista as mudanças em análise ou aprovadas)

## Decisões Necessárias
(lista de decisões que requerem ação do cliente ou sponsor)

## Curva de Progresso
(descrição textual da curva S — previsto vs realizado)

## Próximos Marcos
(tabela com os próximos 3 marcos, datas previstas e status)

Data de emissão: ${hoje}

Elabore conteúdo profissional e realista baseado nos dados fornecidos. Não use placeholders.`;
}
