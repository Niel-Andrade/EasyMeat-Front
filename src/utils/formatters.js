// ==========================================================
// EASY MEAT — Formatadores
// Funções puras para exibição de dados.
// ==========================================================

/**
 * Formata um número para moeda brasileira (R$).
 */
export const formatarMoeda = (valor) => {
  const numero = Number(valor) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numero);
};

/**
 * Formata uma data ISO para o formato brasileiro.
 */
export const formatarData = (dataISO) => {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleDateString('pt-BR');
};

/**
 * Formata uma data com hora.
 */
export const formatarDataHora = (dataISO) => {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Data relativa (ex.: "há 2 dias").
 */
export const dataRelativa = (dataISO) => {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  const agora = new Date();
  const diffMs = agora - data;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias === 0) return 'Hoje';
  if (diffDias === 1) return 'Ontem';
  if (diffDias < 7) return `Há ${diffDias} dias`;
  if (diffDias < 30) return `Há ${Math.floor(diffDias / 7)} semanas`;
  if (diffDias < 365) return `Há ${Math.floor(diffDias / 30)} meses`;
  return `Há ${Math.floor(diffDias / 365)} anos`;
};

/**
 * Formata telefone para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.
 */
export const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  const digits = telefone.replace(/\D/g, '');
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
};

/**
 * Formata CPF para 000.000.000-00.
 */
export const formatarCPF = (cpf) => {
  if (!cpf) return '';
  const d = String(cpf).replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

/**
 * Formata CEP para 00000-000.
 */
export const formatarCEP = (cep) => {
  if (!cep) return '';
  const d = String(cep).replace(/\D/g, '').slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, '$1-$2');
};

/**
 * Trunca um texto em N caracteres adicionando "...".
 */
export const truncar = (texto, max = 100) => {
  if (!texto) return '';
  if (texto.length <= max) return texto;
  return texto.substring(0, max).trim() + '...';
};

/**
 * Pluralização simples.
 */
export const pluralizar = (quantidade, singular, plural) => {
  return quantidade === 1 ? singular : plural;
};

/**
 * Converte arquivo para Base64 (para preview ou upload).
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
