// ==========================================================
// EASY MEAT — Modal genérico
// ==========================================================

import { useEffect } from 'react';
import './Modal.css';

/**
 * @param {object} props
 * @param {boolean} props.aberto
 * @param {function} props.onFechar
 * @param {string} props.titulo
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer]
 * @param {'sm'|'md'|'lg'} [props.tamanho]
 */
export default function Modal({
  aberto,
  onFechar,
  titulo,
  children,
  footer = null,
  tamanho = 'md',
}) {
  // Fecha com ESC
  useEffect(() => {
    if (!aberto) return;
    const handler = (e) => {
      if (e.key === 'Escape') onFechar?.();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div
        className={`modal modal--${tamanho}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
      >
        <div className="modal__cabecalho">
          <h2 id="modal-titulo" className="modal__titulo">{titulo}</h2>
          <button
            className="modal__fechar"
            onClick={onFechar}
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>
        <div className="modal__corpo">{children}</div>
        {footer && <div className="modal__rodape">{footer}</div>}
      </div>
    </div>
  );
}
