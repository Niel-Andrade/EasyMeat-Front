// ==========================================================
// EASY MEAT — ProductCard (Card de anúncio)
// ==========================================================
// Modificação 6.2 — Destaque com selo proeminente e borda dourada
// ==========================================================

import { Link } from 'react-router-dom';
import { formatarMoeda } from '../../utils/formatters.js';
import { CATEGORIAS } from '../../utils/constants.js';
import './ProductCard.css';

/**
 * Card de produto reutilizável em listas e destaques.
 */
export default function ProductCard({ anuncio }) {
  if (!anuncio) return null;

  const {
    id,
    titulo,
    imagem,
    imagens,
    categoria,
    preco,
    quantidade,
    cidade,
    estado,
    destaque,
    vendedor,
    status,
  } = anuncio;

  const imagemPrincipal = imagem || (imagens && imagens[0]) || null;
  const categoriaLabel = CATEGORIAS.find((c) => c.value === categoria)?.label || categoria;

  return (
    <Link
      to={`/anuncio/${id}`}
      className={`produto-card ${destaque ? 'produto-card--premium' : ''}`}
    >
      <div className="produto-card__imagem-wrapper">
        {imagemPrincipal ? (
          <img
            src={imagemPrincipal}
            alt={titulo}
            className="produto-card__imagem"
            loading="lazy"
          />
        ) : (
          <div className="produto-card__sem-imagem" aria-label="Sem imagem">
            <span aria-hidden="true">🥩</span>
          </div>
        )}

        {destaque && (
          <span className="produto-card__selo produto-card__selo--premium">
            ⭐ Destaque Premium
          </span>
        )}

        {status && status !== 'ATIVO' && (
          <span className={`produto-card__selo produto-card__selo--status produto-card__selo--${status.toLowerCase()}`}>
            {status === 'PAUSADO' && 'Pausado'}
            {status === 'VENDIDO' && 'Vendido'}
          </span>
        )}
      </div>

      <div className="produto-card__corpo">
        <span className="produto-card__categoria">{categoriaLabel}</span>
        <h3 className="produto-card__titulo">{titulo}</h3>

        <div className="produto-card__preco">
          {formatarMoeda(preco)}
          {quantidade && (
            <span className="produto-card__quantidade">/ {quantidade}</span>
          )}
        </div>

        <div className="produto-card__localizacao">
          <span aria-hidden="true">📍</span>
          {cidade}{estado && `, ${estado}`}
        </div>

        {vendedor?.nome && (
          <div className="produto-card__vendedor">
            Vendido por <strong>{vendedor.nome}</strong>
          </div>
        )}
      </div>
    </Link>
  );
}
