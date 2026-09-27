// ==========================================================
// EASY MEAT — Política de Privacidade
// ==========================================================

import { Link } from 'react-router-dom';
import Logo from '../../components/Logo/Logo.jsx';
import './Privacidade.css';

export default function Privacidade() {
  return (
    <main className="doc-page">
      <header className="doc-page__cabecalho container">
        <Link to="/" className="doc-page__voltar">← Voltar para o início</Link>
        <Logo size="md" />
        <h1>Política de Privacidade</h1>
        <p className="doc-page__atualizado">Última atualização: julho de 2026</p>
      </header>

      <article className="doc-page__conteudo container">
        <section>
          <h2>1. Introdução</h2>
          <p>
            A <strong>Easy Meat</strong> valoriza a privacidade dos seus
            usuários. Esta política descreve quais dados coletamos, como
            utilizamos e como protegemos suas informações pessoais, em
            conformidade com a Lei Geral de Proteção de Dados (LGPD).
          </p>
        </section>

        <section>
          <h2>2. Dados que coletamos</h2>
          <ul>
            <li>
              <strong>Cadastro:</strong> nome, e-mail, telefone, cidade, estado
              e CPF (somente para vendedores).
            </li>
            <li>
              <strong>Uso da plataforma:</strong> endereço IP, navegador,
              páginas visitadas e horários de acesso (logs).
            </li>
            <li>
              <strong>Anúncios:</strong> título, descrição, preço, quantidade,
              cidade, estado e imagens publicadas.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Como utilizamos seus dados</h2>
          <ul>
            <li>Identificar e autenticar você na plataforma.</li>
            <li>Permitir a publicação e visualização de anúncios.</li>
            <li>Facilitar o contato entre compradores e vendedores.</li>
            <li>Cumprir obrigações legais e de segurança.</li>
            <li>Melhorar continuamente a plataforma.</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartilhamento</h2>
          <p>
            <strong>Não vendemos</strong> seus dados pessoais. As informações
            publicadas nos anúncios (como nome do vendedor e telefone) são
            visíveis para outros usuários como parte do funcionamento da
            plataforma.
          </p>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            Utilizamos um cookie httpOnly para manter sua sessão
            autenticada de forma segura. Esse cookie não contém
            informações pessoais legíveis por JavaScript e é essencial para
            o funcionamento da plataforma.
          </p>
        </section>

        <section>
          <h2>6. Armazenamento e segurança</h2>
          <p>
            Suas senhas são armazenadas com criptografia <code>bcrypt</code>.
            Dados ficam em servidores com acesso restrito e backups
            periódicos.
          </p>
        </section>

        <section>
          <h2>7. Seus direitos (LGPD)</h2>
          <ul>
            <li>Acessar e atualizar seus dados pessoais.</li>
            <li>Solicitar exclusão da conta e dos dados.</li>
            <li>Revogar consentimentos previamente dados.</li>
            <li>Obter informações sobre o tratamento dos seus dados.</li>
          </ul>
        </section>

        <section>
          <h2>8. Contato do encarregado (DPO)</h2>
          <p>
            Para exercer seus direitos ou esclarecer dúvidas sobre
            privacidade:{' '}
            <a href="mailto:privacidade@easymeat.com">privacidade@easymeat.com</a>.
          </p>
        </section>

        <section>
          <h2>9. Alterações desta política</h2>
          <p>
            Esta Política pode ser atualizada para refletir mudanças na
            plataforma ou na legislação. Avisaremos sobre alterações por
            e-mail ou aviso na plataforma.
          </p>
          <p>
            Veja também nossos{' '}
            <Link to="/termos">Termos de Uso</Link>.
          </p>
        </section>
      </article>
    </main>
  );
}
