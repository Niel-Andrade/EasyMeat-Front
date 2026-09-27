// ==========================================================
// EASY MEAT — Camada central de comunicação com a API
// ==========================================================
// Esta é a ÚNICA camada que faz fetch. Componentes e páginas
// nunca devem usar fetch diretamente.
// ==========================================================

// URL base da API. Trocar aqui para apontar para produção.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
// const API_URL = "https://api.easymeat.com"; // produção

/**
 * Função central para fazer requisições à API.
 * Gerencia automaticamente:
 *   - URL base
 *   - Cookie de sessão (credentials: "include")
 *   - JSON como Content-Type padrão
 *   - parsing da resposta
 *   - tratamento de erros HTTP
 *
 * @param {string} endpoint - caminho (ex: "/auth/login")
 * @param {object} options - opções do fetch (method, body, headers...)
 * @returns {Promise<{ok: boolean, status: number, data: any}>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  // Preparação de headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Não definir Content-Type para FormData (upload de arquivos)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    credentials: 'include', // envia e recebe cookie httpOnly
    ...options,
    headers,
  };

  // Body precisa ser serializado apenas se for objeto
  if (
    config.body &&
    typeof config.body === 'object' &&
    !(config.body instanceof FormData)
  ) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else if (response.status !== 204) {
      data = await response.text().catch(() => null);
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (erro) {
    // Erro de rede (sem conexão com o servidor)
    console.error('[apiFetch] Erro de rede:', erro);
    return {
      ok: false,
      status: 0,
      data: {
        message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      },
    };
  }
}

// Helpers para各 métodos
export const apiGet = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'GET' });

export const apiPost = (endpoint, body, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'POST', body });

export const apiPut = (endpoint, body, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'PUT', body });

export const apiPatch = (endpoint, body, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'PATCH', body });

export const apiDelete = (endpoint, options = {}) =>
  apiFetch(endpoint, { ...options, method: 'DELETE' });

export { API_URL };
