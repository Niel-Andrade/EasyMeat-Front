// ==========================================================
// EASY MEAT — Admin Anúncios
// ==========================================================

import { useState, useEffect } from 'react';
import { apiGet, apiDelete, apiPut } from '../../services/api.js';
import { CATEGORIAS, STATUS_ANUNCIO } from '../../utils/constants.js';
import { formatarMoeda, formatarData } from '../../utils/formatters.js';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Button from '../../components/Button/Button.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import './../Admin/Admin.css';
import './../AdminUsuarios/AdminTabelas.css';

export default function AdminAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [modalRemover, setModalRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);
  const [destacando, setDestacando] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const resposta = await apiGet('/admin/anuncios');
      const lista = resposta.data?.items || resposta.data?.anuncios || resposta.data || [];
      setAnuncios(lista);
    } catch (e) {
      setErro(e.message || 'Erro ao carregar anúncios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const confirmarRemover = async () => {
    if (!modalRemover) return;
    setRemovendo(true);
    try {
      await apiDelete(`/admin/anuncios/${modalRemover.id}`);
      setModalRemover(null);
      carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setRemovendo(false);
    }
  };

  const toggleDestaque = async (anuncio) => {
    setDestacando(anuncio.id);
    try {
      await apiPut(`/anuncios/${anuncio.id}/destaque`, { destaque: !anuncio.destaque });
      carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setDestacando(null);
    }
  };

  const filtrados = anuncios.filter((a) => {
    if (!filtro) return true;
    const b = filtro.toLowerCase();
    return (
      a.titulo?.toLowerCase().includes(b) ||
      a.vendedor?.nome?.toLowerCase().includes(b) ||
      a.categoria?.toLowerCase().includes(b)
    );
  });

  return (
    <main className="admin-page">
      <div className="container">
        <header className="admin-page__cabecalho">
          <div>
            <h1>Anúncios</h1>
            <p>Gerenciar todos os anúncios da plataforma.</p>
          </div>
          <input
            type="search"
            placeholder="🔎 Buscar por título, vendedor ou categoria..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="admin-tabela__busca"
          />
        </header>

        {loading ? (
          <Loading texto="Carregando anúncios..." />
        ) : erro ? (
          <ErrorState mensagem={erro} onRetry={carregar} />
        ) : filtrados.length === 0 ? (
          <EmptyState
            icone="📦"
            titulo="Nenhum anúncio encontrado"
            mensagem={filtro ? 'Tente ajustar a busca.' : 'A plataforma ainda não tem anúncios publicados.'}
          />
        ) : (
          <div className="admin-tabela__wrapper">
            <table className="admin-tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Vendedor</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Publicação</th>
                  <th>Destaque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((a) => {
                  const cat = CATEGORIAS.find((c) => c.value === a.categoria)?.label || a.categoria;
                  return (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.titulo}</strong>
                        <br />
                        <small style={{ color: 'var(--color-text-muted)' }}>
                          #{a.id} · {a.cidade}{a.estado && `, ${a.estado}`}
                        </small>
                      </td>
                      <td>{a.vendedor?.nome || '-'}</td>
                      <td>{cat}</td>
                      <td><strong>{formatarMoeda(a.preco)}</strong></td>
                      <td>
                        <span className={`admin-tabela__tag admin-tabela__tag--${(STATUS_ANUNCIO[a.status]?.color) || 'info'}`}>
                          {STATUS_ANUNCIO[a.status]?.label || a.status || 'ATIVO'}
                        </span>
                      </td>
                      <td>{formatarData(a.criadoEm)}</td>
                      <td>
                        <Button
                          size="sm"
                          variant={a.destaque ? 'success' : 'ghost'}
                          onClick={() => toggleDestaque(a)}
                          loading={destacando === a.id}
                        >
                          {a.destaque ? '⭐ Ativo' : 'Destacar'}
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" variant="danger" onClick={() => setModalRemover(a)}>
                          Remover
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        aberto={Boolean(modalRemover)}
        onFechar={() => setModalRemover(null)}
        titulo="Remover anúncio?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalRemover(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmarRemover} loading={removendo}>Sim, remover</Button>
          </>
        }
      >
        <p>
          O anúncio <strong>{modalRemover?.titulo}</strong> será removido permanentemente.
        </p>
      </Modal>
    </main>
  );
}
