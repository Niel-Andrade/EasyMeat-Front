// ==========================================================
// EASY MEAT — Serviço de usuários
// ==========================================================

import { apiGet, apiPut, apiPost } from './api.js';

/**
 * Busca dados do perfil do usuário autenticado.
 */
export async function buscarPerfil() {
  const response = await apiGet('/usuarios/perfil');
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao carregar perfil.');
  }
  return response.data;
}

/**
 * Atualiza dados do perfil.
 */
export async function atualizarPerfil(dados) {
  const response = await apiPut('/usuarios/perfil', dados);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao atualizar perfil.');
  }
  return response.data;
}

/**
 * Altera a senha do usuário autenticado.
 */
export async function alterarSenha(senhaAtual, novaSenha) {
  const response = await apiPut('/usuarios/perfil/senha', {
    senhaAtual,
    novaSenha,
  });
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao alterar senha.');
  }
  return response.data;
}

/**
 * Upload de foto de perfil via FormData.
 */
export async function uploadFotoPerfil(file) {
  const formData = new FormData();
  formData.append('foto', file);

  const response = await apiPost('/usuarios/perfil/foto', formData);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao enviar foto.');
  }
  return response.data;
}

/**
 * Lista os anúncios do usuário autenticado.
 */
export async function listarMeusAnuncios() {
  const response = await apiGet('/usuarios/anuncios');
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao listar seus anúncios.');
  }
  return response.data;
}
