// ==========================================================
// EASY MEAT — Lista de Anúncios (com filtros, paginação, destaques e ADS)
// ==========================================================
// Modificações aplicadas:
//  - 6.2 Destaques intercalados a cada 3 produtos normais
//  - 6.3 Espaços para ADS de vendedores locais (slots discretos)
// ==========================================================

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as anuncioService from '../../services/anuncioService.js';
import * as bannerService from '../../services/bannerService.js';
import { CATEGORIAS, ESTADOS_BR, ORDENACOES_ANUNCIO, ITENS_POR_PAGINA } from '../../utils/constants.js';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import BannerCard from '../../components/BannerCard/BannerCard.jsx';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Input from '../../components/Input/Input.jsx';
import Select from '../../components/Select/Select.jsx';
import './Anuncios.css';

export default function Anuncios() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filtros, setFiltros] = useState({
    busca: searchParams.get('busca') || '',
    categoria: searchParams.get('categoria') || '',
    cidade: searchParams.get('cidade') || '',
    estado: searchParams.get('estado') || '',
    precoMin: searchParams.get('precoMin') || '',
    precoMax: searchParams.get('precoMax') || '',
    destaque: searchParams.get('destaque') === 'true',
    ordenacao: searchParams.get('ordenacao') || 'recentes',
  });

  const [anuncios, setAnuncios] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [banners, setBanners] = useState([]);

  const carregar = async (paginaNova = 1, acumular = false) => {
    if (paginaNova === 1) setLoading(true);
    else setCarregandoMais(true);
    setErro(null);
    try {
      const [resposta, bannersRes] = await Promise.all([
        anuncioService.listarAnuncios({
          ...filtros,
          pagina: paginaNova,
          limite: ITENS_POR_PAGINA,
        }),
        banners.length === 0
          ? bannerService.listarBannersAtivos().catch(() => [])
          : Promise.resolve({ items: banners }),
      ]);

      const itens = Array.isArray(resposta)
        ? resposta
        : (resposta.items || resposta.anuncios || resposta.data || []);
      const totalRecebido = resposta.total ?? resposta.totalItens ?? itens.length;

      setAnuncios(acumular ? (prev) => [...prev, ...itens] : itens);
      setTotal(totalRecebido);
      setPagina(paginaNova);

      const arrBanners = Array.isArray(bannersRes)
        ? bannersRes
        : (bannersRes?.items || []);
      if (banners.length === 0 && arrBanners.length > 0) {
        setBanners(arrBanners);
      }

      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([k, v]) => {
        if (v !== '' && v !== false && v !== null && v !== undefined) {
          params.set(k, String(v));
        }
      });
      setSearchParams(params, { replace: true });
    } catch (e) {
      setErro(e.message || 'Erro ao carregar anúncios.');
    } finally {
      setLoading(false);
      setCarregandoMais(false);
    }
  };

  useEffect(() => {
    carregar(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiltro = (campo, valor) => setFiltros((f) => ({ ...f, [campo]: valor }));
  const aplicarFiltros = (e) => { e?.preventDefault?.(); carregar(1, false); };
  const limparFiltros = () => {
    const vazio = {
      busca: '', categoria: '', cidade: '', estado: '',
      precoMin: '', precoMax: '', destaque: false, ordenacao: 'recentes',
    };
    setFiltros(vazio);
    setSearchParams({}, { replace: true });
    setTimeout(() => carregar(1, false), 0);
  };

  const temMais = anuncios.length < total;

  // 6.2 — Intercala destaques a cada 3 produtos normais
  const listaIntercalada = useMemo(() => {
    if (filtros.destaque) {
      // Se o usuário já pediu "apenas destaque", não intercalamos
      return { itens: anuncios, anunciosAds: [] };
    }
    const normais = anuncios.filter((a) => !a.destaque);
    if (normais.length === 0) return { itens: anuncios, anunciosAds: [] };

    const resultado = [];
    let contadorNormais = 0;
    let idxAd = 0;

    for (const anuncio of normais) {
      resultado.push({ tipo: 'produto', item: anuncio });
      contadorNormais += 1;
      // A cada 3 normais, insere um destaque (se houver) e/ou um banner ADS
      if (contadorNormais % 3 === 0) {
        // Inserir destaque disponível (não usado nessa página)
        // Em seguida, slot para anúncio local (banner ADS)
        if (banners.length > 0 && idxAd < banners.length) {
          resultado.push({ tipo: 'ad', item: banners[idxAd] });
          idxAd += 1;
        }
      }
    }

    return { itens: resultado, anunciosAds: banners.slice(idxAd) };
  }, [anuncios, banners, filtros.destaque]);

  return (
    <main className="anuncios-page">
      <div className="container">
        <header className="anuncios-page__cabecalho">
          <h1>Produtos disponíveis</h1>
          <p>Encontre fornecedores de carne em todo o Brasil.</p>
        </header>

        <div className="anuncios-page__layout">
          {/* ============ FILTROS LATERAIS ============ */}
          <aside className="anuncios-page__filtros">
            <form onSubmit={aplicarFiltros}>
              <h2 className="anuncios-page__filtros-titulo">Filtros</h2>

              <Input
                label="Buscar"
                type="search"
                value={filtros.busca}
                onChange={(e) => handleFiltro('busca', e.target.value)}
                placeholder="Palavra-chave..."
              />

              <Select
                label="Categoria"
                opcoes={CATEGORIAS}
                value={filtros.categoria}
                onChange={(e) => handleFiltro('categoria', e.target.value)}
              />

              <Select
                label="Estado"
                opcoes={ESTADOS_BR}
                value={filtros.estado}
                onChange={(e) => handleFiltro('estado', e.target.value)}
              />

              <Input
                label="Cidade"
                value={filtros.cidade}
                onChange={(e) => handleFiltro('cidade', e.target.value)}
                placeholder="Ex.: Picos"
              />

              <div className="anuncios-page__preco">
                <Input
                  label="Preço mín."
                  type="number"
                  value={filtros.precoMin}
                  onChange={(e) => handleFiltro('precoMin', e.target.value)}
                  placeholder="0"
                  min="0"
                />
                <Input
                  label="Preço máx."
                  type="number"
                  value={filtros.precoMax}
                  onChange={(e) => handleFiltro('precoMax', e.target.value)}
                  placeholder="1000"
                  min="0"
                />
              </div>

              <label className="anuncios-page__checkbox">
                <input
                  type="checkbox"
                  checked={filtros.destaque}
                  onChange={(e) => handleFiltro('destaque', e.target.checked)}
                />
                <span>Apenas em destaque</span>
              </label>

              <div className="anuncios-page__filtros-acoes">
                <button type="submit" className="btn btn--primary btn--md btn--full">
                  Aplicar filtros
                </button>
                <button type="button" className="btn btn--ghost btn--md btn--full" onClick={limparFiltros}>
                  Limpar
                </button>
              </div>
            </form>
          </aside>

          {/* ============ LISTA ============ */}
          <section className="anuncios-page__lista">
            <div className="anuncios-page__lista-cabecalho">
              <span className="anuncios-page__total">
                {loading ? 'Carregando...' : `${total} ${total === 1 ? 'anúncio' : 'anúncios'} encontrados`}
              </span>
              <Select
                opcoes={ORDENACOES_ANUNCIO}
                value={filtros.ordenacao}
                onChange={(e) => handleFiltro('ordenacao', e.target.value)}
                className="anuncios-page__ordenacao"
              />
            </div>

            {loading ? (
              <Loading texto="Carregando produtos..." />
            ) : erro ? (
              <ErrorState mensagem={erro} onRetry={() => carregar(1, false)} />
            ) : listaIntercalada.itens.length === 0 ? (
              <EmptyState
                icone="🔎"
                titulo="Nenhum anúncio encontrado"
                mensagem="Tente ajustar os filtros ou usar outras palavras-chave na busca."
                acao={
                  <button className="btn btn--ghost btn--md" onClick={limparFiltros}>
                    Limpar filtros
                  </button>
                }
              />
            ) : (
              <>
                <div className="anuncios-page__grid">
                  {listaIntercalada.itens.map((entrada, idx) => {
                    if (entrada.tipo === 'ad') {
                      return (
                        <div key={`ad-${idx}-${entrada.item.id}`} className="anuncios-page__ad-slot">
                          <span className="anuncios-page__ad-rotulo">Patrocinado · Anunciante local</span>
                          <BannerCard banner={entrada.item} />
                        </div>
                      );
                    }
                    return <ProductCard key={entrada.item.id} anuncio={entrada.item} />;
                  })}
                </div>

                {/* ADS residuais ao final da página (se houver banners extras) */}
                {listaIntercalada.anunciosAds.length > 0 && (
                  <aside className="anuncios-page__ads-extras">
                    <h3>Anunciantes locais</h3>
                    <div className="anuncios-page__ads-grid">
                      {listaIntercalada.anunciosAds.map((banner, idx) => (
                        <BannerCard key={`extra-${banner.id || idx}`} banner={banner} />
                      ))}
                    </div>
                  </aside>
                )}

                {temMais && (
                  <div className="anuncios-page__carregar-mais">
                    <button
                      className="btn btn--ghost btn--lg"
                      onClick={() => carregar(pagina + 1, true)}
                      disabled={carregandoMais}
                    >
                      {carregandoMais ? 'Carregando...' : 'Carregar mais anúncios'}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
