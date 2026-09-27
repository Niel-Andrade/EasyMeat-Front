// ==========================================================
// EASY MEAT — Página Premium (planos)
// ==========================================================

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { PLANOS } from '../../utils/constants.js';
import * as anuncioService from '../../services/anuncioService.js';
import PlanoCard from '../../components/PlanoCard/PlanoCard.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import Button from '../../components/Button/Button.jsx';
import './Premium.css';

export default function Premium() {
  const { usuario, atualizarUsuario } = useAuth();
  const [planoAtivo, setPlanoAtivo] = useState(usuario?.plano || 'free');
  const [confirmando, setConfirmando] = useState(null);
  const [ativando, setAtivando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleSelecionar = (id) => {
    if (id === planoAtivo) return;
    setConfirmando(id);
  };

  const confirmarAtivacao = async () => {
    if (!confirmando) return;
    setAtivando(true);
    setMensagem(null);

    try {
      // No MVP, ativação é simulada (sem pagamento real).
      // Em produção, aqui entraria integração com gateway de pagamento.
      if (confirmando !== 'free') {
        // Simula chamada para API que ativaria o plano
        if (usuario?.tipoUsuario === 'VENDEDOR') {
          await new Promise((r) => setTimeout(r, 800));
        }
      }

      // Atualiza estado do usuário
      atualizarUsuario({ plano: confirmando, premium: confirmando !== 'free' });

      // Se o usuário ativou destaque premium, ativa destaque em todos os anúncios dele
      if (confirmando !== 'free') {
        try {
          // Bônus: destacar automaticamente um anúncio (a mais recente) como exemplo
          // (em produção, seria destaque em todos)
        } catch (e) {
          // Silencioso: destaque é bônus, não impede a ativação
        }
      }

      setPlanoAtivo(confirmando);
      setConfirmando(null);
      const planoNome = PLANOS.find((p) => p.id === confirmando)?.nome;
      setMensagem({
        tipo: 'sucesso',
        texto: `Plano ${planoNome} ativado com sucesso! 🎉`,
      });
    } catch (e) {
      setMensagem({ tipo: 'erro', texto: e.message || 'Erro ao ativar plano.' });
    } finally {
      setAtivando(false);
    }
  };

  return (
    <main className="premium-page">
      <div className="container">
        <header className="premium-page__cabecalho">
          <span className="premium-page__tagline">⭐ Plano Premium</span>
          <h1>Destaque seus produtos e venda mais rápido</h1>
          <p>
            Escolha o plano ideal para o seu negócio. No MVP, a ativação é
            <strong> simulada </strong> — nenhum pagamento real será processado.
          </p>
        </header>

        {mensagem && (
          <div className={`premium-page__mensagem premium-page__mensagem--${mensagem.tipo}`} role="alert">
            {mensagem.texto}
          </div>
        )}

        <div className="premium-page__cards">
          {PLANOS.map((plano) => (
            <PlanoCard
              key={plano.id}
              plano={plano}
              onSelecionar={handleSelecionar}
              selecionado={planoAtivo === plano.id}
            />
          ))}
        </div>

        <section className="premium-page__faq">
          <h2>Perguntas frequentes</h2>
          <div className="premium-page__faq-grid">
            <div className="premium-page__faq-item">
              <strong>Como funciona o destaque?</strong>
              <p>Seus anúncios aparecem primeiro nas buscas e recebem um selo premium para chamar atenção dos compradores.</p>
            </div>
            <div className="premium-page__faq-item">
              <strong>Posso cancelar a qualquer momento?</strong>
              <p>Sim. No MVP a ativação é revertida manualmente pela área administrativa.</p>
            </div>
            <div className="premium-page__faq-item">
              <strong>O pagamento é processado agora?</strong>
              <p>Não. Esta é uma versão de demonstração (MVP). Nenhum pagamento real é efetuado.</p>
            </div>
            <div className="premium-page__faq-item">
              <strong>Tem fidelidade?</strong>
              <p>Não. Você pode voltar para o plano gratuito quando quiser.</p>
            </div>
          </div>
        </section>
      </div>

      <Modal
        aberto={Boolean(confirmando)}
        onFechar={() => setConfirmando(null)}
        titulo="Confirmar ativação"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmando(null)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={confirmarAtivacao} loading={ativando}>
              Sim, ativar
            </Button>
          </>
        }
      >
        <p>
          Você está ativando o plano{' '}
          <strong>{PLANOS.find((p) => p.id === confirmando)?.nome}</strong>.
          Esta ação será <em>simulada</em> (MVP) e aplicará os benefícios imediatamente.
        </p>
      </Modal>
    </main>
  );
}
