# Easy Meat — Front-End

Interface web da plataforma **Easy Meat**, um marketplace B2B para comercialização de carnes que conecta produtores (vendedores) e compradores institucionais.

> Este é o front-end da aplicação. Ele **depende do back-end** (`easy-meat-backend`) para funcionar — configure e suba o back-end primeiro. Veja as instruções no README do back-end.

---

## 🚀 Stack

- **React 18** (componentes funcionais + hooks)
- **React Router DOM 6** (rotas)
- **Context API** (autenticação global — `AuthContext`)
- **Fetch API** com `credentials: "include"` (autenticação por cookie httpOnly)
- **Vite 5** (dev server e build)
- **CSS puro** (Design System próprio, sem Bootstrap/Material UI)

---

## 📁 Estrutura

```
src/
├── assets/         Imagens e ícones
├── components/     Componentes reutilizáveis (Button, Input, Select, ProductCard...)
├── pages/          Telas completas (rotas)
├── services/       Única camada que faz fetch (api, auth, anuncios, usuarios, banners, cep)
├── routes/         Definição das rotas e guardas privadas
├── context/        AuthContext (estado global de autenticação)
├── hooks/          Hooks customizados (useAuth, useForm, useFetch)
├── utils/          Validadores, formatadores e constantes
└── styles/         Design System (variables.css + global.css)
```

---

## 🧰 Pré-requisitos (primeira vez)

| Ferramenta | Versão | Verificação |
|---|---|---|
| **Node.js** | 18 ou superior | `node -v` |
| **npm** | 9 ou superior (vem com o Node) | `npm -v` |

Não é necessário banco de dados nem PostgreSQL neste projeto — apenas no back-end.

---

## ⚙️ Instalação (primeira vez)

### 1. Clonar o repositório e entrar na pasta

```bash
git clone <url-do-repositorio>
cd easy-meat-front
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e crie o seu `.env`:

```bash
# Windows (cmd)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```

Variável disponível (arquivo `.env.example`):

```env
VITE_API_URL=http://localhost:4000
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_API_URL` | Sim | URL base da API do back-end. Em desenvolvimento: `http://localhost:4000` |

> Se o back-end estiver rodando em outra porta ou máquina, ajuste `VITE_API_URL` — **após alterar o `.env`, reinicie o servidor Vite** para a variável ser recarregada.

### 4. Rodar o projeto

⚠️ **Ordem correta: o back-end deve estar rodando antes do front.**

```bash
npm run dev
```

✅ A aplicação abre em **http://localhost:5173**

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento (Vite) na porta **5173** |
| `npm run build` | Gera o build de produção na pasta `dist/` |
| `npm run preview` | Serve o build de produção localmente para teste |

---

## 🔗 Conexão com o back-end

- Todas as chamadas HTTP passam pela camada central `src/services/api.js`, que usa `VITE_API_URL` como base e envia cookies com `credentials: "include"` (a sessão é um cookie httpOnly emitido pelo back-end).
- O `vite.config.js` também possui um **proxy** de `/api` → `http://localhost:4000` no servidor de desenvolvimento.
- O back-end libera CORS **apenas** para a origem configurada em `CLIENTE_URL` (padrão: `http://localhost:5173`) — mantenha essa porta ao rodar localmente.

### Ordem de inicialização

1. **PostgreSQL** rodando
2. **Back-end**: `npm run dev` dentro de `easy-meat-backend` (porta **4000**)
3. **Front-end**: `npm run dev` dentro de `easy-meat-front` (porta **5173**)

---

## 🩺 Solução de problemas

| Problema | Causa provável | Solução |
|---|---|---|
| Página carrega mas não traz dados | Back-end não está rodando | Suba o back-end primeiro (veja o README do back-end) |
| Erro de CORS no console | `CLIENTE_URL` do back-end não bate com a porta do front | Mantenha o front na porta 5173 ou ajuste `CLIENTE_URL` no `.env` do back-end |
| Requisições indo para a URL errada | `VITE_API_URL` incorreta ou `.env` alterado sem reiniciar | Corrija o `.env` e reinicie o `npm run dev` |
| Erro de build (`npm run build`) | Versão antiga do Node | Atualize para Node 18+ |
| Login não mantém sessão | Cookies bloqueados pelo navegador | Verifique se o navegador aceita cookies de `localhost` |

---

## 👤 Autor / Projeto

Projeto Easy Meat — plataforma B2B de comercialização de carnes (agronegócio + tecnologia).
Autores: José Nataniel e Ryan Victor
