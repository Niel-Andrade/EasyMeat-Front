// ==========================================================
// EASY MEAT — Componente de proteção de rotas
// ==========================================================
// Redireciona para /login se não autenticado.
// Redireciona para / se autenticado mas sem permissão de admin.
// ==========================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Loading from '../Loading/Loading.jsx';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.admin] - se true, exige tipo ADMIN
 * @param {boolean} [props.vendedor] - se true, exige tipo VENDEDOR
 */
export default function ProtectedRoute({ children, admin = false, vendedor = false }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  // Aguarda verificação inicial da sessão
  if (carregando) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Loading texto="Verificando sessão..." />
      </div>
    );
  }

  // Não autenticado → login (preservando rota pretendida)
  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Exige admin
  if (admin && usuario.tipoUsuario !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Exige vendedor (admin também passa)
  if (vendedor && !['VENDEDOR', 'ADMIN'].includes(usuario.tipoUsuario)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
