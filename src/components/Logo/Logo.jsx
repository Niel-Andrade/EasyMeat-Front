// ==========================================================
// EASY MEAT — Logo minimalista (SVG)
// ==========================================================
// Substitui o emoji 🐂 por um símbolo limpo, moderno e
// alinhado com a identidade da marca.
// ==========================================================

import './Logo.css';

/**
 * Logo da Easy Meat — ícone + texto opcional.
 *
 * Props:
 *  - variant: 'full' (ícone + texto) | 'icon' (só ícone) | 'text' (só texto)
 *  - size: 'sm' | 'md' | 'lg'
 *  - color: 'primary' | 'white' | 'dark'
 */
export default function Logo({ variant = 'full', size = 'md', color = 'primary' }) {
  return (
    <span className={`logo logo--${variant} logo--${size} logo--${color}`}>
      <svg
        className="logo__icon"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Folha elegante em forma de "E" estilizada + risco de viande */}
        <path
          d="M24 6c-8 0-14 5-14 12 0 4 2 7 5 9v15h6v-9h6v9h6V27c3-2 5-5 5-9 0-7-6-12-14-12z"
          fill="currentColor"
          opacity="0.95"
        />
        {/* Linha branca que representa o corte da carne / conexão */}
        <path
          d="M16 22c4 3 12 3 16 0"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Pequeno corte */}
        <circle cx="24" cy="38" r="2.2" fill="#ffffff" />
      </svg>

      {variant !== 'icon' && (
        <span className="logo__text">
          Easy<span className="logo__text-accent">Meat</span>
        </span>
      )}
    </span>
  );
}
