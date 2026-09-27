// ==========================================================
// EASY MEAT — Footer (Rodapé institucional)
// ==========================================================
// Modificações aplicadas:
//  - 2.1 Espaçamento superior via padding-top
//  - 2.2 Categorias com Link funcional (?categoria=...)
//  - 2.3 Suporte com páginas reais (/ajuda, /termos, /privacidade)
//  - 2.4 Copyright atualizado, sem "Plataforma B2B de Carnes"
// ==========================================================

import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo.jsx';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__coluna">
          <div className="footer__logo">
            <Logo size="md" />
          </div>
          <p className="footer__descricao">
            Conectando produtores e compradores de carne em todo o Brasil.
            Plataforma simples, moderna e segura.
          </p>
        </div>

        <div className="footer__coluna">
          <h4>Plataforma</h4>
          <ul className="footer__links">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/anuncios">Produtos</Link></li>
            <li><Link to="/cadastro">Cadastrar</Link></li>
            <li><Link to="/login">Entrar</Link></li>
          </ul>
        </div>

        <div className="footer__coluna">
          <h4>Suporte</h4>
          <ul className="footer__links">
            <li><a href="mailto:contato@easymeat.com">contato@easymeat.com</a></li>
            <li><Link to="/ajuda">Central de Ajuda</Link></li>
            <li><Link to="/termos">Termos de Uso</Link></li>
            <li><Link to="/privacidade">Política de Privacidade</Link></li>
          </ul>
        </div>

        <div className="footer__coluna">
          <h4>Categorias</h4>
          <ul className="footer__links">
            {/* 2.2 — Links funcionais com query string */}
            <li><Link to="/anuncios?categoria=BOVINA">Bovina</Link></li>
            <li><Link to="/anuncios?categoria=SUINA">Suína</Link></li>
            <li><Link to="/anuncios?categoria=FRANGO">Frango</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__base">
        <div className="container">
          {/* 2.4 — Copyright atualizado */}
          <p>© {new Date().getFullYear()} Easy Meat. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
