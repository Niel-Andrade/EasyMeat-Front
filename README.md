# 🐂 Easy Meat — Front-End

Plataforma B2B para comercialização de carnes. Conecta produtores (vendedores) e compradores institucionais, com foco em agronegócio + tecnologia.

## 🚀 Stack

- **React.js 18** (componentes funcionais + hooks)
- **React Router DOM v6** (rotas)
- **Context API** (autenticação)
- **Fetch API** com `credentials: "include"` (autenticação por cookie httpOnly)
- **CSS puro** (Design System próprio — sem Bootstrap/Material UI)
- **Vite** (build e dev server)

## 📁 Estrutura

```
src/
├── assets/         Imagens e ícones
├── components/     Componentes reutilizáveis (Button, Input, ProductCard...)
├── pages/          Telas completas (rotas)
├── services/       Única camada que faz fetch (api, auth, anuncios, usuarios, banners)
├── routes/         Definição das rotas e guardas privadas
├── context/        AuthContext (estado global de autenticação)
├── hooks/          Hooks customizados (useAuth, useForm, useFetch)
├── utils/          Validadores, formatadores e constantes
└── styles/         Design System (variables.css + global.css)
```

## ⚙️ Instalação

```bash
npm install
```

## 🛠️ Configurar URL da API

Edite `src/services/api.js`:

```javascript
const API_URL = "http://localhost:4000"; // ambiente local
// const API_URL = "https://api.easymeat.com"; // produção
```

## ▶️ Rodar dev server

```bash
npm run dev
```

Acesse: http://localhost:5173

## 🏗️ Build de produção

```bash
npm run build
npm run preview
```

## 📋 Endpoints esperados do back-end

Veja `src/services/api.js` e os arquivos da pasta `services/` para a lista completa.

Resumo:
- `POST /auth/register` — cadastro
- `POST /auth/login` — login
- `POST /auth/logout` — logout
- `GET /auth/me` — usuário atual
- `POST /auth/recuperar-senha` — solicitar recuperação
- `POST /auth/redefinir-senha` — redefinir com token
- `GET /usuarios/perfil` — meu perfil
- `PUT /usuarios/perfil` — atualizar perfil
- `PUT /usuarios/perfil/senha` — alterar senha
- `GET/PUT /usuarios/perfil/foto` — upload de foto
- `GET /anuncios` — listar (com filtros via query)
- `GET /anuncios/destaques` — destaques
- `GET/POST/PUT/DELETE /anuncios[/:id]` — CRUD
- `PUT /anuncios/:id/destaque` — ativar destaque
- `GET /usuarios/anuncios` — meus anúncios
- `GET/POST/PUT/DELETE /admin/banners[/:id]` — gestão de banners (admin)
- `GET /admin/usuarios` — gestão de usuários (admin)
- `PUT /admin/usuarios/:id/status` — bloquear (admin)

Todas as requisições usam `credentials: "include"` (cookie httpOnly).
