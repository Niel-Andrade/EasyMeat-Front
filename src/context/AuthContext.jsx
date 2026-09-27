// ==========================================================
// EASY MEAT — Auth Context
// ==========================================================
// Estado global de autenticação. Disponibiliza:
//   - usuario: dados do usuário logado (ou null)
//   - carregando: estado de verificação da sessão
//   - login(email, senha): faz login na API
//   - register(dados): cadastra e retorna resposta
//   - logout(): desloga
//   - atualizarUsuario(novosDados): atualiza o estado local sem nova requisição
// ==========================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  usuarioAtual,
} from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true); // inicia true para verificar sessão

  // ============ Verifica sessão ao carregar ============
  useEffect(() => {
    let cancelado = false;

    async function verificarSessao() {
      try {
        const usuarioLogado = await usuarioAtual();
        if (!cancelado) {
          setUsuario(usuarioLogado);
        }
      } catch (erro) {
        if (!cancelado) setUsuario(null);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    verificarSessao();

    return () => {
      cancelado = true;
    };
  }, []);

  // ============ Helpers ============

  /**
   * Faz login. Sucesso: define usuário + retorna true.
   * Falha: throw com mensagem do servidor.
   */
  const login = useCallback(async (email, senha) => {
    const resposta = await loginService(email, senha);
    const usuarioRecebido =
      resposta?.usuario || resposta?.user || resposta;
    setUsuario(usuarioRecebido);
    return usuarioRecebido;
  }, []);

  /**
   * Cadastra novo usuário. Após cadastro bem-sucedido, autentica.
   */
  const register = useCallback(async (dados) => {
    // Backend pode fazer login automático após cadastro.
    // Caso não faça, o front faz login em seguida.
    const resposta = await registerService(dados);
    const usuarioRecebido =
      resposta?.usuario || resposta?.user || resposta;
    setUsuario(usuarioRecebido);
    return usuarioRecebido;
  }, []);

  /**
   * Faz logout (limpa cookie no servidor e estado local).
   */
  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      setUsuario(null);
    }
  }, []);

  /**
   * Atualiza os dados do usuário no estado global sem nova requisição.
   * Útil após update do perfil ou foto.
   */
  const atualizarUsuario = useCallback((novosDados) => {
    setUsuario((atual) => ({ ...(atual || {}), ...novosDados }));
  }, []);

  /**
   * Conveniência: verifica se usuário está autenticado.
   */
  const estaAutenticado = Boolean(usuario);

  /**
   * Conveniência: verifica tipo de usuário.
   */
  const isAdmin = usuario?.tipoUsuario === 'ADMIN';
  const isVendedor = usuario?.tipoUsuario === 'VENDEDOR';

  const value = {
    usuario,
    carregando,
    login,
    register,
    logout,
    atualizarUsuario,
    estaAutenticado,
    isAdmin,
    isVendedor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para consumir o contexto
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>.');
  }
  return contexto;
}
