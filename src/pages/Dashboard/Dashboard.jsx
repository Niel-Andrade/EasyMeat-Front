// ==========================================================
// EASY MEAT — Dashboard do Vendedor
// ==========================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import * as usuarioService from '../../services/usuarioService.js';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const { usuario } = useAuth();
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const dados = await usuarioService.listarMeusAnuncios();
      const lista = Array.isArray(dados) ? dados : (dados.items || dados.anuncios || []);
      setAnuncios(lista);
    } catch (e) {
      setErro(e.message || 'Erro ao carregar seus dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const totais = {
    total: anuncios.length,
    ativos: anuncios.filter((a) => a.status === 'ATIVO' || !a.status).length,
    pausados: anuncios.filter((a) => a.status === 'PAUSADO').length,
    vendidos: anuncios.filter((a) => a.status === 'VENDIDO').length,
    destaque: anuncios.filter((a) => a.destaque).length,
    visualizacoes: anuncios.reduce((acc, a) => acc + (a.visualizacoes || 0), 0),
  };

  return (
    <main className="dashboard-page">
      <div className="container">
        <header className="dashboard-page__cabecalho">
          <div>
            <h1>Olá, {usuario?.nome?.split(' ')[0]}! 👋</h1>
            <p>Acompanhe o desempenho do seu negócio em um só lugar.</p>
          </div>
          <Link to="/novo-anuncio" className="btn btn--primary btn--md">
            + Novo anúncio
          </Link>
        </header>

        {loading ? (
          <Loading texto="Carregando indicadores..." />
        ) : erro ? (
          <ErrorState mensagem={erro} onRetry={carregar} />
        ) : (
          <>
            {/* ============ INDICADORES ============ */}
            <section className="dashboard-page__cards">
              <div className="dashboard-page__card">
                <div className="dashboard-page__card-icone" aria-hidden="true">📦</div>
                <div>
                  <span className="dashboard-page__card-titulo">Total de anúncios</span>
                  <strong className="dashboard-page__card-valor">{totais.total}</strong>
                </div>
              </div>

              <div className="dashboard-page__card dashboard-page__card--success">
                <div className="dashboard-page__card-icone" aria-hidden="true">✅</div>
                <div>
                  <span className="dashboard-page__card-titulo">Anúncios ativos</span>
                  <strong className="dashboard-page__card-valor">{totais.ativos}</strong>
                </div>
              </div>

              <div className="dashboard-page__card dashboard-page__card--warning">
                <div className="dashboard-page__card-icone" aria-hidden="true">⏸️</div>
                <div>
                  <span className="dashboard-page__card-titulo">Pausados</span>
                  <strong className="dashboard-page__card-valor">{totais.pausados}</strong>
                </div>
              </div>

              <div className="dashboard-page__card dashboard-page__card--premium">
                <div className="dashboard-page__card-icone" aria-hidden="true">⭐</div>
                <div>
                  <span className="dashboard-page__card-titulo">Em destaque</span>
                  <strong className="dashboard-page__card-valor">{totais.destaque}</strong>
                </div>
              </div>

              <div className="dashboard-page__card dashboard-page__card--info">
                <div className="dashboard-page__card-icone" aria-hidden="true">👁️</div>
                <div>
                  <span className="dashboard-page__card-titulo">Visualizações</span>
                  <strong className="dashboard-page__card-valor">{totais.visualizacoes}</strong>
                </div>
              </div>

              <div className="dashboard-page__card dashboard-page__card--sold">
                <div className="dashboard-page__card-icone" aria-hidden="true">🤝</div>
                <div>
                  <span className="dashboard-page__card-titulo">Vendidos</span>
                  <strong className="dashboard-page__card-valor">{totais.vendidos}</strong>
                </div>
              </div>
            </section>

            {/* ============ ATALHOS ============ */}
            <section className="dashboard-page__atalhos">
              <h2>Ações rápidas</h2>
              <div className="dashboard-page__atalhos-grid">
                <Link to="/novo-anuncio" className="dashboard-page__atalho">
                  <span aria-hidden="true">✍️</span>
                  <strong>Publicar novo anúncio</strong>
                  <small>Cadastre um novo produto em segundos</small>
                </Link>
                <Link to="/meus-anuncios" className="dashboard-page__atalho">
                  <span aria-hidden="true">📋</span>
                  <strong>Gerenciar anúncios</strong>
                  <small>Edite, pause ou exclua seus produtos</small>
                </Link>
                <Link to="/premium" className="dashboard-page__atalho">
                  <span aria-hidden="true">⭐</span>
                  <strong>Plano Premium</strong>
                  <small>Destaque seus produtos e venda mais</small>
                </Link>
                <Link to="/perfil" className="dashboard-page__atalho">
                  <span aria-hidden="true">👤</span>
                  <strong>Meu perfil</strong>
                  <small>Mantenha seus dados atualizados</small>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
