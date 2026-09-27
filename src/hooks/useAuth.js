// ==========================================================
// EASY MEAT — Hook de autenticação
// ==========================================================
// Re-exporta o useAuth do AuthContext para import mais limpo e
// para permitir adicionar lógica extra sem tocar no Provider.
// ==========================================================

export { useAuth } from '../context/AuthContext.jsx';
