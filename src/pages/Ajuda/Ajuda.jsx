// ==========================================================
// EASY MEAT — Central de Ajuda (FAQ)
// ==========================================================

import { useState } from 'react';
import Logo from '../../components/Logo/Logo.jsx';
import './Ajuda.css';

const PERGUNTAS = [
  {
    categoria: 'Cadastro',
    itens: [
      {
        q: 'Como faço para criar uma conta na Easy Meat?',
        a: 'Clique em "Criar conta" no topo da página, preencha seus dados (nome, e-mail, telefone, cidade e estado) e escolha entre ser comprador ou vendedor. O cadastro é gratuito e leva menos de um minuto.',
      },
      {
        q: 'Posso alterar meu tipo de usuário depois?',
        a: 'Sim. A qualquer momento você pode anunciar produtos na plataforma — mas para ter uma experiência otimizada, recomendamos que vendedores façam o cadastro usando essa opção logo de início.',
      },
      {
        q: 'Esqueci minha senha. Como recupero?',
        a: 'Na tela de login, clique em "Esqueci minha senha". Informe o e-mail cadastrado e você receberá um link para redefinir sua senha com segurança.',
      },
    ],
  },
  {
    categoria: 'Anúncios',
    itens: [
      {
        q: 'Como publicar um anúncio?',
        a: 'Após fazer login como vendedor, vá em "Meus anúncios" → "Novo anúncio". Preencha as informações do produto, adicione até 8 fotos e clique em Publicar.',
      },
      {
        q: 'Quantas imagens posso adicionar?',
        a: 'É possível adicionar até 8 imagens por anúncio, em formato JPG ou PNG, com tamanho máximo de 5 MB cada.',
      },
      {
        q: 'Posso editar um anúncio depois de publicar?',
        a: 'Sim. Acesse "Meus anúncios", localize o produto que deseja alterar e clique em "Editar".',
      },
      {
        q: 'Como ativo o destaque pago?',
        a: 'Na página de edição do anúncio, marque a opção "Marcar como destaque" e conclua. Os anúncios em destaque aparecem no topo da listagem de produtos.',
      },
    ],
  },
  {
    categoria: 'Compra e contato',
    itens: [
      {
        q: 'Como entro em contato com o vendedor?',
        a: 'Na página do produto você encontra o telefone do anunciante. A Easy Meat também exibe dados do vendedor para facilitar a negociação direta.',
      },
      {
        q: 'A Easy Meat realiza a entrega?',
        a: 'Não intermediamos entregas. O contato e a logística são feitos diretamente entre comprador e vendedor, conforme combinado entre as partes.',
      },
    ],
  },
  {
    categoria: 'Conta e segurança',
    itens: [
      {
        q: 'Meus dados estão seguros?',
        a: 'Sim. Utilizamos autenticação por cookie httpOnly, criptografia de senha (bcrypt), e nunca compartilhamos seus dados sem autorização. Veja nossa Política de Privacidade.',
      },
      {
        q: 'Como excluo minha conta?',
        a: 'Entre em contato com nosso suporte pelo e-mail contato@easymeat.com solicitando a exclusão. Após confirmação, todos os seus dados pessoais são removidos.',
      },
    ],
  },
];

export default function Ajuda() {
  const [aberto, setAberto] = useState(null);

  const toggle = (id) => setAberto((atual) => (atual === id ? null : id));

  return (
    <main className="ajuda-page">
      <section className="ajuda-hero">
        <div className="container">
          <Logo size="lg" />
          <h1>Central de Ajuda</h1>
          <p>
            Encontre respostas rápidas para as dúvidas mais comuns sobre a
            plataforma Easy Meat.
          </p>
        </div>
      </section>

      <section className="ajuda-conteudo container">
        {PERGUNTAS.map((bloco) => (
          <div className="ajuda-bloco" key={bloco.categoria}>
            <h2>{bloco.categoria}</h2>
            <ul className="ajuda-lista">
              {bloco.itens.map((item, idx) => {
                const id = `${bloco.categoria}-${idx}`;
                const isOpen = aberto === id;
                return (
                  <li key={id} className={`ajuda-item ${isOpen ? 'ajuda-item--aberto' : ''}`}>
                    <button
                      className="ajuda-item__pergunta"
                      onClick={() => toggle(id)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <span className="ajuda-item__icone" aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="ajuda-item__resposta">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="ajuda-contato">
          <h2>Não encontrou o que procurava?</h2>
          <p>
            Nossa equipe responde em até <strong>24h úteis</strong> pelo e-mail:
          </p>
          <a href="mailto:contato@easymeat.com" className="btn btn--primary btn--md">
            ✉️ contato@easymeat.com
          </a>
        </div>
      </section>
    </main>
  );
}
