// ==========================================================
// EASY MEAT — Validadores
// Funções puras. Sem dependência de React.
// ==========================================================

/**
 * Verifica se o email é válido.
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

/**
 * Verifica se a senha tem no mínimo 6 caracteres.
 */
export const isValidPassword = (senha) => {
  return typeof senha === 'string' && senha.length >= 6;
};

/**
 * Verifica se duas senhas coincidem.
 */
export const passwordsMatch = (senha, confirmacao) => {
  return senha === confirmacao && senha.length > 0;
};

/**
 * Verifica se é um telefone válido (10 ou 11 dígitos).
 */
export const isValidPhone = (telefone) => {
  if (!telefone) return false;
  const digits = telefone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
};

/**
 * Verifica se um campo string não está vazio.
 */
export const isNotEmpty = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Valida um objeto de dados de cadastro de usuário.
 * Retorna { valido: boolean, erros: { campo: mensagem } }.
 */
export const validarCadastro = (dados) => {
  const erros = {};

  if (!isNotEmpty(dados.nome)) {
    erros.nome = 'Nome completo é obrigatório.';
  }
  if (!isValidEmail(dados.email)) {
    erros.email = 'E-mail inválido.';
  }
  if (!isValidPassword(dados.senha)) {
    erros.senha = 'A senha deve ter no mínimo 6 caracteres.';
  }
  if (!passwordsMatch(dados.senha, dados.confirmarSenha)) {
    erros.confirmarSenha = 'As senhas não coincidem.';
  }
  if (!isValidPhone(dados.telefone)) {
    erros.telefone = 'Telefone inválido.';
  }
  if (!isNotEmpty(dados.cidade)) {
    erros.cidade = 'Cidade é obrigatória.';
  }
  if (!isNotEmpty(dados.estado)) {
    erros.estado = 'Estado é obrigatório.';
  }
  if (!['COMPRADOR', 'VENDEDOR'].includes(dados.tipoUsuario)) {
    erros.tipoUsuario = 'Selecione o tipo de usuário.';
  }

  // CPF obrigatório apenas para VENDEDOR
  if (dados.tipoUsuario === 'VENDEDOR') {
    if (!isNotEmpty(dados.cpf)) {
      erros.cpf = 'CPF é obrigatório para vendedores.';
    } else if (!isValidCPF(dados.cpf)) {
      erros.cpf = 'CPF inválido.';
    }
  }

  // CEP, se preenchido, deve ter formato válido
  if (dados.cep && !isValidCEP(dados.cep)) {
    erros.cep = 'CEP inválido.';
  }

  return {
    valido: Object.keys(erros).length === 0,
    erros,
  };
};

/**
 * Valida os dados de um anúncio.
 */
export const validarAnuncio = (dados) => {
  const erros = {};

  if (!isNotEmpty(dados.titulo)) erros.titulo = 'Título é obrigatório.';
  if (!isNotEmpty(dados.descricao)) erros.descricao = 'Descrição é obrigatória.';
  if (!isNotEmpty(dados.categoria)) erros.categoria = 'Categoria é obrigatória.';
  if (!isNotEmpty(dados.tipoCarne)) erros.tipoCarne = 'Tipo de carne é obrigatório.';
  if (!dados.quantidade || Number(dados.quantidade) <= 0) {
    erros.quantidade = 'Quantidade deve ser maior que zero.';
  }
  if (!dados.preco || Number(dados.preco) <= 0) {
    erros.preco = 'Preço deve ser maior que zero.';
  }
  if (!isNotEmpty(dados.cidade)) erros.cidade = 'Cidade é obrigatória.';
  if (!isNotEmpty(dados.estado)) erros.estado = 'Estado é obrigatório.';

  return {
    valido: Object.keys(erros).length === 0,
    erros,
  };
};

/**
 * Valida dados de alteração de senha.
 */
export const validarAlteracaoSenha = (dados) => {
  const erros = {};
  if (!isValidPassword(dados.senhaAtual)) {
    erros.senhaAtual = 'Senha atual obrigatória.';
  }
  if (!isValidPassword(dados.novaSenha)) {
    erros.novaSenha = 'A nova senha deve ter no mínimo 6 caracteres.';
  }
  if (!passwordsMatch(dados.novaSenha, dados.confirmarNovaSenha)) {
    erros.confirmarNovaSenha = 'As senhas não coincidem.';
  }
  return {
    valido: Object.keys(erros).length === 0,
    erros,
  };
};

/**
 * Valida um CPF brasileiro (formato + dígitos verificadores).
 * Aceita com ou sem pontuação.
 */
export const isValidCPF = (cpfRaw) => {
  if (!cpfRaw || typeof cpfRaw !== 'string') return false;
  const cpf = cpfRaw.replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  // Rejeita sequências repetidas (000.000.000-00, etc.)
  if (/^(\d)\1+$/.test(cpf)) return false;
  const calcularDigito = (slice) => {
    let soma = 0;
    for (let i = 0; i < slice.length; i++) {
      soma += Number(slice[i]) * (slice.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = calcularDigito(cpf.slice(0, 9));
  const d2 = calcularDigito(cpf.slice(0, 10));
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
};

/**
 * Verifica se um CEP tem formato válido (8 dígitos numéricos, com ou sem hífen).
 */
export const isValidCEP = (cep) => {
  if (!cep || typeof cep !== 'string') return false;
  const digits = cep.replace(/\D/g, '');
  return digits.length === 8;
};

/**
 * Formata um CPF para 000.000.000-00.
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
 * Formata um CEP para 00000-000.
 */
export const formatarCEP = (cep) => {
  if (!cep) return '';
  const d = String(cep).replace(/\D/g, '').slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, '$1-$2');
};

/**
 * Valida um arquivo de imagem quanto ao tipo e tamanho.
 */
export const validarImagem = (file, maxBytes = 5 * 1024 * 1024) => {
  if (!file) return { valido: false, erro: 'Nenhum arquivo selecionado.' };
  if (!file.type.startsWith('image/')) {
    return { valido: false, erro: 'O arquivo deve ser uma imagem.' };
  }
  if (file.size > maxBytes) {
    const mb = (maxBytes / 1024 / 1024).toFixed(0);
    return { valido: false, erro: `A imagem deve ter no máximo ${mb}MB.` };
  }
  return { valido: true };
};
