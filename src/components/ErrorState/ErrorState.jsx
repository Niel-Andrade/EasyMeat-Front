// ==========================================================
// EASY MEAT — ErrorState (estado de erro)
// ==========================================================

import Button from '../Button/Button.jsx';
import './ErrorState.css';

export default function ErrorState({
  titulo = 'Algo deu errado',
  mensagem = 'Não foi possível carregar os dados.',
  onRetry = null,
}) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icone" aria-hidden="true">⚠️</div>
      <h3 className="error-state__titulo">{titulo}</h3>
      <p className="error-state__mensagem">{mensagem}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
