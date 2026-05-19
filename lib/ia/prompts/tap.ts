import type { ContextoIA } from "./index";

export function buildTapPrompt({ projeto }: ContextoIA): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const fmtData = (d: string | null) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "A definir";
  const fmtValor = (v: number | null) =>
    v ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "A definir";

  return `Você é um consultor sênior de gerenciamento de projetos certificado PMP, especializado em projetos de infraestrutura e obras industriais no Brasil, trabalhando pela MCA Consultoria.

Gere um Termo de Abertura do Projeto (TAP) completo e profissional seguindo rigorosamente o padrão PMBOK 6ª edição, em português do Brasil com tom formal de consultoria de engenharia.

DADOS DO PROJETO:
- Nome: ${projeto.nome}
- Código: ${projeto.codigo ?? "A definir"}
- Tipo de Obra: ${projeto.tipo_obra ?? "Não especificado"}
- Cliente: ${projeto.cliente?.nome ?? "A definir"}
- Status Atual: ${projeto.status}
- Data de Início: ${fmtData(projeto.data_inicio)}
- Prazo Previsto: ${fmtData(projeto.data_fim_prevista)}
- Valor do Contrato: ${fmtValor(projeto.valor_contrato)}
- Percentual Concluído: ${projeto.percentual_concluido}%
${projeto.descricao ? `- Contexto do Projeto: ${projeto.descricao}` : ""}

EMPRESA GESTORA: MCA Consultoria — empresa especializada em gestão intermediária de projetos de infraestrutura, atuando como Project Management Office (PMO) externo.

Gere o TAP completo em Markdown bem estruturado com as seguintes seções obrigatórias:

# Termo de Abertura do Projeto (TAP)
## 1. Identificação do Projeto
(tabela com: nome, código, tipo, cliente, gestor do projeto, data de elaboração, versão)

## 2. Justificativa e Objetivos Estratégicos
(por que o projeto existe, qual problema resolve, alinhamento estratégico)

## 3. Escopo de Alto Nível
(o que está incluído e o que está excluído explicitamente)

## 4. Principais Entregas
(lista das entregas mais importantes do projeto)

## 5. Premissas e Restrições
(tabela com premissas e restrições identificadas)

## 6. Riscos de Alto Nível
(tabela com top 5 riscos: risco, probabilidade, impacto, resposta preliminar)

## 7. Cronograma de Marcos
(tabela com marcos principais e datas previstas)

## 8. Estimativa de Custos de Alto Nível
(resumo orçamentário com categorias principais)

## 9. Partes Interessadas Principais
(tabela com stakeholders, papel e interesse no projeto)

## 10. Critérios de Sucesso
(lista de critérios mensuráveis para considerar o projeto bem-sucedido)

## 11. Autoridade e Responsabilidade do Gerente do Projeto
(descrição das responsabilidades e limites de autoridade)

## 12. Aprovações
(tabela para assinaturas: nome, cargo, organização, data, assinatura)

Data do documento: ${hoje}

IMPORTANTE: Não use placeholders como "[preencher]" ou "[inserir nome]". Onde não houver dados suficientes, elabore conteúdo profissional razoável baseado no tipo de projeto e registre as suposições como premissas. O documento deve estar pronto para apresentação ao cliente.`;
}
