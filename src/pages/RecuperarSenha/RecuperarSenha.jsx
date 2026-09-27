// ==========================================================
// EASY MEAT — Recuperação de senha (solicitar)
// ==========================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../../services/authService.js';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import './../Login/Login.css';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    setLoading(true);
    try {
      await authService.solicitarRecuperacaoSenha(email.trim());
      setMensagem(
        'Se o e-mail estiver cadastrado, você receberá as instruções de recuperação em instantes.'
      );
    } catch (err) {
      setErro(err.message || 'Erro ao solicitar recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__cabecalho">
          <Link to="/" className="auth-page__logo">
            <span aria-hidden="true">🐂</span>
            <span>Easy<strong>Meat</strong></span>
          </Link>
          <h1 className="auth-page__titulo">Recuperar senha</h1>
          <p className="auth-page__subtitulo">
            Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
          </p>
        </div>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          {erro && <div className="auth-page__erro-geral" role="alert">{erro}</div>}
          {mensagem && (
            <div
              className="auth-page__erro-geral"
              style={{
                backgroundColor: 'var(--color-success-light)',
                color: 'var(--color-success)',
                borderColor: 'var(--color-success)',
              }}
              role="status"
            >
              {mensagem}
            </div>
          )}

          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            obrigatorio
            autoComplete="email"
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Enviar instruções
          </Button>
        </form>

        <div className="auth-page__rodape">
          Lembrou da senha?{' '}
          <Link to="/login" className="auth-page__link">Entrar</Link>
        </div>
      </div>
    </main>
  );
}
