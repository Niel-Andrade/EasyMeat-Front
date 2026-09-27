// ==========================================================
// EASY MEAT — Login
// ==========================================================
// Modificação 4.1 — Logo minimalista
// ==========================================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [form, setForm] = useState({ email: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const [erroGeral, setErroGeral] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroGeral(null);
    setLoading(true);
    try {
      const usuario = await login(form.email.trim(), form.senha);
      if (from) {
        navigate(from, { replace: true });
      } else if (usuario?.tipoUsuario === 'VENDEDOR') {
        navigate('/dashboard', { replace: true });
      } else if (usuario?.tipoUsuario === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/anuncios', { replace: true });
      }
    } catch (erro) {
      setErroGeral(erro.message || 'Não foi possível entrar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__cabecalho">
          {/* 4.1 — Logo minimalista */}
          <Link to="/" className="auth-page__logo">
            <Logo size="md" />
          </Link>
          <h1 className="auth-page__titulo">Bem-vindo de volta!</h1>
          <p className="auth-page__subtitulo">
            Entre com sua conta para acessar a plataforma.
          </p>
        </div>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          {erroGeral && (
            <div className="auth-page__erro-geral" role="alert">
              {erroGeral}
            </div>
          )}

          <Input
            label="E-mail"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            obrigatorio
            autoComplete="email"
          />

          <Input
            label="Senha"
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Sua senha"
            obrigatorio
            autoComplete="current-password"
          />

          <div className="auth-page__opcoes">
            <Link to="/recuperar-senha" className="auth-page__link">
              Esqueci minha senha
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Entrar
          </Button>
        </form>

        <div className="auth-page__rodape">
          Não tem conta ainda?{' '}
          <Link to="/cadastro" className="auth-page__link">
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}
