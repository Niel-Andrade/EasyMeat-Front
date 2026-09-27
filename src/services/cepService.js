// ==========================================================
// EASY MEAT — Serviço de consulta de CEP (ViaCEP)
// ==========================================================

const VIACEP_URL = 'https://viacep.com.br/ws';

/**
 * Consulta um CEP na API ViaCEP.
 * Retorna { cep, logradouro, bairro, localidade, uf, erro? }
 * @param {string} cep - CEP com ou sem máscara (8 dígitos)
 * @returns {Promise<{cidade: string, estado: string, valido: boolean, mensagem?: string}>}
 */
export async function consultarCEP(cep) {
  const digits = String(cep || '').replace(/\D/g, '');
  if (digits.length !== 8) {
    return { valido: false, mensagem: 'CEP deve conter 8 dígitos.' };
  }

  try {
    const response = await fetch(`${VIACEP_URL}/${digits}/json/`);
    const data = await response.json();
    if (data?.erro) {
      return { valido: false, mensagem: 'CEP não encontrado.' };
    }
    return {
      valido: true,
      cidade: data.localidade || '',
      estado: data.uf || '',
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
    };
  } catch (erro) {
    return {
      valido: false,
      mensagem: 'Não foi possível consultar o CEP. Verifique sua conexão.',
    };
  }
}
