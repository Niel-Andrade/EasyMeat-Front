// ==========================================================
// EASY MEAT — EmptyState (estado vazio)
// ==========================================================

import './EmptyState.css';

export default function EmptyState({
  icone = '📦',
  titulo = 'Nenhum item encontrado',
  mensagem = '',
  acao = null,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icone" aria-hidden="true">{icone}</div>
      <h3 className="empty-state__titulo">{titulo}</h3>
      {mensagem && <p className="empty-state__mensagem">{mensagem}</p>}
      {acao && <div className="empty-state__acao">{acao}</div>}
    </div>
  );
}
