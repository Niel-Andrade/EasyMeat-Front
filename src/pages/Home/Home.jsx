// ==========================================================
// EASY MEAT — Página Inicial (Home)
// ==========================================================
// Alterações aplicadas:
//  - 1.1 Removida a indicação "🐂 Plataforma B2B"
//  - 1.2 Logo minimalista via componente <Logo />
//  - 1.3 Frase contínua (sem "—")
//  - Botão CTA considera usuário autenticado (5.1)
//  - Busca rápida com Link (sem window.location)
// ==========================================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as anuncioService from '../../services/anuncioService.js';
import * as bannerService from '../../services/bannerService.js';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import BannerCard from '../../components/BannerCard/BannerCard.jsx';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Logo from '../../components/Logo/Logo.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { CATEGORIAS } from '../../utils/constants.js';
import './Home.css';

export default function Home() {
  const { estaAutenticado } = useAuth();
  const navigate = useNavigate();

  const [destaques, setDestaques] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const [destaquesRes, bannersRes] = await Promise.all([
        anuncioService.listarDestaques(6).catch(() => []),
        bannerService.listarBannersAtivos().catch(() => []),
      ]);
      const arrDestaques = Array.isArray(destaquesRes)
        ? destaquesRes
        : (destaquesRes?.items || destaquesRes?.anuncios || []);
      const arrBanners = Array.isArray(bannersRes)
        ? bannersRes
        : (bannersRes?.items || []);
      setDestaques(arrDestaques);
      setBanners(arrBanners);
    } catch (e) {
      setErro(e.message || 'Erro ao carregar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  // 5.1 — CTA adapta-se conforme autenticação
  const destinoCta = estaAutenticado ? '/anuncios' : '/cadastro';

  return (
    <main className="home">
      {/* ============ HERO ============ */}
      <section className="home__hero">
        <div className="container home__hero-container">
          <div className="home__hero-textos">
            {/* 1.2 — Logo minimalista em vez do emoji */}
            <div className="home__hero-tagline">
              <Logo size="sm" />
            </div>
            <h1 className="home__hero-titulo">
              Conectando produtores e compradores de <em>carnes</em> em um só lugar.
            </h1>
            {/* 1.3 — Sem "—", frase contínua */}
            <p className="home__hero-descricao">
              Encontre fornecedores confiáveis, anuncie seus produtos e amplie
              suas oportunidades comerciais. Tudo em uma plataforma simples,
              segura e feita para o agronegócio.
            </p>
            <div className="home__hero-acoes">
              <Link to="/anuncios" className="home__hero-btn home__hero-btn--primary">
                🔍 Encontrar produtos
              </Link>
              <Link to="/cadastro" className="home__hero-btn home__hero-btn--ghost">
                ✍️ Anunciar produto
              </Link>
            </div>

            <div className="home__hero-stats">
              <div className="home__hero-stat">
                <strong>+500</strong>
                <span>Anunciantes</span>
              </div>
              <div className="home__hero-stat">
                <strong>+2.000</strong>
                <span>Anúncios ativos</span>
              </div>
              <div className="home__hero-stat">
                <strong>26</strong>
                <span>Estados atendidos</span>
              </div>
            </div>
          </div>

          <div className="home__hero-visual" aria-hidden="true">
            <div className="home__hero-card home__hero-card--1">
              <span>🥩</span>
              <strong>Bovina Premium</strong>
              <em>R$ 38,90/kg</em>
            </div>
            <div className="home__hero-card home__hero-card--2">
              <span>🐔</span>
              <strong>Frango Caipira</strong>
              <em>R$ 14,50/kg</em>
            </div>
            <div className="home__hero-card home__hero-card--3">
              <span>⭐</span>
              <strong>Destaque</strong>
              <em>Visibilidade máxima</em>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PESQUISA RÁPIDA ============ */}
      <section className="home__busca">
        <div className="container">
          <form
            className="home__busca-form"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const params = new URLSearchParams();
              const busca = fd.get('busca');
              const categoria = fd.get('categoria');
              if (busca) params.append('busca', busca);
              if (categoria) params.append('categoria', categoria);
              navigate(`/anuncios${params.toString() ? `?${params}` : ''}`);
            }}
          >
            <input
              type="search"
              name="busca"
              placeholder="O que você procura? Ex.: carne bovina, frango..."
              className="home__busca-input"
              aria-label="Buscar produtos"
            />
            <select name="categoria" className="home__busca-select" aria-label="Categoria">
              <option value="">Todas as categorias</option>
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button type="submit" className="home__busca-btn">Pesquisar</button>
          </form>
        </div>
      </section>

      {/* ============ CATEGORIAS ============ */}
      <section className="home__categorias">
        <div className="container">
          <h2 className="home__titulo-secao">Explore por categoria</h2>
          <div className="home__categorias-grid">
            {CATEGORIAS.filter(c => c.value !== 'OUTROS').map((c) => (
              <Link
                key={c.value}
                to={`/anuncios?categoria=${c.value}`}
                className="home__categoria-card"
              >
                <span className="home__categoria-icone" aria-hidden="true">
                  {c.value === 'BOVINA' && '🥩'}
                  {c.value === 'SUINA' && '🥓'}
                  {c.value === 'FRANGO' && '🍗'}
                </span>
                <strong>{c.label}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DESTAQUES ============ */}
      <section className="home__destaques">
        <div className="container">
          <div className="home__destaques-cabecalho">
            <h2 className="home__titulo-secao">⭐ Produtos em destaque</h2>
            <Link to="/anuncios?destaque=true" className="home__destaques-link">
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <Loading texto="Carregando destaques..." />
          ) : erro ? (
            <ErrorState mensagem={erro} onRetry={carregar} />
          ) : destaques.length === 0 ? (
            <EmptyState
              icone="🌟"
              titulo="Ainda não há produtos em destaque"
              mensagem="Quando vendedores ativarem o destaque, os produtos aparecerão aqui."
            />
          ) : (
            <div className="home__destaques-grid">
              {destaques.map((anuncio) => (
                <ProductCard key={anuncio.id} anuncio={anuncio} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ COMO FUNCIONA ============ */}
      <section className="home__como-funciona">
        <div className="container">
          <h2 className="home__titulo-secao text-center">Como funciona</h2>
          <div className="home__como-grid">
            <div className="home__como-card">
              <div className="home__como-numero">1</div>
              <h3>Crie sua conta</h3>
              <p>Cadastro gratuito em menos de 1 minuto. Escolha ser comprador ou vendedor.</p>
            </div>
            <div className="home__como-card">
              <div className="home__como-numero">2</div>
              <h3>Pesquise ou anuncie</h3>
              <p>Compradores encontram fornecedores por categoria e região. Vendedores publicam seus produtos com poucos cliques.</p>
            </div>
            <div className="home__como-card">
              <div className="home__como-numero">3</div>
              <h3>Faça negócios</h3>
              <p>Entre em contato diretamente e feche parcerias. Use o destaque premium para ter mais visibilidade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BANNERS ============ */}
      {banners.length > 0 && (
        <section className="home__banners">
          <div className="container">
            <h2 className="home__titulo-secao">Patrocinados</h2>
            <div className="home__banners-grid">
              {banners.map((banner, idx) => (
                <BannerCard key={banner.id || idx} banner={banner} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA FINAL ============ */}
      <section className="home__cta">
        <div className="container home__cta-container">
          <div>
            <h2>Pronto para vender ou comprar carne?</h2>
            <p>Junte-se a centenas de produtores e compradores que já fazem negócios pela Easy Meat.</p>
          </div>
          <div className="home__cta-acoes">
            {/* 5.1 — Adapta ao estado de autenticação */}
            <Link to={destinoCta} className="home__cta-btn primary">
              {estaAutenticado ? 'Ver produtos' : 'Criar conta grátis'}
            </Link>
            <Link to="/anuncios" className="home__cta-btn ghost">Explorar catálogo</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
