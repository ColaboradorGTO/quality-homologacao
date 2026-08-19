# Projeto Quality Web

# CLAUDE.md


This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev       # inicia o Vite dev server (http://localhost:6001, ver vite.config.js)
npm run build     # build de produção para dist/
npm run preview   # serve o build de produção localmente
npm run lint      # eslint . --ext js,jsx --max-warnings 0
npm run server    # json-server --watch allUsers.json --port 3001 (mock server, não é o backend real)
```

Não há suíte de testes configurada (sem Jest/Vitest/RTL no `package.json`).

O backend real é o projeto Node/Express irmão em `../api` (fora desta pasta `web/`). Em dev, o frontend aponta para `http://localhost:6001` — ver `src/api/api.js`.

## Arquitetura

### Stack
React 18 + Vite, React Router v6, **react-query v3** (não TanStack Query v4/v5 — a API é a antiga), PrimeReact + React-Bootstrap para UI, SweetAlert2 para alertas/confirmações, Yup + react-hook-form para formulários.

### Autenticação
- Login via `POST /login` (`src/Providers/AuthContext/index.jsx`), token JWT salvo em `localStorage` (`token`, `usuario`).
- **Não há um interceptor axios central de auth.** Cada função em `src/api/funcRequest.js` (`get`, `put`, `deleteRequest`) lê `localStorage.getItem('token')` e monta o header `Authorization` manualmente. `post` é a exceção — não injeta token.
- Proteção de rota é inconsistente: a maioria das rotas em `src/routes/Routes.jsx` é pública (`element={<DashBoardX .../>}`); só algumas (`/modulo`, `/DashBoardExpedicao`, `/DashBoardConferenciaCega`) checam `usuarioLogado` inline com `Navigate`. Existe um componente `PrivateRoute` (`src/routes/PrivateRoute.jsx`) mas ele não está em uso nas rotas atuais — ao adicionar proteção a uma rota nova, decida se reaproveita `PrivateRoute` ou segue o padrão inline existente, mas não assuma que todas as rotas já são protegidas.

### Estrutura de pastas (`src/`)
- `api/` — cliente axios (`api.js`) e wrappers de request (`funcRequest.js`: `get`, `post`, `put`, `deleteRequest`).
- `pages/` — um `DashBoardXxx.jsx` por módulo de negócio (Financeiro, Administrativo, Compras, RH, etc.), montados como rotas top-level. Cada dashboard é a casca (header, sidebar, footer) do módulo.
- `componets/` (sic — grafia usada em todo o projeto, não corrigir para "components") — organizado por domínio de negócio (`Financeiro/`, `Compras/`, `RH/`, `Cadastro/`, etc.), e dentro de cada domínio por `Components/<Feature>/`. Também contém componentes genéricos de UI: `Buttons/`, `Inputs/`, `Modais/`, `Select/`, `Tables/`, `Sidebar/`, `Header/`, `Footer/`.
- `Providers/` — Context API (`AuthContext`, `AuthContextSwal`, `selectedModule`).
- `routes/` — definição de rotas (`Routes.jsx` é a ativa; `Routess.jsx` parece um arquivo órfão/backup — confirmar antes de editar um dos dois).
- `utils/` — funções puras de formatação/validação (datas, moeda, CPF/CNPJ, máscaras, etc.), sem dependências de componente.
- `hooks/` — hooks customizados pontuais (não há muitos; a maior parte da lógica de fetch fica em `react-query` direto dentro dos componentes de Action).

### Padrão de "dashboard + componentToShow"
Cada `DashBoardXxx` **não** usa sub-rotas do React Router para navegar entre telas internas do módulo. Em vez disso:
1. O dashboard guarda `componentToShow` (state) e `handleShowComponent(nome)` para trocá-lo.
2. O menu lateral (`Sidebar`) chama `handleShowComponent` com o nome/URL do item clicado, que é resolvido contra `selectedModule.menuPai.menuFilho` (vindo de `localStorage.getItem('moduloselecionado')`).
3. O dashboard faz `switch`/lookup de `componentToShow` para renderizar o componente de "Action" correspondente, lazy-carregado no topo do arquivo.

Ao adicionar uma nova tela a um módulo existente, siga esse padrão: crie o componente em `componets/<Domínio>/Components/<Feature>/action*.jsx`, importe-o com `lazy()` no `DashBoardXxx.jsx` correspondente, e ligue-o ao `componentToShow`.

### Nomenclatura de componentes de tela ("Actions")
A maioria das telas de CRUD/pesquisa segue o padrão `action` + nome (ex.: `actionPesquisaVendasLoja.jsx`, `actionListaPedidoCompra.jsx`), exportado como named export (não default). Cada feature tem sua própria pasta em `Components/<Feature>/` dentro do domínio, geralmente com uma tela de "pesquisa/lista" e, quando aplicável, uma tela de "lista" separada.

### Chamadas HTTP
Sempre via `src/api/funcRequest.js` (`get`, `post`, `put`, `deleteRequest`), nunca `axios` direto nos componentes. Fetch de dados usa `react-query` (`useQuery`) — não `useEffect` + `useState` manual para GET (exceção: leituras simples de `localStorage`, que são feitas diretamente).

### Convenções observadas
- Import de `React` explícito no topo de todo arquivo `.jsx` (projeto usa o JSX runtime clássico, não o automático).
- Rotas e páginas usam `lazy()` + `Suspense` para code-splitting; ao criar uma página/dashboard nova, mantenha esse padrão em vez de import estático.
- Alertas e confirmações via `sweetalert2` (`Swal.fire`), não `alert()`/`window.confirm`.
- `vite.config.js` já define `manualChunks` para vendor/router/query/primereact/utils — bibliotecas grandes novas devem ser avaliadas para entrar nesse split.

### Arquivos a ignorar/tratar com cautela
- `funcoes.jsx`, `funcoes copy.jsx`, `mecanica.jsx`, `verificaMecanica.jsx` na raiz de `web/` parecem scripts/rascunhos soltos fora de `src/` — não são importados pela árvore de rotas; confirmar antes de assumir que estão em uso.
- `src/routes/Routess.jsx` (com dois "s") coexiste com `Routes.jsx` — a importada em `App.jsx` é `Routes.jsx`.
