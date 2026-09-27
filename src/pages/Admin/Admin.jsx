// ==========================================================
// EASY MEAT — Painel Administrativo (dashboard)
// ==========================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../../services/api.js';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import './Admin.css';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      // Stats agregadas a partir de endpoints existentes.
      // O back-end pode expor um endpoint consolidado /admin/stats também.
      const [usuarios, anuncios, banners] = await Promise.all([
        apiGet('/admin/usuarios').catch(() => ({ data: [] })),
        apiGet('/admin/anuncios').catch(() => ({ data: [] })),
        apiGet('/admin/banners').catch(() => ({ data: [] })),
      ]);
      const usuariosArr = usuarios.data?.items || usuarios.data?.usuarios || usuarios.data || [];
      const anunciosArr = anuncios.data?.items || anuncios.data?.anuncios || anuncios.data || [];
      const bannersArr = banners.data?.items || banners.data?.banners || banners.data || [];

      setStats({
        usuarios: usuariosArr.length,
        anuncios: anunciosArr.length,
        destaques: anunciosArr.filter((a) => a.destaque).length,
        banners: bannersArr.filter((b) => b.ativo).length,
      });
    } catch (e) {
      setErro(e.message || 'Erro ao carregar indicadores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <main className="admin-page">
      <div className="container">
        <header className="admin-page__cabecalho">
          <div>
            <h1>Painel Administrativo</h1>
            <p>Visão geral da plataforma.</p>
          </div>
        </header>

        {loading ? (
          <Loading texto="Carregando indicadores..." />
        ) : erro ? (
          <ErrorState mensagem={erro} onRetry={carregar} />
        ) : (
          <>
            <section className="admin-page__stats">
              <div className="admin-page__stat">
                <span className="admin-page__stat-icone">👥</span>
                <div>
                  <strong>{stats?.usuarios || 0}</strong>
                  <span>Usuários</span>
                </div>
              </div>
              <div className="admin-page__stat">
                <span className="admin-page__stat-icone">📦</span>
                <div>
                  <strong>{stats?.anuncios || 0}</strong>
                  <span>Anúncios</span>
                </div>
              </div>
              <div className="admin-page__stat">
                <span className="admin-page__stat-icone">⭐</span>
                <div>
                  <strong>{stats?.destaques || 0}</strong>
                  <span>Em destaque</span>
                </div>
              </div>
              <div className="admin-page__stat">
                <span className="admin-page__stat-icone">📢</span>
                <div>
                  <strong>{stats?.banners || 0}</strong>
                  <span>Banners ativos</span>
                </div>
              </div>
            </section>

            <section className="admin-page__atalhos">
              <h2>Gerenciar plataforma</h2>
              <div className="admin-page__atalhos-grid">
                <Link to="/admin/usuarios" className="admin-page__atalho">
                  <span aria-hidden="true">👥</span>
                  <strong>Usuários</strong>
                  <small>Gerenciar contas e status</small>
                </Link>
                <Link to="/admin/anuncios" className="admin-page__atalho">
                  <span aria-hidden="true">📦</span>
                  <strong>Anúncios</strong>
                  <small>Aprovar, destacar ou remover</small>
                </Link>
                <Link to="/admin/banners" className="admin-page__atalho">
                  <span aria-hidden="true">📢</span>
                  <strong>Banners</strong>
                  <small>Criar e gerenciar banners</small>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
