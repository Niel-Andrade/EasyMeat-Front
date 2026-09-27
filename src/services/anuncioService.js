// ==========================================================
// EASY MEAT — Serviço de anúncios
// ==========================================================

import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

/**
 * Lista anúncios com filtros opcionais.
 * @param {object} filtros - { categoria, cidade, estado, precoMin, precoMax, ordenacao, pagina, limite, busca }
 */
export async function listarAnuncios(filtros = {}) {
  // Monta query string a partir dos filtros (exclui vazios).
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') {
      params.append(chave, valor);
    }
  });
  const query = params.toString();
  const endpoint = query ? `/anuncios?${query}` : '/anuncios';

  const response = await apiGet(endpoint);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao listar anúncios.');
  }
  return response.data;
}

/**
 * Lista anúncios em destaque (premium).
 */
export async function listarDestaques(limite = 6) {
  const response = await apiGet(`/anuncios/destaques?limite=${limite}`);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao listar destaques.');
  }
  return response.data;
}

/**
 * Busca um anúncio específico por ID.
 */
export async function buscarAnuncio(id) {
  const response = await apiGet(`/anuncios/${id}`);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Anúncio não encontrado.');
  }
  return response.data;
}

/**
 * Cria um novo anúncio. Aceita FormData para permitir upload de imagens.
 */
export async function criarAnuncio(dadosOuFormData) {
  const isFormData = dadosOuFormData instanceof FormData;
  const response = await apiPost('/anuncios', dadosOuFormData);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao criar anúncio.');
  }
  return response.data;
}

/**
 * Atualiza um anúncio existente.
 */
export async function atualizarAnuncio(id, dadosOuFormData) {
  const response = await apiPut(`/anuncios/${id}`, dadosOuFormData);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao atualizar anúncio.');
  }
  return response.data;
}

/**
 * Exclui um anúncio.
 */
export async function excluirAnuncio(id) {
  const response = await apiDelete(`/anuncios/${id}`);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao excluir anúncio.');
  }
  return response.data;
}

/**
 * Ativa o destaque/premium de um anúncio.
 */
export async function ativarDestaque(id) {
  const response = await apiPut(`/anuncios/${id}/destaque`, {});
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao ativar destaque.');
  }
  return response.data;
}
