// ==========================================================
// EASY MEAT — Alterar Senha
// ==========================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as usuarioService from '../../services/usuarioService.js';
import { validarAlteracaoSenha } from '../../utils/validators.js';
import Input from '../../components/Input/Input.jsx';
import Button from '../../components/Button/Button.jsx';
import './../Login/Login.css';

export default function AlterarSenha() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErros({ ...erros, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSucesso(false);
    const validacao = validarAlteracaoSenha(form);
    setErros(validacao.erros || {});
    if (!validacao.valido) return;

    setLoading(true);
    try {
      await usuarioService.alterarSenha(form.senhaAtual, form.novaSenha);
      setSucesso(true);
      setForm({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
    } catch (err) {
      setErros({ _form: err.message || 'Erro ao alterar senha.' });
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
          <h1 className="auth-page__titulo">Alterar senha</h1>
          <p className="auth-page__subtitulo">Defina uma nova senha para sua conta.</p>
        </div>

        {sucesso && (
          <div
            className="auth-page__erro-geral"
            style={{
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              borderColor: 'var(--color-success)',
              marginBottom: 'var(--space-4)',
            }}
            role="status"
          >
            ✅ Senha alterada com sucesso!
          </div>
        )}

        {erros._form && (
          <div className="auth-page__erro-geral" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
            {erros._form}
          </div>
        )}

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          <Input
            label="Senha atual"
            type="password"
            name="senhaAtual"
            value={form.senhaAtual}
            onChange={handleChange}
            erro={erros.senhaAtual}
            placeholder="Sua senha atual"
            obrigatorio
            autoComplete="current-password"
          />
          <Input
            label="Nova senha"
            type="password"
            name="novaSenha"
            value={form.novaSenha}
            onChange={handleChange}
            erro={erros.novaSenha}
            placeholder="Mínimo 6 caracteres"
            obrigatorio
            autoComplete="new-password"
            dica="A nova senha deve ter ao menos 6 caracteres."
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            name="confirmarNovaSenha"
            value={form.confirmarNovaSenha}
            onChange={handleChange}
            erro={erros.confirmarNovaSenha}
            placeholder="Repita a nova senha"
            obrigatorio
            autoComplete="new-password"
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Alterar senha
          </Button>
        </form>

        <div className="auth-page__rodape">
          <Link to="/perfil" className="auth-page__link">
            ← Voltar ao perfil
          </Link>
        </div>
      </div>
    </main>
  );
}
