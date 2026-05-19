import type { ContextoIA } from "./index";

export function buildAtaPrompt({ projeto }: ContextoIA): string {
  const hoje  = new Date().toLocaleDateString("pt-BR");
  const agora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return `Você é um consultor de gerenciamento de projetos da MCA Consultoria. Gere uma Ata de Reunião profissional e completa.

DADOS DO PROJETO:
- Nome: ${projeto.nome}
- Código: ${projeto.codigo ?? "—"}
- Cliente: ${projeto.cliente?.nome ?? "—"}
- Status: ${projeto.status}
- % Concluído: ${projeto.percentual_concluido}%
${projeto.descricao ? `- Contexto: ${projeto.descricao}` : ""}

Gere a ata de reunião de alinhamento/acompanhamento do projeto em Markdown com as seguintes seções:

# Ata de Reunião — ${projeto.nome}

## Identificação
(tabela com: projeto, código, data, horário de início, horário de término, local/plataforma, tipo de reunião)

## Participantes
(tabela com: nome, cargo/função, organização, presença confirmada)
- Incluir representantes da MCA Consultoria (gerente do projeto, analista)
- Incluir representantes do cliente
- Incluir responsáveis técnicos relevantes

## Pauta
(lista numerada dos itens da pauta discutidos)

## Desenvolvimento da Reunião
(para cada item da pauta, um sub-tópico com o resumo da discussão, pontos levantados e posição das partes)

## Decisões Tomadas
(tabela: nº, decisão, responsável, data-limite)

## Encaminhamentos e Ações
(tabela: nº, ação, responsável, prazo, status)

## Pendências Anteriores Verificadas
(tabela com pendências da reunião anterior e status atual)

## Próxima Reunião
(data, horário, local, pauta preliminar)

## Aprovação
(campo para assinatura do secretário da reunião e do gerente do projeto)

---
*Documento gerado em ${hoje} às ${agora} pela Plataforma MCA.*

Elabore uma ata realista e profissional para uma reunião de acompanhamento típica de projeto de ${projeto.tipo_obra ?? "infraestrutura"}. Crie participantes, itens de pauta e encaminhamentos plausíveis baseados no contexto do projeto. Não use placeholders.`;
}
