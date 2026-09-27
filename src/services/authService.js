// ==========================================================
// EASY MEAT — Serviço de autenticação
// ==========================================================
// Funções puras que retornam Promises. Não conhecem React.
// ==========================================================

import { apiPost, apiGet } from './api.js';

/**
 * Realiza login. Espera-se resposta { success, usuario, message? }.
 */
export async function login(email, senha) {
  const response = await apiPost('/auth/login', { email, senha });
  if (!response.ok) {
    throw new Error(response.data?.message || 'Credenciais inválidas.');
  }
  return response.data;
}

/**
 * Cadastra novo usuário.
 */
export async function register(dados) {
  const response = await apiPost('/auth/register', dados);
  if (!response.ok) {
    throw new Error(response.data?.message || 'Não foi possível concluir o cadastro.');
  }
  return response.data;
}

/**
 * Realiza logout (limpa cookie no servidor).
 */
export async function logout() {
  const response = await apiPost('/auth/logout', {});
  // Mesmo se o servidor retornar erro, o front ainda limpa o estado local.
  return response.ok;
}

/**
 * Retorna dados do usuário autenticado (sessão atual).
 * Caso não esteja autenticado, retorna null (sem throw).
 */
export async function usuarioAtual() {
  try {
    const response = await apiGet('/auth/me');
    if (!response.ok) {
      return null;
    }
    return response.data?.usuario || response.data || null;
  } catch (erro) {
    return null;
  }
}

/**
 * Solicita recuperação de senha (envia e-mail com token).
 */
export async function solicitarRecuperacaoSenha(email) {
  const response = await apiPost('/auth/recuperar-senha', { email });
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao solicitar recuperação.');
  }
  return response.data;
}

/**
 * Redefine a senha usando token recebido por e-mail.
 */
export async function redefinirSenha(token, novaSenha) {
  const response = await apiPost('/auth/redefinir-senha', { token, novaSenha });
  if (!response.ok) {
    throw new Error(response.data?.message || 'Erro ao redefinir senha.');
  }
  return response.data;
}
