export type Role          = 'admin' | 'gerente' | 'analista' | 'visualizador';
export type StatusProjeto = 'planejamento' | 'execucao' | 'monitoramento' | 'encerrado' | 'suspenso';
export type Semaforo      = 'verde' | 'amarelo' | 'vermelho';
export type TipoObra      = 'industrial' | 'infraestrutura' | 'energia' | 'edificacao' | 'saneamento' | 'outro';
export type Setor = 'industria' | 'infraestrutura' | 'energia' | 'mineracao' | 'agronegocio' | 'saneamento' | 'outro';
export type TipoContratada = 'construtora' | 'projetista' | 'fornecedor' | 'consultoria' | 'outro';

export interface Profile {
  id: string;
  organizacao_id: string;
  nome: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  organizacao_id: string;
  nome: string;
  cnpj: string | null;
  setor: Setor | null;
  contato_nome: string | null;
  contato_email: string | null;
  contato_telefone: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Projeto {
  id:                   string;
  organizacao_id:       string;
  cliente_id:           string | null;
  nome:                 string;
  codigo:               string | null;
  descricao:            string | null;
  tipo_obra:            TipoObra | null;
  status:               StatusProjeto;
  semaforo:             Semaforo;
  data_inicio:          string | null;
  data_fim_prevista:    string | null;
  data_fim_real:        string | null;
  valor_contrato:       number | null;
  percentual_concluido: number;
  created_at:           string;
  updated_at:           string;
  cliente?:             { nome: string } | null;
}

export type NivelEngajamento = 'desconhecido' | 'resistente' | 'neutro' | 'apoiador' | 'lider';

export interface ParteInteressada {
  id:                   string;
  projeto_id:           string;
  nome:                 string;
  organizacao:          string | null;
  papel:                string | null;
  contato:              string | null;
  influencia:           number;
  interesse:            number;
  engajamento_atual:    NivelEngajamento;
  engajamento_desejado: NivelEngajamento;
  estrategia:           string | null;
  created_at:           string;
  updated_at:           string;
}

export type TipoComunicacao      = 'reuniao' | 'relatorio' | 'email' | 'apresentacao' | 'outro';
export type FrequenciaComunicacao = 'diaria' | 'semanal' | 'quinzenal' | 'mensal' | 'bimestral' | 'trimestral' | 'sob_demanda';
export type MeioComunicacao      = 'email' | 'reuniao_presencial' | 'videoconferencia' | 'whatsapp' | 'sistema' | 'outro';

export interface Comunicacao {
  id:            string;
  projeto_id:    string;
  assunto:       string;
  tipo:          TipoComunicacao;
  destinatarios: string;
  responsavel:   string | null;
  frequencia:    FrequenciaComunicacao;
  meio:          MeioComunicacao;
  observacao:    string | null;
  created_at:    string;
  updated_at:    string;
}

export type CategoriaRisco  = 'tecnico' | 'externo' | 'organizacional' | 'cronograma' | 'custo' | 'outro';
export type StatusRisco     = 'identificado' | 'monitorando' | 'mitigado' | 'ocorrido' | 'encerrado';

export interface Risco {
  id:             string;
  projeto_id:     string;
  descricao:      string;
  categoria:      CategoriaRisco;
  probabilidade:  number;
  impacto:        number;
  status:         StatusRisco;
  plano_resposta: string | null;
  responsavel:    string | null;
  created_at:     string;
  updated_at:     string;
}

export type CategoriaOrcamento = 'material' | 'mao_de_obra' | 'equipamento' | 'servico' | 'outro';

export interface OrcamentoItem {
  id:              string;
  projeto_id:      string;
  categoria:       CategoriaOrcamento;
  descricao:       string;
  valor_planejado: number;
  valor_realizado: number;
  data_referencia: string | null;
  observacao:      string | null;
  ordem:           number;
  created_at:      string;
  updated_at:      string;
}

export type StatusMarco = 'pendente' | 'concluido' | 'cancelado';

export interface Marco {
  id:            string;
  projeto_id:    string;
  nome:          string;
  descricao:     string | null;
  responsavel:   string | null;
  data_prevista: string;
  data_real:     string | null;
  status:        StatusMarco;
  ordem:         number;
  created_at:    string;
  updated_at:    string;
}

export interface Escopo {
  id:               string;
  projeto_id:       string;
  declaracao:       string | null;
  exclusoes:        string | null;
  premissas:        string | null;
  restricoes:       string | null;
  criterios_aceite: string | null;
  created_at:       string;
  updated_at:       string;
}

export interface EapItem {
  id:          string;
  projeto_id:  string;
  parent_id:   string | null;
  codigo:      string;
  nome:        string;
  descricao:   string | null;
  responsavel: string | null;
  nivel:       number;
  ordem:       number;
  created_at:  string;
  updated_at:  string;
  children?:   EapItem[];
}

export type StatusMudanca = 'rascunho' | 'em_analise' | 'aprovada' | 'rejeitada' | 'implementada';

export interface Mudanca {
  id:               string;
  projeto_id:       string;
  numero:           string;
  titulo:           string;
  descricao:        string | null;
  solicitante:      string | null;
  data_solicitacao: string;
  status:           StatusMudanca;
  impacto_prazo:    number | null;
  impacto_custo:    number | null;
  impacto_escopo:   string | null;
  justificativa:    string | null;
  aprovado_por:     string | null;
  data_aprovacao:   string | null;
  created_at:       string;
  updated_at:       string;
}

export type StatusAquisicao = 'planejado' | 'ativo' | 'suspenso' | 'encerrado';

export interface AquisicaoMedicao {
  id:           string;
  aquisicao_id: string;
  competencia:  string;
  valor:        number;
  descricao:    string | null;
  created_at:   string;
}

export interface Aquisicao {
  id:                string;
  projeto_id:        string;
  contratada_id:     string | null;
  objeto:            string;
  numero_contrato:   string | null;
  valor_contrato:    number;
  data_inicio:       string | null;
  data_fim_prevista: string | null;
  data_fim_real:     string | null;
  status:            StatusAquisicao;
  avaliacao:         number | null;
  observacao:        string | null;
  created_at:        string;
  updated_at:        string;
  contratada?:       { id: string; nome: string; tipo: string } | null;
  medicoes?:         AquisicaoMedicao[];
}

export interface Ata {
  id:               string;
  projeto_id:       string;
  titulo:           string;
  data_reuniao:     string;
  local_reuniao:    string | null;
  participantes:    string | null;
  pauta:            string | null;
  decisoes:         string | null;
  encaminhamentos:  string | null;
  observacoes:      string | null;
  created_at:       string;
  updated_at:       string;
}

// M09 Qualidade
export type CategoriaRNC = 'tecnica' | 'seguranca' | 'documental' | 'ambiental' | 'outro';
export type StatusRNC    = 'aberta' | 'em_tratamento' | 'fechada' | 'cancelada';

export interface RNC {
  id:               string;
  projeto_id:       string;
  numero:           string;
  titulo:           string;
  descricao:        string | null;
  categoria:        CategoriaRNC;
  status:           StatusRNC;
  responsavel:      string | null;
  data_abertura:    string;
  data_fechamento:  string | null;
  acao_corretiva:   string | null;
  created_at:       string;
  updated_at:       string;
}

// M10 Recursos
export type TipoRecurso = 'interno' | 'externo' | 'contratado';

export interface Recurso {
  id:          string;
  projeto_id:  string;
  nome:        string;
  papel:       string | null;
  tipo:        TipoRecurso;
  dedicacao:   number | null;
  data_inicio: string | null;
  data_fim:    string | null;
  observacao:  string | null;
  created_at:  string;
  updated_at:  string;
}

// M17 Encerramento
export interface Encerramento {
  id:                string;
  projeto_id:        string;
  data_encerramento: string | null;
  aceite_formal:     boolean;
  aceito_por:        string | null;
  licoes_aprendidas: string | null;
  pontos_positivos:  string | null;
  pontos_melhoria:   string | null;
  pendencias:        string | null;
  observacoes:       string | null;
  created_at:        string;
  updated_at:        string;
}

export interface Contratada {
  id: string;
  organizacao_id: string;
  nome: string;
  cnpj: string | null;
  tipo: TipoContratada;
  contato_nome: string | null;
  contato_email: string | null;
  contato_telefone: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// M06 Cronograma — Atividades
export type StatusAtividade = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';

export interface Atividade {
  id:                   string;
  projeto_id:           string;
  eap_item_id:          string | null;
  nome:                 string;
  descricao:            string | null;
  responsavel:          string | null;
  data_inicio_prevista: string | null;
  data_fim_prevista:    string;
  data_inicio_real:     string | null;
  data_fim_real:        string | null;
  status:               StatusAtividade;
  percentual_concluido: number;
  ordem:                number;
  created_at:           string;
  updated_at:           string;
}
