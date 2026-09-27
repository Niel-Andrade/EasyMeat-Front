// ==========================================================
// EASY MEAT — Página 404
// ==========================================================

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-16) var(--space-4)',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
          404
        </div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>Página não encontrada</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          A página que você procura não existe ou foi removida.
        </p>
        <Link to="/" className="btn btn--primary btn--md">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
