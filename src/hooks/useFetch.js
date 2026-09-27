// ==========================================================
// EASY MEAT — Hook para requisições
// ==========================================================
// Encapsula fetch com estados loading/error/data + refetch.
// ==========================================================

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para executar uma função assíncrona ao montar (ou quando deps mudar).
 *
 * @param {function} fetchFn - função que recebe params e retorna Promise
 * @param {array} deps - dependências para reexecutar
 * @returns {object} { data, loading, error, refetch }
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const executar = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await fetchFn(...args);
      setData(resultado);
      return resultado;
    } catch (erro) {
      setError(erro.message || 'Erro ao carregar dados.');
      setData(null);
      throw erro;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    executar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    loading,
    error,
    refetch: executar,
  };
}
