// ==========================================================
// EASY MEAT — Cadastro
// ==========================================================
// Modificações aplicadas:
//  - 3.1 Logo minimalista
//  - 3.2 CPF primeiro no formulário de vendedor (validação completa)
//  - 3.3 Campo CEP com preenchimento automático (ViaCEP)
//  - 3.6 "Confirmar senha" em largura igual aos demais campos
// ==========================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useForm } from '../../hooks/useForm.js';
import { validarCadastro } from '../../utils/validators.js';
import { formatarCPF, formatarCEP } from '../../utils/formatters.js';
import { consultarCEP } from '../../services/cepService.js';
import { ESTADOS_BR } from '../../utils/constants.js';
import Input from '../../components/Input/Input.jsx';
import Select from '../../components/Select/Select.jsx';
import Button from '../../components/Button/Button.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import './Cadastro.css';

export default function Cadastro() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const { valores, erros, enviando, setCampo, submeter } = useForm(
    {
      nome: '',
      cpf: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      telefone: '',
      cep: '',
      cidade: '',
      estado: '',
      tipoUsuario: 'COMPRADOR',
    },
    validarCadastro
  );

  const [erroGeral, setErroGeral] = useState(null);
  const [mensagemCep, setMensagemCep] = useState(null);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const handleChange = (campo, valor) => {
    setCampo(campo, valor);
    // limpa erro do campo e mensagens auxiliares
    if (erros[campo]) setCampo(campo, valor);
  };

  // 3.3 — Busca automática ao sair do campo CEP
  const handleCepBlur = async () => {
    const digits = String(valores.cep || '').replace(/\D/g, '');
    if (digits.length !== 8) return;
    setBuscandoCep(true);
    setMensagemCep(null);
    const res = await consultarCEP(valores.cep);
    setBuscandoCep(false);
    if (res.valido) {
      setCampo('cidade', res.cidade);
      setCampo('estado', res.estado);
      setMensagemCep({ tipo: 'sucesso', texto: 'CEP encontrado.' });
    } else {
      setMensagemCep({ tipo: 'erro', texto: res.mensagem || 'CEP inválido.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroGeral(null);

    const ehVendedor = valores.tipoUsuario === 'VENDEDOR';

    const sucesso = await submeter(async (dados) => {
      const { confirmarSenha, ...rest } = dados;
      // Normaliza CPF e CEP antes de enviar
      if (rest.cpf) rest.cpf = String(rest.cpf).replace(/\D/g, '');
      if (rest.cep) rest.cep = String(rest.cep).replace(/\D/g, '');
      if (!ehVendedor) delete rest.cpf;
      const usuario = await register(rest);
      if (usuario?.tipoUsuario === 'VENDEDOR') {
        navigate('/dashboard', { replace: true });
      } else if (usuario?.tipoUsuario === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/anuncios', { replace: true });
      }
    });

    if (!sucesso) {
      const erro = erros._form;
      if (erro) setErroGeral(erro);
    }
  };

  const ehVendedor = valores.tipoUsuario === 'VENDEDOR';

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__cabecalho">
          {/* 3.1 — Logo minimalista */}
          <Link to="/" className="auth-page__logo">
            <Logo size="md" />
          </Link>
          <h1 className="auth-page__titulo">Criar sua conta</h1>
          <p className="auth-page__subtitulo">
            Cadastro gratuito em menos de 1 minuto.
          </p>
        </div>

        {/* Escolha inicial */}
        <div className="auth-page__selecao-tipo">
          <button
            type="button"
            className={`auth-page__tipo ${valores.tipoUsuario === 'COMPRADOR' ? 'auth-page__tipo--active' : ''}`}
            onClick={() => setCampo('tipoUsuario', 'COMPRADOR')}
          >
            <span className="auth-page__tipo-icone" aria-hidden="true">🔍</span>
            <strong>Quero comprar</strong>
            <small>Pesquisar e contatar fornecedores</small>
          </button>
          <button
            type="button"
            className={`auth-page__tipo ${valores.tipoUsuario === 'VENDEDOR' ? 'auth-page__tipo--active' : ''}`}
            onClick={() => setCampo('tipoUsuario', 'VENDEDOR')}
          >
            <span className="auth-page__tipo-icone" aria-hidden="true">📦</span>
            <strong>Quero vender</strong>
            <small>Anunciar e vender meus produtos</small>
          </button>
        </div>

        <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
          {erroGeral && (
            <div className="auth-page__erro-geral" role="alert">
              {erroGeral}
            </div>
          )}

          <Input
            label="Nome completo"
            name="nome"
            value={valores.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            erro={erros.nome}
            placeholder="Ex.: João Silva"
            obrigatorio
            autoComplete="name"
          />

          {/* 3.2 — CPF primeiro quando é vendedor */}
          {ehVendedor && (
            <Input
              label="CPF *"
              name="cpf"
              value={valores.cpf}
              onChange={(e) => handleChange('cpf', formatarCPF(e.target.value))}
              erro={erros.cpf}
              placeholder="000.000.000-00"
              obrigatorio
              maxLength={14}
              autoComplete="off"
              dica="Obrigatório para identificação do vendedor."
            />
          )}

          <Input
            label="E-mail"
            type="email"
            name="email"
            value={valores.email}
            onChange={(e) => handleChange('email', e.target.value)}
            erro={erros.email}
            placeholder="seu@email.com"
            obrigatorio
            autoComplete="email"
          />

          <Input
            label="Telefone"
            type="tel"
            name="telefone"
            value={valores.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            erro={erros.telefone}
            placeholder="(11) 99999-9999"
            obrigatorio
            autoComplete="tel"
          />

          {/* 3.6 — Senhas em larguras iguais, em linha própria */}
          <div className="auth-page__grid-2">
            <Input
              label="Senha"
              type="password"
              name="senha"
              value={valores.senha}
              onChange={(e) => handleChange('senha', e.target.value)}
              erro={erros.senha}
              placeholder="Mínimo 6 caracteres"
              obrigatorio
              autoComplete="new-password"
            />
            <Input
              label="Confirmar senha"
              type="password"
              name="confirmarSenha"
              value={valores.confirmarSenha}
              onChange={(e) => handleChange('confirmarSenha', e.target.value)}
              erro={erros.confirmarSenha}
              placeholder="Repita a senha"
              obrigatorio
              autoComplete="new-password"
            />
          </div>

          {/* 3.3 — CEP com preenchimento automático */}
          <div className="auth-page__cep">
            <Input
              label="CEP"
              name="cep"
              value={valores.cep}
              onChange={(e) => handleChange('cep', formatarCEP(e.target.value))}
              onBlur={handleCepBlur}
              erro={erros.cep}
              placeholder="00000-000"
              maxLength={9}
              autoComplete="postal-code"
              dica={buscandoCep ? 'Buscando CEP...' : mensagemCep?.texto || 'Preencha para auto-completar cidade e estado.'}
            />
          </div>

          <div className="auth-page__grid-2">
            <Input
              label="Cidade"
              name="cidade"
              value={valores.cidade}
              onChange={(e) => handleChange('cidade', e.target.value)}
              erro={erros.cidade}
              placeholder="Sua cidade"
              obrigatorio
              autoComplete="address-level2"
            />
            <Select
              label="Estado"
              name="estado"
              value={valores.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              erro={erros.estado}
              opcoes={ESTADOS_BR}
              obrigatorio
            />
          </div>

          <Button type="submit" variant="primary" fullWidth loading={enviando}>
            Criar conta
          </Button>
        </form>

        <div className="auth-page__rodape">
          Já tem conta?{' '}
          <Link to="/login" className="auth-page__link">
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}
