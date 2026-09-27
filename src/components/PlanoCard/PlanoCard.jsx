// ==========================================================
// EASY MEAT — PlanoCard (card de plano premium)
// ==========================================================

import Button from '../Button/Button.jsx';
import './PlanoCard.css';

export default function PlanoCard({ plano, onSelecionar, selecionado = false, loading = false }) {
  if (!plano) return null;

  const { id, nome, preco, descricao, beneficios, destaque, premium } = plano;

  return (
    <div
      className={[
        'plano-card',
        destaque && 'plano-card--destaque',
        premium && 'plano-card--premium',
        selecionado && 'plano-card--selecionado',
      ].filter(Boolean).join(' ')}
    >
      {destaque && <span className="plano-card__selo">Mais escolhido</span>}
      {premium && <span className="plano-card__selo plano-card__selo--premium">⭐ Premium</span>}

      <h3 className="plano-card__nome">{nome}</h3>
      <p className="plano-card__descricao">{descricao}</p>

      <div className="plano-card__preco">
        <span className="plano-card__preco-cifrao">R$</span>
        <span className="plano-card__preco-valor">
          {Number(preco).toFixed(2).replace('.', ',')}
        </span>
        <span className="plano-card__preco-periodo">/mês</span>
      </div>

      <ul className="plano-card__beneficios">
        {beneficios.map((b, idx) => (
          <li key={idx}>
            <span className="plano-card__check" aria-hidden="true">✓</span>
            {b}
          </li>
        ))}
      </ul>

      {onSelecionar && (
        <Button
          variant={premium ? 'primary' : destaque ? 'ghost' : 'secondary'}
          fullWidth
          onClick={() => onSelecionar(id)}
          loading={loading}
        >
          {id === 'free' ? 'Plano atual' : 'Ativar destaque'}
        </Button>
      )}
    </div>
  );
}
