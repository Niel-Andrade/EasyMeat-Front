// ==========================================================
// EASY MEAT — Constantes globais
// ==========================================================

// Categorias de carne disponíveis na plataforma
export const CATEGORIAS = [
  { value: 'BOVINA', label: 'Bovina' },
  { value: 'SUINA', label: 'Suína' },
  { value: 'FRANGO', label: 'Frango' },
  { value: 'OUTROS', label: 'Outros' },
];

// Tipos de usuário
export const TIPOS_USUARIO = [
  { value: 'COMPRADOR', label: 'Comprador' },
  { value: 'VENDEDOR', label: 'Vendedor' },
];

// Status de anúncio
export const STATUS_ANUNCIO = {
  ATIVO: { value: 'ATIVO', label: 'Ativo', color: 'success' },
  PAUSADO: { value: 'PAUSADO', label: 'Pausado', color: 'warning' },
  VENDIDO: { value: 'VENDIDO', label: 'Vendido', color: 'info' },
  EXCLUIDO: { value: 'EXCLUIDO', label: 'Excluído', color: 'error' },
};

// Estados brasileiros
export const ESTADOS_BR = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

// Opções de ordenação da lista de anúncios
export const ORDENACOES_ANUNCIO = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'destaque', label: 'Em destaque' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
];

// Planos disponíveis (simulados no MVP)
export const PLANOS = [
  {
    id: 'free',
    nome: 'Gratuito',
    preco: 0,
    descricao: 'Para começar a anunciar',
    beneficios: [
      'Cadastro de até 5 anúncios',
      'Visualização padrão das listagens',
      'Acesso ao painel de gerenciamento',
      'Contato com compradores',
    ],
    destaque: false,
  },
  {
    id: 'basico',
    nome: 'Destaque Básico',
    preco: 29.9,
    descricao: 'Mais visibilidade para seus produtos',
    beneficios: [
      'Anúncios ilimitados',
      'Prioridade em buscas por categoria',
      'Selo de "Destaque" nos anúncios',
      'Estatísticas de visualização',
    ],
    destaque: true,
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 49.9,
    descricao: 'Máxima exposição na plataforma',
    beneficios: [
      'Tudo do plano Básico',
      'Topo da lista em todas as buscas',
      'Selo "Premium" dourado',
      'Suporte prioritário',
      'Destaque na página inicial',
    ],
    destaque: false,
    premium: true,
  },
];

// Mensagens de erro padrão da API
export const MENSAGENS_ERRO = {
  GENERICO: 'Ocorreu um erro inesperado. Tente novamente.',
  SEM_CONEXAO: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  NAO_AUTORIZADO: 'Você precisa estar logado para acessar esta página.',
  SEM_PERMISSAO: 'Você não tem permissão para realizar esta ação.',
  CAMPOS_OBRIGATORIOS: 'Preencha todos os campos obrigatórios.',
  EMAIL_INVALIDO: 'E-mail inválido.',
  SENHA_FRACA: 'A senha deve ter no mínimo 6 caracteres.',
  SENHAS_DIFERENTES: 'As senhas não coincidem.',
};

// Tamanho máximo de arquivos de imagem (5MB)
export const MAX_IMAGEM_MB = 5;
export const MAX_IMAGEM_BYTES = MAX_IMAGEM_MB * 1024 * 1024;

// Paginação padrão
export const ITENS_POR_PAGINA = 12;
