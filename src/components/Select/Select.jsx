// ==========================================================
// EASY MEAT — Select (campo de seleção)
// ==========================================================

import { useId } from 'react';
import './Select.css';

/**
 * @param {object} props
 * @param {string} props.label
 * @param {Array<{value:string,label:string}>} props.opcoes
 * @param {string} [props.erro]
 * @param {boolean} [props.obrigatorio]
 */
export default function Select({
  label,
  opcoes = [],
  erro = '',
  obrigatorio = false,
  placeholder = 'Selecione...',
  className = '',
  ...rest
}) {
  const id = useId();

  return (
    <div className={`select-group ${erro ? 'select-group--erro' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="select-group__label">
          {label}
          {obrigatorio && <span className="select-group__required">*</span>}
        </label>
      )}
      <div className="select-group__wrapper">
        <select
          id={id}
          className="select-group__select"
          aria-invalid={Boolean(erro)}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {opcoes.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
        <span className="select-group__seta" aria-hidden="true">▾</span>
      </div>
      {erro && (
        <span className="select-group__erro" role="alert">
          {erro}
        </span>
      )}
    </div>
  );
}
