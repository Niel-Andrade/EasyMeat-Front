// ==========================================================
// EASY MEAT — Detalhes do Anúncio
// ==========================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as anuncioService from '../../services/anuncioService.js';
import { formatarMoeda, formatarData, formatarTelefone, dataRelativa } from '../../utils/formatters.js';
import { CATEGORIAS } from '../../utils/constants.js';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Button from '../../components/Button/Button.jsx';
import './DetalhesAnuncio.css';

export default function DetalhesAnuncio() {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setImagemAtiva(0);
    async function carregar() {
      setLoading(true);
      setErro(null);
      try {
        const dados = await anuncioService.buscarAnuncio(id);
        if (!cancelado) setAnuncio(dados);
      } catch (e) {
        if (!cancelado) setErro(e.message || 'Erro ao carregar anúncio.');
      } finally {
        if (!cancelado) setLoading(false);
      }
    }
    carregar();
    return () => { cancelado = true; };
  }, [id]);

  if (loading) {
    return (
      <main className="detalhes-page">
        <div className="container">
          <Loading texto="Carregando detalhes do produto..." />
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="detalhes-page">
        <div className="container">
          <ErrorState titulo="Anúncio não encontrado" mensagem={erro} onRetry={() => window.location.reload()} />
        </div>
      </main>
    );
  }

  if (!anuncio) {
    return (
      <main className="detalhes-page">
        <div className="container">
          <EmptyState
            titulo="Anúncio indisponível"
            mensagem="Este produto pode ter sido removido pelo vendedor."
            acao={<Link to="/anuncios" className="btn btn--ghost btn--md">Ver outros produtos</Link>}
          />
        </div>
      </main>
    );
  }

  const {
    titulo, descricao, categoria, preco, quantidade, imagens, imagem,
    cidade, estado, destaque, status, criadoEm, visualizacoes, vendedor,
  } = anuncio;

  const listaImagens = imagens?.length ? imagens : (imagem ? [imagem] : []);
  const categoriaLabel = CATEGORIAS.find((c) => c.value === categoria)?.label || categoria;
  const imagemExibida = listaImagens[imagemAtiva];

  return (
    <main className="detalhes-page">
      <div className="container detalhes-page__container">
        <Link to="/anuncios" className="detalhes-page__voltar">
          ← Voltar para produtos
        </Link>

        <div className="detalhes-page__layout">
          {/* ============ GALERIA ============ */}
          <div className="detalhes-page__galeria">
            <div className="detalhes-page__imagem-principal">
              {imagemExibida ? (
                <img src={imagemExibida} alt={titulo} />
              ) : (
                <div className="detalhes-page__sem-imagem">
                  <span aria-hidden="true">🥩</span>
                  <span>Sem imagem disponível</span>
                </div>
              )}
              {destaque && (
                <span className="detalhes-page__selo-premium">⭐ Destaque Premium</span>
              )}
            </div>

            {listaImagens.length > 1 && (
              <div className="detalhes-page__miniaturas">
                {listaImagens.map((img, idx) => (
                  <button
                    key={idx}
                    className={`detalhes-page__miniatura ${idx === imagemAtiva ? 'detalhes-page__miniatura--ativa' : ''}`}
                    onClick={() => setImagemAtiva(idx)}
                    aria-label={`Ver imagem ${idx + 1}`}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ============ INFORMAÇÕES ============ */}
          <div className="detalhes-page__info">
            <span className="detalhes-page__categoria">{categoriaLabel}</span>
            <h1 className="detalhes-page__titulo">{titulo}</h1>

            <div className="detalhes-page__preco-wrapper">
              <div className="detalhes-page__preco">
                {formatarMoeda(preco)}
                {quantidade && <span className="detalhes-page__quantidade">/ {quantidade}</span>}
              </div>
              <div className="detalhes-page__meta">
                {visualizacoes != null && (
                  <span>👁 {visualizacoes} visualizações</span>
                )}
                {criadoEm && <span>📅 {dataRelativa(criadoEm)}</span>}
              </div>
            </div>

            <div className="detalhes-page__descricao">
              <h3>Descrição</h3>
              <p>{descricao || 'Sem descrição fornecida.'}</p>
            </div>

            <div className="detalhes-page__localizacao-info">
              <span aria-hidden="true">📍</span>
              <strong>Localização:</strong> {cidade}{estado && `, ${estado}`}
            </div>

            {status && status !== 'ATIVO' && (
              <div className={`detalhes-page__status detalhes-page__status--${status.toLowerCase()}`}>
                Status: {status === 'PAUSADO' ? 'Pausado' : status === 'VENDIDO' ? 'Vendido' : status}
              </div>
            )}

            <Button variant="primary" size="lg" fullWidth>
              📞 Entrar em contato
            </Button>

            {/* ============ VENDEDOR ============ */}
            {vendedor && (
              <div className="detalhes-page__vendedor">
                <h3>Vendedor</h3>
                <div className="detalhes-page__vendedor-card">
                  <div className="detalhes-page__vendedor-avatar">
                    {vendedor.foto ? (
                      <img src={vendedor.foto} alt={vendedor.nome} />
                    ) : (
                      <span>{vendedor.nome?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="detalhes-page__vendedor-info">
                    <strong>{vendedor.nome}</strong>
                    {vendedor.telefone && (
                      <span>{formatarTelefone(vendedor.telefone)}</span>
                    )}
                    {vendedor.cidade && (
                      <span className="detalhes-page__vendedor-localizacao">
                        📍 {vendedor.cidade}{vendedor.estado && `, ${vendedor.estado}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
