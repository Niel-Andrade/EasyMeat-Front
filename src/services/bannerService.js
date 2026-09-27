// ==========================================================
// EASY MEAT — Serviço de banners publicitários
// ==========================================================

import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

/**
 * Lista apenas banners ativos (público).
 */
export async function listarBannersAtivos() {
  const response = await apiGet('/banners');
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao carregar banners.');
  }
  return response.data;
}

/**
 * Lista todos os banners (admin).
 */
export async function listarTodosBanners() {
  const response = await apiGet('/admin/banners');
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao carregar banners.');
  }
  return response.data;
}

/**
 * Cria novo banner (admin). Aceita FormData.
 */
export async function criarBanner(dadosOuFormData) {
  const response = await apiPost('/admin/banners', dadosOuFormData);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao criar banner.');
  }
  return response.data;
}

/**
 * Atualiza banner (admin).
 */
export async function atualizarBanner(id, dadosOuFormData) {
  const response = await apiPut(`/admin/banners/${id}`, dadosOuFormData);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao atualizar banner.');
  }
  return response.data;
}

/**
 * Remove banner (admin).
 */
export async function removerBanner(id) {
  const response = await apiDelete(`/admin/banners/${id}`);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao remover banner.');
  }
  return response.data;
}
