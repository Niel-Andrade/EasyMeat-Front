// ==========================================================
// EASY MEAT — Hook para formulários
// ==========================================================
// Centraliza estado, validação e submissão de formulários.
// ==========================================================

import { useState, useCallback } from 'react';

/**
 * Hook genérico para formulários.
 *
 * @param {object} initialValues - valores iniciais dos campos
 * @param {function} validatorFn - função que recebe valores e retorna { valido, erros }
 * @returns {object} API do hook
 */
export function useForm(initialValues = {}, validatorFn = null) {
  const [valores, setValores] = useState(initialValues);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);

  /**
   * Atualiza um campo do formulário.
   */
  const setCampo = useCallback((nome, valor) => {
    setValores((atual) => ({ ...atual, [nome]: valor }));
    // Limpa erro do campo quando usuário digitar
    setErros((atual) => {
      if (!atual[nome]) return atual;
      const novo = { ...atual };
      delete novo[nome];
      return novo;
    });
  }, []);

  /**
   * Handler genérico para inputs de formulário (onChange).
   * Recebe o SyntheticEvent do React e atualiza o campo correspondente.
   */
  const handleChange = useCallback((evento) => {
    if (!evento || !evento.target) return;
    const { name, value, type, checked, files } = evento.target;
    if (type === 'checkbox') {
      setCampo(name, checked);
    } else if (type === 'file') {
      setCampo(name, files);
    } else {
      setCampo(name, value);
    }
  }, [setCampo]);

  /**
   * Reseta o formulário.
   */
  const reset = useCallback((novosValores = initialValues) => {
    setValores(novosValores);
    setErros({});
    setEnviando(false);
  }, [initialValues]);

  /**
   * Valida o formulário. Retorna true se válido.
   */
  const validar = useCallback(() => {
    if (!validatorFn) {
      return true;
    }
    const resultado = validatorFn(valores);
    setErros(resultado.erros || {});
    return resultado.valido;
  }, [validatorFn, valores]);

  /**
   * Submete o formulário após validar.
   * @param {function} onSubmit - função async que recebe valores válidos
   */
  const submeter = useCallback(async (onSubmit) => {
    const valido = validar();
    if (!valido) {
      return false;
    }
    setEnviando(true);
    try {
      await onSubmit(valores);
      return true;
    } catch (erro) {
      // Erro da API: backend pode retornar erros por campo
      const resposta = erro?.response?.data || erro?.data;
      if (resposta?.erros && typeof resposta.erros === 'object') {
        setErros(resposta.erros);
      } else if (resposta?.message) {
        setErros({ _form: resposta.message });
      } else {
        setErros({ _form: erro.message || 'Erro ao processar solicitação.' });
      }
      return false;
    } finally {
      setEnviando(false);
    }
  }, [validar, valores]);

  return {
    valores,
    erros,
    enviando,
    setCampo,
    handleChange,
    reset,
    validar,
    submeter,
    setValores,
    setErros,
  };
}
