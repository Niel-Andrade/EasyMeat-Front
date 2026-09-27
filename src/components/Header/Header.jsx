// ==========================================================
// EASY MEAT — Header (Navbar)
// ==========================================================
// Modificações aplicadas:
//  - 3.1 / 4.1 Logo minimalista (componente <Logo />)
//  - 5.1 Removido botão "Criar conta" duplicado no header
//        (aqui só autenticado vê login ou conta)
//  - 5.2 Quando logado: nav mostra apenas Logo, Produtos, Conta
// ==========================================================

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import Logo from '../Logo/Logo.jsx';
import './Header.css';

export default function Header() {
  const { usuario, logout, estaAutenticado, isVendedor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [userMenuAberto, setUserMenuAberto] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuAberto(false);
    navigate('/');
  };

  // 5.2 — Para visitantes: Início + Produtos. Para autenticados: só Produtos.
  const linksPublicos = [
    { to: '/', label: 'Início' },
    { to: '/anuncios', label: 'Produtos' },
  ];

  const linksLogado = [
    { to: '/anuncios', label: 'Produtos' },
  ];

  const links = estaAutenticado ? linksLogado : linksPublicos;

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="container header__container">
        {/* 3.1 / 4.1 — Logo minimalista */}
        <Link to="/" className="header__logo" onClick={() => setMenuAberto(false)}>
          <Logo size="sm" />
        </Link>

        {/* Botão mobile */}
        <button
          className="header__menu-btn"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
        >
          {menuAberto ? '✕' : '☰'}
        </button>

        {/* Navegação */}
        <nav className={`header__nav ${menuAberto ? 'header__nav--aberto' : ''}`}>
          <ul className="header__links">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`header__link ${isActive(link.to) ? 'header__link--active' : ''}`}
                  onClick={() => setMenuAberto(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Ações do usuário */}
          <div className="header__acoes">
            {estaAutenticado ? (
              <div className="header__user-menu">
                <button
                  className="header__user-btn"
                  onClick={() => setUserMenuAberto(!userMenuAberto)}
                  aria-expanded={userMenuAberto}
                >
                  <span className="header__user-avatar" aria-hidden="true">
                    {usuario?.foto
                      ? <img src={usuario.foto} alt="" />
                      : (usuario?.nome?.charAt(0)?.toUpperCase() || '👤')}
                  </span>
                  <span className="header__user-nome">
                    {usuario?.nome?.split(' ')[0] || 'Conta'}
                  </span>
                  <span className="header__user-seta" aria-hidden="true">▾</span>
                </button>
                {userMenuAberto && (
                  <div className="header__dropdown" role="menu">
                    <div className="header__dropdown-info">
                      <strong>{usuario?.nome}</strong>
                      <span>{usuario?.email}</span>
                      <span className="header__dropdown-tipo">
                        {usuario?.tipoUsuario === 'ADMIN' && 'Administrador'}
                        {usuario?.tipoUsuario === 'VENDEDOR' && 'Vendedor'}
                        {usuario?.tipoUsuario === 'COMPRADOR' && 'Comprador'}
                      </span>
                    </div>
                    <Link to="/perfil" className="header__dropdown-item" onClick={() => setUserMenuAberto(false)}>
                      👤 Meu perfil
                    </Link>
                    <Link to="/perfil/senha" className="header__dropdown-item" onClick={() => setUserMenuAberto(false)}>
                      🔑 Alterar senha
                    </Link>
                    {(isVendedor || isAdmin) && (
                      <Link to="/meus-anuncios" className="header__dropdown-item" onClick={() => setUserMenuAberto(false)}>
                        📦 Meus anúncios
                      </Link>
                    )}
                    {(isVendedor || isAdmin) && (
                      <Link to="/dashboard" className="header__dropdown-item" onClick={() => setUserMenuAberto(false)}>
                        📊 Dashboard
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin" className="header__dropdown-item" onClick={() => setUserMenuAberto(false)}>
                        🛠 Administração
                      </Link>
                    )}
                    <Link to="/premium" className="header__dropdown-item" onClick={() => setUserMenuAberto(false)}>
                      ⭐ Premium
                    </Link>
                    <button onClick={handleLogout} className="header__dropdown-item header__dropdown-item--sair">
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* 5.1 — Visitante vê Login e Criar conta */}
                <Link to="/login" className="header__btn header__btn--ghost">
                  Entrar
                </Link>
                <Link to="/cadastro" className="header__btn header__btn--primary">
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
