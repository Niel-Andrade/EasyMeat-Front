// ==========================================================
// EASY MEAT — Admin Usuarios
// ==========================================================

import { useState, useEffect } from 'react';
import { apiGet, apiPut } from '../../services/api.js';
import { formatarData, formatarTelefone } from '../../utils/formatters.js';
import Loading from '../../components/Loading/Loading.jsx';
import ErrorState from '../../components/ErrorState/ErrorState.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Button from '../../components/Button/Button.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import './../Admin/Admin.css';
import './AdminTabelas.css';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [modalAlterar, setModalAlterar] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const resposta = await apiGet('/admin/usuarios');
      const lista = resposta.data?.items || resposta.data?.usuarios || resposta.data || [];
      setUsuarios(lista);
    } catch (e) {
      setErro(e.message || 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const alterarStatus = async () => {
    if (!modalAlterar) return;
    setSalvando(true);
    try {
      const novoStatus = modalAlterar.status === 'BLOQUEADO' ? 'ATIVO' : 'BLOQUEADO';
      await apiPut(`/admin/usuarios/${modalAlterar.id}/status`, { status: novoStatus });
      setModalAlterar(null);
      carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    if (!filtro) return true;
    const busca = filtro.toLowerCase();
    return (
      u.nome?.toLowerCase().includes(busca) ||
      u.email?.toLowerCase().includes(busca) ||
      u.cidade?.toLowerCase().includes(busca)
    );
  });

  return (
    <main className="admin-page">
      <div className="container">
        <header className="admin-page__cabecalho">
          <div>
            <h1>Usuários</h1>
            <p>Gerenciar contas e status dos usuários.</p>
          </div>
          <input
            type="search"
            placeholder="🔎 Buscar por nome, e-mail ou cidade..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="admin-tabela__busca"
          />
        </header>

        {loading ? (
          <Loading texto="Carregando usuários..." />
        ) : erro ? (
          <ErrorState mensagem={erro} onRetry={carregar} />
        ) : usuariosFiltrados.length === 0 ? (
          <EmptyState
            icone="👥"
            titulo="Nenhum usuário encontrado"
            mensagem={filtro ? 'Tente ajustar a busca.' : 'A plataforma ainda não tem usuários cadastrados.'}
          />
        ) : (
          <div className="admin-tabela__wrapper">
            <table className="admin-tabela">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-tabela__usuario">
                        <span className="admin-tabela__avatar">
                          {u.foto ? <img src={u.foto} alt="" /> : u.nome?.charAt(0)?.toUpperCase()}
                        </span>
                        <strong>{u.nome}</strong>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{formatarTelefone(u.telefone)}</td>
                    <td>{u.cidade}{u.estado && `, ${u.estado}`}</td>
                    <td>
                      <span className={`admin-tabela__tag admin-tabela__tag--${u.tipoUsuario?.toLowerCase()}`}>
                        {u.tipoUsuario}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-tabela__tag admin-tabela__tag--${(u.status || 'ATIVO').toLowerCase()}`}>
                        {u.status || 'ATIVO'}
                      </span>
                    </td>
                    <td>{formatarData(u.criadoEm)}</td>
                    <td>
                      <Button
                        size="sm"
                        variant={u.status === 'BLOQUEADO' ? 'success' : 'danger'}
                        onClick={() => setModalAlterar(u)}
                      >
                        {u.status === 'BLOQUEADO' ? 'Ativar' : 'Bloquear'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        aberto={Boolean(modalAlterar)}
        onFechar={() => setModalAlterar(null)}
        titulo={modalAlterar?.status === 'BLOQUEADO' ? 'Ativar usuário?' : 'Bloquear usuário?'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalAlterar(null)}>Cancelar</Button>
            <Button
              variant={modalAlterar?.status === 'BLOQUEADO' ? 'success' : 'danger'}
              onClick={alterarStatus}
              loading={salvando}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <p>
          Você está prestes a {modalAlterar?.status === 'BLOQUEADO' ? 'reativar' : 'bloquear'} a conta de{' '}
          <strong>{modalAlterar?.nome}</strong>.
        </p>
      </Modal>
    </main>
  );
}
