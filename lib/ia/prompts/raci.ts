import type { ContextoIA } from "./index";

export function buildRaciPrompt({ projeto, recursos = [] }: ContextoIA): string {
  const hoje = new Date().toLocaleDateString("pt-BR");

  const membrosList = recursos.length > 0
    ? recursos.map((r) => `- ${r.nome}${r.papel ? ` — ${r.papel}` : ""}${r.tipo === "externo" || r.tipo === "contratado" ? " (externo)" : ""}`).join("\n")
    : "- Gerente de Projeto (MCA)\n- Engenheiro Responsável (MCA)\n- Analista de Projetos (MCA)\n- Fiscal do Cliente\n- Sponsor / Patrocinador\n- Empreiteiro / Contratada Principal";

  const colunas = recursos.length > 0
    ? recursos.map((r) => r.nome.split(" ")[0]).join(" | ")
    : "GP | Engenheiro | Analista | Fiscal | Sponsor | Contratada";

  return `Você é um consultor sênior de gerenciamento de projetos da MCA Consultoria, certificado PMP. Gere uma Matriz RACI completa, profissional e pronta para apresentação ao cliente.

DADOS DO PROJETO:
- Nome: ${projeto.nome}
- Código: ${projeto.codigo ?? "—"}
- Tipo de Obra: ${projeto.tipo_obra ?? "Infraestrutura"}
- Cliente: ${projeto.cliente?.nome ?? "—"}
- Status: ${projeto.status}
${projeto.descricao ? `- Contexto: ${projeto.descricao}` : ""}

MEMBROS DA EQUIPE (colunas da matriz):
${membrosList}

LEGENDA RACI:
R = Responsável — quem executa a atividade (pode haver mais de um R)
A = Aprovador (Accountable) — quem responde pelo resultado final (apenas UM por linha)
C = Consultado — quem deve ser ouvido antes (comunicação bidirecional)
I = Informado — quem deve ser notificado depois (comunicação unidirecional)

Gere a RACI completa em Markdown com esta estrutura:

# Matriz RACI — ${projeto.nome}

## 1. Identificação do Documento
| Campo | Valor |
|---|---|
| Projeto | ${projeto.nome} |
| Código | ${projeto.codigo ?? "—"} |
| Cliente | ${projeto.cliente?.nome ?? "—"} |
| Elaborado por | MCA Consultoria |
| Data | ${hoje} |
| Versão | 1.0 |

## 2. Legenda
(tabela explicando R, A, C, I com definições claras)

## 3. Matriz de Responsabilidades

Gere 5 seções, cada uma com uma tabela Markdown onde:
- Primeira coluna: atividade/entregável
- Demais colunas: ${colunas}

### 3.1 Iniciação
(6–8 atividades típicas de iniciação para obras de ${projeto.tipo_obra ?? "infraestrutura"}: elaboração do TAP, identificação de stakeholders, kick-off, etc.)

### 3.2 Planejamento
(8–10 atividades: elaboração do cronograma, plano de custos, plano de qualidade, plano de riscos, plano de comunicação, contratações, etc.)

### 3.3 Execução
(8–10 atividades: mobilização de equipe, execução das obras/serviços, gestão de contratos, relatórios de progresso, reuniões de acompanhamento, etc.)

### 3.4 Monitoramento e Controle
(6–8 atividades: controle de cronograma, controle de custos, controle de qualidade, gestão de riscos, controle de mudanças, etc.)

### 3.5 Encerramento
(5–6 atividades: aceite formal, desmobilização, lições aprendidas, arquivo de documentos, relatório final, etc.)

## 4. Resumo de Responsabilidades por Membro
(tabela: membro | principal responsabilidade | número de R | número de A)

## 5. Histórico de Revisões
| Versão | Data | Autor | Descrição |
|---|---|---|---|
| 1.0 | ${hoje} | MCA Consultoria | Emissão inicial |

---
*Documento gerado pela Plataforma MCA em ${hoje}.*

IMPORTANTE: Atribua exatamente UM "A" por linha da matriz. Distribua os papéis de forma realista para um projeto de ${projeto.tipo_obra ?? "infraestrutura"} gerenciado pela MCA. Não use placeholders.`;
}
