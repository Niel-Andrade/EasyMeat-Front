// ==========================================================
// EASY MEAT — Redefinição de senha (com token)
// ==========================================================

import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as authService from '../../services/authService.js';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import { isValidPassword, passwordsMatch } from '../../utils/validators.js';
import './../Login/Login.css';

export default function RedefinirSenha() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ novaSenha: '', confirmar: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);

    if (!isValidPassword(form.novaSenha)) {
      setErro('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!passwordsMatch(form.novaSenha, form.confirmar)) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (!token) {
      setErro('Token de recuperação ausente ou inválido.');
      return;
    }

    setLoading(true);
    try {
      await authService.redefinirSenha(token, form.novaSenha);
      setSucesso(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setErro(err.message || 'Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <main className="auth-page">
        <div className="auth-page__container text-center">
          <div style={{ fontSize: '3.5rem' }} aria-hidden="true">✅</div>
          <h1 className="auth-page__titulo">Senha redefinida!</h1>
          <p className="auth-page__subtitulo">
            Sua senha foi alterada com sucesso. Você será redirecionado para o login.
          </p>
          <Link to="/login" className="auth-page__link">Ir para login agora</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__cabecalho">
          <Link to="/" className="auth-page__logo">
            <span aria-hidden="true">🐂</span>
            <span>Easy<strong>Meat</strong></span>
          </Link>
          <h1 className="auth-page__titulo">Redefinir senha</h1>
          <p className="auth-page__subtitulo">
            Defina uma nova senha para sua conta.
          </p>
        </div>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          {erro && <div className="auth-page__erro-geral" role="alert">{erro}</div>}

          <Input
            label="Nova senha"
            type="password"
            name="novaSenha"
            value={form.novaSenha}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            obrigatorio
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            name="confirmar"
            value={form.confirmar}
            onChange={handleChange}
            placeholder="Repita a nova senha"
            obrigatorio
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Redefinir senha
          </Button>
        </form>
      </div>
    </main>
  );
}
