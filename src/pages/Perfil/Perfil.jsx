// ==========================================================
// EASY MEAT — Perfil (ver e editar)
// ==========================================================
// Modificação 5.3 — Solicitar senha antes de salvar dados do perfil.
// O back-end valida a senha; se incorreta, nada é alterado.
// ==========================================================

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import * as usuarioService from '../../services/usuarioService.js';
import { ESTADOS_BR } from '../../utils/constants.js';
import { formatarTelefone, fileToBase64 } from '../../utils/formatters.js';
import { validarImagem, isValidEmail, isValidPhone, isNotEmpty } from '../../utils/validators.js';
import Input from '../../components/Input/Input.jsx';
import Select from '../../components/Select/Select.jsx';
import Button from '../../components/Button/Button.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import './Perfil.css';

export default function Perfil() {
  const { usuario, atualizarUsuario, logout } = useAuth();
  const [form, setForm] = useState(null);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputFotoRef = useRef(null);
  const [modalFotoAberto, setModalFotoAberto] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);

  // 5.3 — modal de confirmação de senha
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [erroSenha, setErroSenha] = useState(null);
  const [dadosPendentes, setDadosPendentes] = useState(null);

  useEffect(() => {
    if (usuario) {
      setForm({
        nome: usuario.nome || '',
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        cidade: usuario.cidade || '',
        estado: usuario.estado || '',
      });
    }
  }, [usuario]);

  if (!form) return null;

  // Detecta se houve alteração nos dados do formulário
  const dadosAlterados = usuario && (
    form.nome !== usuario.nome ||
    form.email !== usuario.email ||
    form.telefone !== usuario.telefone ||
    form.cidade !== usuario.cidade ||
    form.estado !== usuario.estado
  );

  const validar = () => {
    const novos = {};
    if (!isNotEmpty(form.nome)) novos.nome = 'Nome obrigatório.';
    if (!isValidEmail(form.email)) novos.email = 'E-mail inválido.';
    if (!isValidPhone(form.telefone)) novos.telefone = 'Telefone inválido.';
    if (!isNotEmpty(form.cidade)) novos.cidade = 'Cidade obrigatória.';
    if (!isNotEmpty(form.estado)) novos.estado = 'Estado obrigatório.';
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErros((e) => {
      if (!e[name]) return e;
      const novo = { ...e };
      delete novo[name];
      return novo;
    });
  };

  // 5.3 — em vez de salvar direto, pede confirmação de senha
  const handleSalvar = (e) => {
    e.preventDefault();
    setMensagem(null);
    if (!validar()) return;
    if (!dadosAlterados) {
      setMensagem({ tipo: 'info', texto: 'Nenhuma alteração a salvar.' });
      return;
    }
    // Abre modal pedindo senha atual
    setSenhaConfirmacao('');
    setErroSenha(null);
    setDadosPendentes({ ...form });
    setModalSenhaAberto(true);
  };

  // 5.3 — confirma senha e chama API
  const confirmarSalvarComSenha = async () => {
    if (!senhaConfirmacao) {
      setErroSenha('Informe sua senha atual.');
      return;
    }
    setSalvando(true);
    setErroSenha(null);
    try {
      const atualizado = await usuarioService.atualizarPerfil({
        ...dadosPendentes,
        senhaAtual: senhaConfirmacao,
      });
      atualizarUsuario(atualizado);
      setModalSenhaAberto(false);
      setMensagem({ tipo: 'sucesso', texto: 'Perfil atualizado com sucesso!' });
      setDadosPendentes(null);
    } catch (err) {
      setErroSenha(err.message || 'Não foi possível confirmar a senha.');
    } finally {
      setSalvando(false);
    }
  };

  const handleSelecionarFoto = () => inputFotoRef.current?.click();

  const handleArquivoFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validacao = validarImagem(file);
    if (!validacao.valido) {
      setMensagem({ tipo: 'erro', texto: validacao.erro });
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setPreviewFoto(base64);
      setModalFotoAberto(true);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao processar imagem.' });
    }
  };

  const confirmarUploadFoto = async () => {
    if (!previewFoto) return;
    setUploading(true);
    try {
      const res = await fetch(previewFoto);
      const blob = await res.blob();
      const file = new File([blob], 'foto.jpg', { type: blob.type });
      const resposta = await usuarioService.uploadFotoPerfil(file);
      const urlFoto = resposta?.foto || resposta?.url || previewFoto;
      atualizarUsuario({ foto: urlFoto });
      setMensagem({ tipo: 'sucesso', texto: 'Foto atualizada com sucesso!' });
      setModalFotoAberto(false);
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message || 'Erro ao enviar foto.' });
    } finally {
      setUploading(false);
      if (inputFotoRef.current) inputFotoRef.current.value = '';
    }
  };

  return (
    <main className="perfil-page">
      <div className="container">
        <header className="perfil-page__cabecalho">
          <h1>Meu perfil</h1>
          <p>Gerencie suas informações pessoais.</p>
        </header>

        {mensagem && (
          <div
            className={`perfil-page__mensagem perfil-page__mensagem--${mensagem.tipo}`}
            role="alert"
          >
            {mensagem.texto}
          </div>
        )}

        <div className="perfil-page__layout">
          {/* ============ CARD DE PERFIL ============ */}
          <aside className="perfil-page__card">
            <div className="perfil-page__avatar-grande">
              {usuario?.foto ? (
                <img src={usuario.foto} alt={usuario.nome} />
              ) : (
                <span>{usuario?.nome?.charAt(0)?.toUpperCase() || '👤'}</span>
              )}
            </div>
            <h2>{usuario?.nome}</h2>
            <span className="perfil-page__email">{usuario?.email}</span>

            <span className="perfil-page__tipo">
              {usuario?.tipoUsuario === 'ADMIN' && 'Administrador'}
              {usuario?.tipoUsuario === 'VENDEDOR' && 'Vendedor'}
              {usuario?.tipoUsuario === 'COMPRADOR' && 'Comprador'}
            </span>

            <button
              className="btn btn--ghost btn--md btn--full"
              onClick={handleSelecionarFoto}
              disabled={uploading}
            >
              {uploading ? 'Enviando...' : '📷 Alterar foto'}
            </button>
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              onChange={handleArquivoFoto}
              style={{ display: 'none' }}
            />

            <div className="perfil-page__acoes">
              <Link to="/perfil/senha" className="btn btn--secondary btn--md btn--full">
                🔑 Alterar senha
              </Link>
              <button onClick={logout} className="btn btn--danger btn--md btn--full">
                🚪 Sair
              </button>
            </div>
          </aside>

          {/* ============ FORMULÁRIO ============ */}
          <section className="perfil-page__formulario">
            <form onSubmit={handleSalvar} className="perfil-page__form-conteudo">
              <h2>Informações pessoais</h2>

              <Input
                label="Nome completo"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                erro={erros.nome}
                obrigatorio
              />

              <Input
                label="E-mail"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                erro={erros.email}
                obrigatorio
              />

              <Input
                label="Telefone"
                type="tel"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                erro={erros.telefone}
                obrigatorio
                dica={form.telefone && formatarTelefone(form.telefone)}
              />

              <div className="perfil-page__grid-2">
                <Input
                  label="Cidade"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  erro={erros.cidade}
                  obrigatorio
                />
                <Select
                  label="Estado"
                  name="estado"
                  opcoes={ESTADOS_BR}
                  value={form.estado}
                  onChange={handleChange}
                  erro={erros.estado}
                  obrigatorio
                />
              </div>

              <div className="perfil-page__form-acoes">
                <Button type="submit" variant="primary" loading={salvando}>
                  Salvar alterações
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* ============ MODAL CONFIRMAÇÃO FOTO ============ */}
      <Modal
        aberto={modalFotoAberto}
        onFechar={() => setModalFotoAberto(false)}
        titulo="Confirmar nova foto"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalFotoAberto(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={confirmarUploadFoto} loading={uploading}>
              Confirmar upload
            </Button>
          </>
        }
      >
        <div className="perfil-page__preview-wrapper">
          {previewFoto && <img src={previewFoto} alt="Preview" className="perfil-page__preview-img" />}
          <p>Tem certeza que deseja usar esta imagem como foto de perfil?</p>
        </div>
      </Modal>

      {/* ============ 5.3 MODAL CONFIRMAÇÃO DE SENHA ============ */}
      <Modal
        aberto={modalSenhaAberto}
        onFechar={() => !salvando && setModalSenhaAberto(false)}
        titulo="Confirme sua identidade"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalSenhaAberto(false)} disabled={salvando}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={confirmarSalvarComSenha} loading={salvando}>
              Confirmar e salvar
            </Button>
          </>
        }
      >
        <div className="perfil-page__senha-modal">
          <Logo size="sm" />
          <p>
            Para alterar seus dados, confirme sua senha atual. Isso protege
            sua conta caso outra pessoa esteja usando este dispositivo.
          </p>
          <Input
            label="Senha atual"
            type="password"
            value={senhaConfirmacao}
            onChange={(e) => {
              setSenhaConfirmacao(e.target.value);
              setErroSenha(null);
            }}
            erro={erroSenha}
            placeholder="Digite sua senha"
            obrigatorio
            autoComplete="current-password"
          />
        </div>
      </Modal>
    </main>
  );
}
