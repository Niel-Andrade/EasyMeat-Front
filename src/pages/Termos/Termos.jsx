// ==========================================================
// EASY MEAT — Termos de Uso
// ==========================================================

import { Link } from 'react-router-dom';
import Logo from '../../components/Logo/Logo.jsx';
import './Termos.css';

export default function Termos() {
  return (
    <main className="doc-page">
      <header className="doc-page__cabecalho container">
        <Link to="/" className="doc-page__voltar">← Voltar para o início</Link>
        <Logo size="md" />
        <h1>Termos de Uso</h1>
        <p className="doc-page__atualizado">Última atualização: julho de 2026</p>
      </header>

      <article className="doc-page__conteudo container">
        <section>
          <h2>1. Aceitação dos termos</h2>
          <p>
            Ao criar uma conta ou utilizar qualquer funcionalidade da
            <strong> Easy Meat</strong>, você concorda com estes Termos de Uso
            e com a nossa Política de Privacidade. Caso não concorde com
            algum item, recomendamos que não utilize a plataforma.
          </p>
        </section>

        <section>
          <h2>2. Cadastro e responsabilidade do usuário</h2>
          <p>
            Para utilizar a plataforma você deve fornecer informações
            verdadeiras, completas e atualizadas no cadastro. Você é
            responsável por manter a confidencialidade da sua senha e por
            todas as ações realizadas na sua conta.
          </p>
          <p>
            Vendedores devem, ainda, fornecer CPF válido no momento do
            cadastro, sendo este um requisito de identificação.
          </p>
        </section>

        <section>
          <h2>3. Regras para anúncios</h2>
          <ul>
            <li>É proibido anunciar produtos de origem ilegal ou sem procedência comprovada.</li>
            <li>Anúncios devem conter informações verdadeiras sobre quantidade, preço e descrição.</li>
            <li>Imagens devem ser reais e corresponder ao produto anunciado.</li>
            <li>A Easy Meat pode remover anúncios que violem estas regras.</li>
          </ul>
        </section>

        <section>
          <h2>4. Planos e destaque</h2>
          <p>
            A plataforma oferece plano gratuito e planos pagos que concedem
            visibilidade adicional aos produtos anunciados. Os preços e
            benefícios de cada plano estão descritos na página
            <Link to="/premium"> Premium</Link>.
          </p>
          <p>
            Anúncios pagos são intercalados na listagem geral a cada três
            produtos regulares, garantindo visibilidade prioritária sem
            prejuízo da experiência dos demais vendedores.
          </p>
        </section>

        <section>
          <h2>5. Limitação de responsabilidade</h2>
          <p>
            A Easy Meat atua como intermediadora entre compradores e
            vendedores. <strong>Não somos responsáveis</strong> pela qualidade,
            entrega, pagamento ou qualquer desacordo comercial entre as
            partes. Toda negociação é realizada diretamente entre
            comprador e vendedor.
          </p>
        </section>

        <section>
          <h2>6. Suspensão e encerramento</h2>
          <p>
            Podemos suspender ou encerrar contas que violem estes Termos,
            prestem informações falsas ou pratiquem atos que prejudiquem
            outros usuários ou a plataforma.
          </p>
        </section>

        <section>
          <h2>7. Alterações destes termos</h2>
          <p>
            Estes Termos podem ser atualizados periodicamente. Avisaremos
            sobre mudanças relevantes pela plataforma ou por e-mail.
          </p>
        </section>

        <section>
          <h2>8. Contato</h2>
          <p>
            Em caso de dúvidas, fale com a nossa equipe:{' '}
            <a href="mailto:contato@easymeat.com">contato@easymeat.com</a>.
          </p>
        </section>
      </article>
    </main>
  );
}
