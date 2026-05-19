import type { ContextoIA } from "./index";

export function buildDeclaracaoEscopoPrompt({ projeto, escopo, marcos = [] }: ContextoIA): string {
  const hoje = new Date().toLocaleDateString("pt-BR");
  const fmtData = (d: string | null) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("pt-BR") : "A definir";
  const fmtValor = (v: number | null) =>
    v ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "A definir";

  const dadosEscopo = escopo
    ? `
DADOS DE ESCOPO REGISTRADOS NO SISTEMA:
- Declaração de escopo cadastrada: ${escopo.declaracao ?? "Não informado"}
- Exclusões: ${escopo.exclusoes ?? "Não informado"}
- Premissas: ${escopo.premissas ?? "Não informado"}
- Restrições: ${escopo.restricoes ?? "Não informado"}
- Critérios de aceite: ${escopo.criterios_aceite ?? "Não informado"}`
    : "\n(Nenhum dado de escopo cadastrado — elabore com base no tipo e contexto do projeto)";

  const dadosMarcos = marcos.length > 0
    ? "\nMARCOS DO PROJETO:\n" + marcos.map((m) => `- ${m.nome} — ${fmtData(m.data_prevista)} [${m.status}]`).join("\n")
    : "";

  return `Você é um consultor sênior de gerenciamento de projetos da MCA Consultoria, certificado PMP. Gere uma Declaração de Escopo do Projeto completa, formal e pronta para aprovação do cliente.
${dadosEscopo}

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
${dadosMarcos}

Gere a Declaração de Escopo completa em Markdown seguindo rigorosamente o PMBOK 6ª edição:

# Declaração de Escopo do Projeto

## 1. Identificação
| Campo | Valor |
|---|---|
| Projeto | ${projeto.nome} |
| Código | ${projeto.codigo ?? "—"} |
| Cliente | ${projeto.cliente?.nome ?? "—"} |
| Elaborado por | MCA Consultoria |
| Data de emissão | ${hoje} |
| Versão | 1.0 |

## 2. Descrição do Escopo do Produto
(Descrição detalhada das características e funções do produto, serviço ou resultado que o projeto deve entregar. Mínimo 3 parágrafos bem desenvolvidos descrevendo o que será construído/entregue.)

## 3. Entregas do Projeto
(Lista hierárquica das principais entregas tangíveis, agrupadas por fase. Para cada entrega: nome, breve descrição e critério de conclusão.)

## 4. Critérios de Aceitação do Produto
(Tabela com: entrega | critério de aceitação | responsável pela verificação | método de verificação)
(Use os critérios de aceite do sistema ou elabore critérios técnicos adequados ao tipo de obra.)

## 5. Exclusões do Projeto
(Lista clara do que NÃO está incluído no escopo, para evitar expectativas incorretas do cliente.)
(Use as exclusões do sistema, complementando com exclusões típicas deste tipo de obra.)

## 6. Restrições do Projeto
(Tabela com: restrição | tipo | impacto | forma de gestão)
Tipos: Prazo | Custo | Qualidade | Recursos | Regulatório | Ambiental

## 7. Premissas do Projeto
(Lista numerada das premissas assumidas, incluindo riscos associados se a premissa não se confirmar.)
(Use as premissas do sistema, complementando com premissas típicas deste tipo de projeto.)

## 8. Dependências e Interfaces
(Tabela com: item | tipo de dependência | responsável | impacto se não atendido)

## 9. Requisitos de Alto Nível
(Lista dos principais requisitos técnicos, regulatórios e de qualidade exigidos para o projeto.)

## 10. Aprovações
| Papel | Nome | Assinatura | Data |
|---|---|---|---|
| Gerente do Projeto | | | |
| Sponsor | | | |
| Cliente / Fiscal | | | |
| Diretor MCA | | | |

---
*Declaração de Escopo elaborada pela MCA Consultoria em ${hoje}.*

IMPORTANTE: Se os dados de escopo do sistema forem incompletos, elabore conteúdo profissional e detalhado compatível com um projeto de ${projeto.tipo_obra ?? "infraestrutura"}. Não use placeholders — o documento deve estar pronto para entrega ao cliente.`;
}
