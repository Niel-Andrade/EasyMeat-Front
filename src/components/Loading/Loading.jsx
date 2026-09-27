// ==========================================================
// EASY MEAT — Loading (spinner / texto de carregamento)
// ==========================================================

import './Loading.css';

export default function Loading({ texto = 'Carregando...', tamanho = 'md' }) {
  return (
    <div className={`loading loading--${tamanho}`} role="status" aria-live="polite">
      <span className="loading__spinner" aria-hidden="true" />
      <span className="loading__texto">{texto}</span>
    </div>
  );
}

/**
 * Componente para cobrir a página inteira enquanto dados carregam.
 */
export function LoadingTela({ texto = 'Carregando informações...' }) {
  return (
    <div className="loading-tela">
      <Loading texto={texto} tamanho="lg" />
    </div>
  );
}

/**
 * Skeleton simples para cards de produto.
 */
export function SkeletonGrid({ quantidade = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: quantidade }).map((_, i) => (
        <div key={i} className="skeleton-card" />
      ))}
    </div>
  );
}
