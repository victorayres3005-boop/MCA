export type Role = "admin" | "gerente" | "analista" | "visualizador";

export type StatusProjeto =
  | "planejamento"
  | "execucao"
  | "monitoramento"
  | "encerrado"
  | "suspenso";

export type CorSemaforo = "verde" | "amarelo" | "vermelho" | "roxo" | "cinza";

export type FasePmbok =
  | "iniciacao"
  | "planejamento"
  | "execucao"
  | "monitoramento"
  | "encerramento";

export type TipoDocumento =
  | "TAP"
  | "PGP"
  | "relatorio_status"
  | "relatorio_desempenho"
  | "RMA"
  | "declaracao_escopo"
  | "EAP"
  | "dicionario_eap"
  | "RACI"
  | "ata"
  | "TEP"
  | "licoes_aprendidas"
  | "plano_riscos"
  | "registro_riscos"
  | "outro";

export interface Profile {
  id: string;
  organizacao_id: string;
  nome: string;
  email: string;
  role: Role;
  avatar_url?: string;
  created_at: string;
}

export interface Projeto {
  id: string;
  organizacao_id: string;
  codigo: string;
  nome: string;
  cliente_id: string;
  tipo_obra: string;
  descricao?: string;
  status: StatusProjeto;
  data_inicio?: string;
  data_fim_prevista?: string;
  data_fim_real?: string;
  orcamento_total?: number;
  cidade?: string;
  estado?: string;
  gerente_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  organizacao_id: string;
  nome: string;
  cnpj?: string;
  setor?: string;
  email?: string;
  telefone?: string;
  created_at: string;
}

export interface Contratada {
  id: string;
  organizacao_id: string;
  nome: string;
  cnpj?: string;
  tipo: "construtora" | "projetista" | "fornecedor" | "consultoria" | "outro";
  email?: string;
  telefone?: string;
  created_at: string;
}
