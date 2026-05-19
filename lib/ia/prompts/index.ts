import type { Projeto } from "@/lib/types";
import { buildTapPrompt } from "./tap";
import { buildRmaPrompt } from "./rma";
import { buildAtaPrompt } from "./ata";
import { buildRaciPrompt } from "./raci";
import { buildDeclaracaoEscopoPrompt } from "./declaracao-escopo";
import { buildTepPrompt } from "./tep";
import { buildPgpPrompt } from "./pgp";
import { buildLicoesAprendidasPrompt } from "./licoes-aprendidas";

export type TipoDocumentoIA =
  | "TAP"
  | "RMA"
  | "ata"
  | "RACI"
  | "declaracao_escopo"
  | "TEP"
  | "PGP"
  | "licoes_aprendidas";

export interface ContextoIA {
  projeto: Projeto & { cliente?: { nome: string } | null };
  recursos?: { nome: string; papel: string | null; tipo: string }[];
  escopo?: {
    declaracao: string | null;
    exclusoes: string | null;
    premissas: string | null;
    restricoes: string | null;
    criterios_aceite: string | null;
  } | null;
  marcos?: { nome: string; data_prevista: string; status: string }[];
  encerramento?: {
    licoes_aprendidas: string | null;
    pontos_positivos: string | null;
    pontos_melhoria: string | null;
    data_encerramento: string | null;
    aceite_formal: boolean;
    aceito_por: string | null;
  } | null;
  orcamento?: { planejado: number; realizado: number };
  riscos?: { descricao: string; status: string; categoria: string; probabilidade: number; impacto: number }[];
  mudancas?: { titulo: string; status: string; impacto_custo: number | null; impacto_prazo: number | null }[];
  atas?: { titulo: string; data_reuniao: string; decisoes: string | null; encaminhamentos: string | null }[];
}

export const DOCUMENTOS_IA: { tipo: TipoDocumentoIA; titulo: string; descricao: string }[] = [
  {
    tipo:      "TAP",
    titulo:    "Termo de Abertura do Projeto",
    descricao: "Documento formal que autoriza o projeto e concede ao gerente autoridade para aplicar recursos.",
  },
  {
    tipo:      "declaracao_escopo",
    titulo:    "Declaração de Escopo",
    descricao: "Define detalhadamente o escopo do produto e do projeto: entregas, exclusões, premissas e restrições.",
  },
  {
    tipo:      "RACI",
    titulo:    "Matriz RACI",
    descricao: "Matriz de responsabilidades que define quem é Responsável, Aprovador, Consultado e Informado em cada atividade.",
  },
  {
    tipo:      "PGP",
    titulo:    "Plano de Gerenciamento do Projeto",
    descricao: "Plano integrado cobrindo todas as áreas de conhecimento do PMBOK: escopo, prazo, custo, qualidade, riscos e mais.",
  },
  {
    tipo:      "RMA",
    titulo:    "Relatório Mensal de Acompanhamento",
    descricao: "Relatório executivo com indicadores de desempenho, status por área e encaminhamentos do mês.",
  },
  {
    tipo:      "ata",
    titulo:    "Ata de Reunião",
    descricao: "Registro formal das decisões, encaminhamentos e participantes de reunião de projeto.",
  },
  {
    tipo:      "TEP",
    titulo:    "Termo de Encerramento do Projeto",
    descricao: "Documento formal de encerramento com análise de desempenho, aceite das entregas e lições aprendidas.",
  },
  {
    tipo:      "licoes_aprendidas",
    titulo:    "Registro de Lições Aprendidas",
    descricao: "Documenta o conhecimento adquirido no projeto para melhorar processos em iniciativas futuras.",
  },
];

export function buildPrompt(tipo: TipoDocumentoIA, ctx: ContextoIA): string {
  switch (tipo) {
    case "TAP":               return buildTapPrompt(ctx);
    case "RMA":               return buildRmaPrompt(ctx);
    case "ata":               return buildAtaPrompt(ctx);
    case "RACI":              return buildRaciPrompt(ctx);
    case "declaracao_escopo": return buildDeclaracaoEscopoPrompt(ctx);
    case "TEP":               return buildTepPrompt(ctx);
    case "PGP":               return buildPgpPrompt(ctx);
    case "licoes_aprendidas": return buildLicoesAprendidasPrompt(ctx);
  }
}
