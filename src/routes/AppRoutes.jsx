// ==========================================================
// EASY MEAT — Definição central de rotas
// ==========================================================
// Modificações aplicadas:
//  - 2.3 Novas rotas /ajuda, /termos, /privacidade
//  - 6.1 Rota detalhe ajustada para /anuncio/:id
// ==========================================================

import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx';

import Home from '../pages/Home/Home.jsx';
import Login from '../pages/Login/Login.jsx';
import Cadastro from '../pages/Cadastro/Cadastro.jsx';
import RecuperarSenha from '../pages/RecuperarSenha/RecuperarSenha.jsx';
import RedefinirSenha from '../pages/RedefinirSenha/RedefinirSenha.jsx';
import Anuncios from '../pages/Anuncios/Anuncios.jsx';
import DetalhesAnuncio from '../pages/DetalhesAnuncio/DetalhesAnuncio.jsx';

// Páginas institucionais (2.3)
import Ajuda from '../pages/Ajuda/Ajuda.jsx';
import Termos from '../pages/Termos/Termos.jsx';
import Privacidade from '../pages/Privacidade/Privacidade.jsx';

// Páginas privadas
import Perfil from '../pages/Perfil/Perfil.jsx';
import AlterarSenha from '../pages/AlterarSenha/AlterarSenha.jsx';
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import MeusAnuncios from '../pages/MeusAnuncios/MeusAnuncios.jsx';
import NovoAnuncio from '../pages/NovoAnuncio/NovoAnuncio.jsx';
import EditarAnuncio from '../pages/EditarAnuncio/EditarAnuncio.jsx';
import Premium from '../pages/Premium/Premium.jsx';

// Admin
import Admin from '../pages/Admin/Admin.jsx';
import AdminUsuarios from '../pages/AdminUsuarios/AdminUsuarios.jsx';
import AdminAnuncios from '../pages/AdminAnuncios/AdminAnuncios.jsx';
import AdminBanners from '../pages/AdminBanners/AdminBanners.jsx';

import NotFound from '../pages/NotFound.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* ============ ROTAS PÚBLICAS ============ */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/redefinir-senha/:token" element={<RedefinirSenha />} />
      <Route path="/anuncios" element={<Anuncios />} />
      <Route path="/anuncio/:id" element={<DetalhesAnuncio />} />

      {/* ============ INSTITUCIONAIS ============ */}
      <Route path="/ajuda" element={<Ajuda />} />
      <Route path="/termos" element={<Termos />} />
      <Route path="/privacidade" element={<Privacidade />} />

      {/* ============ ROTAS PRIVADAS — USUÁRIO ============ */}
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/perfil/senha" element={<ProtectedRoute><AlterarSenha /></ProtectedRoute>} />

      {/* ============ ROTAS PRIVADAS — VENDEDOR ============ */}
      <Route path="/dashboard" element={<ProtectedRoute vendedor><Dashboard /></ProtectedRoute>} />
      <Route path="/meus-anuncios" element={<ProtectedRoute vendedor><MeusAnuncios /></ProtectedRoute>} />
      <Route path="/novo-anuncio" element={<ProtectedRoute vendedor><NovoAnuncio /></ProtectedRoute>} />
      <Route path="/editar-anuncio/:id" element={<ProtectedRoute vendedor><EditarAnuncio /></ProtectedRoute>} />
      <Route path="/premium" element={<ProtectedRoute vendedor><Premium /></ProtectedRoute>} />

      {/* ============ ROTAS ADMINISTRATIVAS ============ */}
      <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<ProtectedRoute admin><AdminUsuarios /></ProtectedRoute>} />
      <Route path="/admin/anuncios" element={<ProtectedRoute admin><AdminAnuncios /></ProtectedRoute>} />
      <Route path="/admin/banners" element={<ProtectedRoute admin><AdminBanners /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
