// ==========================================================
// EASY MEAT — Admin Banners
// ==========================================================

import { useState, useEffect, useRef } from 'react';
import * as bannerService from '../../services/bannerService.js';
import { validarImagem } from '../../utils/validators.js';
import { formatarData } from '../../utils/formatters.js';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Button from '../../components/Button/Button.jsx';
import Input from '../../components/Input/Input.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import BannerCard from '../../components/BannerCard/BannerCard.jsx';
import './../Admin/Admin.css';
import './../AdminUsuarios/AdminTabelas.css';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [modalRemover, setModalRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);
  const [erroForm, setErroForm] = useState({});
  const inputImagemRef = useRef(null);

  const [form, setForm] = useState({
    titulo: '',
    link: '',
    ativo: true,
  });
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const resposta = await bannerService.listarTodosBanners();
      const lista = Array.isArray(resposta) ? resposta : (resposta?.items || resposta?.banners || []);
      setBanners(lista);
    } catch (e) {
      setErro(e.message || 'Erro ao carregar banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirModalCriar = () => {
    setForm({ titulo: '', link: '', ativo: true });
    setArquivoImagem(null);
    setPreviewImagem(null);
    setErroForm({});
    setModalAberto(true);
  };

  const handleImagem = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const v = validarImagem(file);
    if (!v.valido) {
      setErroForm({ _form: v.erro });
      return;
    }
    setArquivoImagem(file);
    setPreviewImagem(URL.createObjectURL(file));
    setErroForm({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroForm({});
    if (!arquivoImagem) {
      setErroForm({ _form: 'Selecione uma imagem para o banner.' });
      return;
    }
    if (!form.titulo.trim()) {
      setErroForm({ titulo: 'Título é obrigatório.' });
      return;
    }

    setSalvando(true);
    try {
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      if (form.link) formData.append('link', form.link);
      formData.append('ativo', String(form.ativo));
      formData.append('imagem', arquivoImagem);

      await bannerService.criarBanner(formData);
      setModalAberto(false);
      if (previewImagem) URL.revokeObjectURL(previewImagem);
      carregar();
    } catch (err) {
      setErroForm({ _form: err.message });
    } finally {
      setSalvando(false);
    }
  };

  const confirmarRemover = async () => {
    if (!modalRemover) return;
    setRemovendo(true);
    try {
      await bannerService.removerBanner(modalRemover.id);
      setModalRemover(null);
      carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setRemovendo(false);
    }
  };

  const toggleAtivo = async (banner) => {
    try {
      const fd = new FormData();
      fd.append('ativo', String(!banner.ativo));
      await bannerService.atualizarBanner(banner.id, fd);
      carregar();
    } catch (e) {
      setErro(e.message);
    }
  };

  return (
    <main className="admin-page">
      <div className="container">
        <header className="admin-page__cabecalho">
          <div>
            <h1>Banners</h1>
            <p>Gerenciar banners publicitários da plataforma.</p>
          </div>
          <Button variant="primary" onClick={abrirModalCriar}>
            + Novo banner
          </Button>
        </header>

        {loading ? (
          <Loading texto="Carregando banners..." />
        ) : erro ? (
          <ErrorState mensagem={erro} onRetry={carregar} />
        ) : banners.length === 0 ? (
          <EmptyState
            icone="📢"
            titulo="Nenhum banner cadastrado"
            mensagem="Crie o primeiro banner para exibição na página inicial."
            acao={<Button variant="primary" onClick={abrirModalCriar}>Criar primeiro banner</Button>}
          />
        ) : (
          <div className="admin-tabela__wrapper">
            <table className="admin-tabela">
              <thead>
                <tr>
                  <th>Banner</th>
                  <th>Título</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th>Criado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ width: '120px', height: '50px' }}>
                        <BannerCard banner={b} />
                      </div>
                    </td>
                    <td><strong>{b.titulo}</strong></td>
                    <td>
                      {b.link ? (
                        <a href={b.link} target="_blank" rel="noopener noreferrer" className="admin-tabela__link">
                          {b.link.length > 40 ? b.link.substring(0, 40) + '...' : b.link}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <span className={`admin-tabela__tag admin-tabela__tag--${b.ativo ? 'ativo' : 'bloqueado'}`}>
                        {b.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>{formatarData(b.criadoEm)}</td>
                    <td>
                      <Button size="sm" variant={b.ativo ? 'ghost' : 'success'} onClick={() => toggleAtivo(b)}>
                        {b.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setModalRemover(b)}>
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============ MODAL CRIAR ============ */}
      <Modal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        titulo="Novo banner"
        tamanho="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit} loading={salvando}>
              Criar banner
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {erroForm._form && (
            <div className="auth-page__erro-geral" role="alert">{erroForm._form}</div>
          )}

          <Input
            label="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            erro={erroForm.titulo}
            obrigatorio
            placeholder="Ex.: Fornecedor Agro"
          />

          <Input
            label="Link (opcional)"
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="https://..."
            dica="URL para onde o banner leva ao ser clicado."
          />

          <div>
            <label className="admin-page__label-banner">Imagem *</label>
            {previewImagem && (
              <div className="admin-banner-preview">
                <img src={previewImagem} alt="Preview" />
              </div>
            )}
            <input
              ref={inputImagemRef}
              type="file"
              accept="image/*"
              onChange={handleImagem}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn btn--ghost btn--md"
              onClick={() => inputImagemRef.current?.click()}
              style={{ marginTop: 'var(--space-2)' }}
            >
              {previewImagem ? '🔄 Trocar imagem' : '📷 Selecionar imagem'}
            </button>
          </div>

          <label className="admin-page__checkbox-banner">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />
            <span>Banner ativo na plataforma</span>
          </label>
        </form>
      </Modal>

      {/* ============ MODAL REMOVER ============ */}
      <Modal
        aberto={Boolean(modalRemover)}
        onFechar={() => setModalRemover(null)}
        titulo="Remover banner?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalRemover(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmarRemover} loading={removendo}>
              Sim, remover
            </Button>
          </>
        }
      >
        <p>
          O banner <strong>{modalRemover?.titulo}</strong> será removido permanentemente.
        </p>
      </Modal>

      <style>{`
        .admin-page__label-banner {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--space-1);
        }
        .admin-banner-preview {
          width: 100%;
          aspect-ratio: 3 / 1;
          background-color: var(--color-surface-alt);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: var(--space-2);
        }
        .admin-banner-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .admin-page__checkbox-banner {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
        }
        .admin-tabela__link {
          color: var(--color-primary);
          text-decoration: underline;
          font-size: var(--font-size-xs);
        }
      `}</style>
    </main>
  );
}
