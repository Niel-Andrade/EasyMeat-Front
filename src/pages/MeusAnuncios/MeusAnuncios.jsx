// ==========================================================
// EASY MEAT — Meus Anúncios
// ==========================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as usuarioService from '../../services/usuarioService.js';
import * as anuncioService from '../../services/anuncioService.js';
import { STATUS_ANUNCIO, CATEGORIAS } from '../../utils/constants.js';
import { formatarMoeda } from '../../utils/formatters.js';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Button from '../../components/Button/Button.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import './MeusAnuncios.css';

export default function MeusAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [modalExcluir, setModalExcluir] = useState(null);
  const [destacando, setDestacando] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const dados = await usuarioService.listarMeusAnuncios();
      const lista = Array.isArray(dados) ? dados : (dados.items || dados.anuncios || []);
      setAnuncios(lista);
    } catch (e) {
      setErro(e.message || 'Erro ao carregar seus anúncios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const confirmarExcluir = async () => {
    if (!modalExcluir) return;
    setExcluindo(modalExcluir);
    try {
      await anuncioService.excluirAnuncio(modalExcluir);
      setModalExcluir(null);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setExcluindo(null);
    }
  };

  const handleDestacar = async (id) => {
    setDestacando(id);
    try {
      await anuncioService.ativarDestaque(id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setDestacando(null);
    }
  };

  return (
    <main className="meus-anuncios-page">
      <div className="container">
        <header className="meus-anuncios-page__cabecalho">
          <div>
            <h1>Meus anúncios</h1>
            <p>Gerencie todos os produtos que você publicou.</p>
          </div>
          <Link to="/novo-anuncio" className="btn btn--primary btn--md">
            + Novo anúncio
          </Link>
        </header>

        {loading ? (
          <Loading texto="Carregando seus anúncios..." />
        ) : erro ? (
          <ErrorState mensagem={erro} onRetry={carregar} />
        ) : anuncios.length === 0 ? (
          <EmptyState
            icone="📦"
            titulo="Você ainda não tem anúncios"
            mensagem="Crie seu primeiro anúncio e comece a receber contatos de compradores."
            acao={
              <Link to="/novo-anuncio" className="btn btn--primary btn--md">
                Criar meu primeiro anúncio
              </Link>
            }
          />
        ) : (
          <div className="meus-anuncios-page__lista">
            {anuncios.map((a) => {
              const categoriaLabel = CATEGORIAS.find(c => c.value === a.categoria)?.label || a.categoria;
              const statusInfo = STATUS_ANUNCIO[a.status] || STATUS_ANUNCIO.ATIVO;
              return (
                <article key={a.id} className="meu-anuncio-item">
                  <div className="meu-anuncio-item__imagem">
                    {a.imagem || (a.imagens && a.imagens[0]) ? (
                      <img src={a.imagem || a.imagens[0]} alt={a.titulo} />
                    ) : (
                      <span aria-hidden="true">🥩</span>
                    )}
                  </div>

                  <div className="meu-anuncio-item__info">
                    <div className="meu-anuncio-item__cabecalho">
                      <span className={`meu-anuncio-item__status meu-anuncio-item__status--${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {a.destaque && <span className="meu-anuncio-item__destaque">⭐ Destaque</span>}
                    </div>

                    <h3 className="meu-anuncio-item__titulo">{a.titulo}</h3>
                    <span className="meu-anuncio-item__categoria">{categoriaLabel}</span>

                    <div className="meu-anuncio-item__detalhes">
                      <span><strong>Preço:</strong> {formatarMoeda(a.preco)}</span>
                      <span><strong>Qtd:</strong> {a.quantidade || '-'}</span>
                      <span><strong>Local:</strong> {a.cidade}{a.estado && `, ${a.estado}`}</span>
                      {a.visualizacoes != null && <span><strong>👁:</strong> {a.visualizacoes}</span>}
                    </div>
                  </div>

                  <div className="meu-anuncio-item__acoes">
                    {!a.destaque && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDestacar(a.id)}
                        loading={destacando === a.id}
                      >
                        ⭐ Destacar
                      </Button>
                    )}
                    <Link to={`/editar-anuncio/${a.id}`} className="btn btn--secondary btn--sm">
                      Editar
                    </Link>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => setModalExcluir(a.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* ============ MODAL EXCLUSÃO ============ */}
      <Modal
        aberto={Boolean(modalExcluir)}
        onFechar={() => setModalExcluir(null)}
        titulo="Excluir anúncio?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalExcluir(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarExcluir} loading={excluindo}>
              Sim, excluir
            </Button>
          </>
        }
      >
        <p>Esta ação não pode ser desfeita. O anúncio será removido permanentemente.</p>
      </Modal>
    </main>
  );
}
