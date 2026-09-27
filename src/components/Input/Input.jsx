// ==========================================================
// EASY MEAT — Input (campo de texto padrão)
// ==========================================================

import { useId } from 'react';
import './Input.css';

/**
 * @param {object} props — mesmos do <input> + label, erro, dica
 */
export default function Input({
  label,
  erro = '',
  dica = '',
  obrigatorio = false,
  className = '',
  ...rest
}) {
  const id = useId();

  return (
    <div className={`input-group ${erro ? 'input-group--erro' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-group__label">
          {label}
          {obrigatorio && <span className="input-group__required">*</span>}
        </label>
      )}
      <input
        id={id}
        className="input-group__input"
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...rest}
      />
      {dica && !erro && (
        <span className="input-group__dica">{dica}</span>
      )}
      {erro && (
        <span id={`${id}-erro`} className="input-group__erro" role="alert">
          {erro}
        </span>
      )}
    </div>
  );
}
