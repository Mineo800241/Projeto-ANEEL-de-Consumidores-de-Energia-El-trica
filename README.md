# ⚡ Sistema de Gestão de Consumidores de Energia Elétrica

![React](https://shields.io)
![Vite](https://shields.io)
![React Router](https://shields.io)
![React Query](https://shields.io)
![Material UI](https://shields.io)
![AG Grid](https://shields.io)

Aplicação web **Single Page Application (SPA)** desenvolvida em **React** para o gerenciamento completo (**CRUD**) de unidades consumidoras de energia elétrica. O sistema contempla regras de negócio da rede de distribuição (vinculação por transformador, medidor e status de ligação booleano), controle de acesso com rotas privadas, cache reativo e proteção contra *race conditions*.

---

## 🚀 Funcionalidades Principais

* **CRUD Completo de Consumidores:** Cadastro, listagem, visualização detalhada, edição e exclusão de unidades consumidoras.
* **Controle Booleano de Ligação (`true` / `false`):** Identificação visual do status da conta com filtro dedicado e botão de alternância rápida (**Ligar / Desligar**) em 1 clique.
* **Agrupamento por Transformador:** Relatório dinâmico que reúne todas as unidades ativas (`ligada === true`) conectadas a um mesmo transformador (`TR-101`, `TR-102`, etc.) com busca instantânea.
* **Tabela Corporativa (AG Grid):** Ordenação por colunas, filtros internos, paginação configurável e células interativas com componentes Material UI.
* **Dashboard de Indicadores:** Contadores em tempo real do total de UCs, contas ligadas, contas desligadas e transformadores ativos.
* **Autenticação e Rotas Privadas:** Proteção das áreas administrativas (`/admin`, `/novo`, `/editar/:id`) com redirecionamento inteligente pós-login.
* **Resiliência Assíncrona:** Integração via **Fetch API** e **React Query**, com tratamento semântico de erros HTTP e prevenção de *race conditions* usando **`Promise.race`** e **`AbortController`**.

---

## 🛠️ Stack Tecnológica

* **Core:** React, Vite, JavaScript (ES6+ com *Arrow Functions*, *Destructuring*, *Spread/Rest*, *Template Literals* e *Promises*).
* **Roteamento:** `react-router-dom` (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `Navigate`).
* **Estado Global e Cache:** Context API (`ConsumidoresContext` e `AuthContext`), Custom Hooks (`useLocalStorage`) e `@tanstack/react-query` (`useQuery`, `useMutation`).
* **Interface e Dados:** `@mui/material`, `ag-grid-react` e variáveis CSS customizadas.
* **API Mock Local:** `json-server` para persistência REST real em arquivo `db.json`.

---

## 📂 Arquitetura do Projeto

```text
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx                  # Botão reutilizável com variantes
│   │   ├── FormField.jsx               # Campo dinâmico de formulário
│   │   ├── GenericForm.jsx             # Formulário genérico orientado a schema
│   │   └── DataTable.jsx               # Tabela interativa com AG Grid + Material UI
│   ├── Navbar.jsx                      # Barra de navegação superior (AppBar)
│   ├── PrivateRoute.jsx                # Guardião de autenticação para rotas privadas
│   ├── RelatorioTransformador.jsx      # Agrupamento de unidades ligadas por trafo
│   └── ResumoEnergia.jsx               # Painel de indicadores em tempo real
├── context/
│   ├── AuthContext.jsx                 # Gerenciamento de sessão (Login/Logout)
│   └── ConsumidoresContext.jsx         # Estado global, React Query e AbortController
├── hooks/
│   └── useLocalStorage.js              # Custom Hook de persistência no navegador
├── pages/
│   ├── AdminPage.jsx                   # Painel administrativo protegido
│   ├── DetalhesConsumidorPage.jsx      # Ficha técnica individual (/detalhes/:id)
│   ├── FormularioConsumidorPage.jsx    # Tela de cadastro (/novo) e edição (/editar/:id)
│   ├── ListaConsumidoresPage.jsx       # Listagem principal com filtros e AG Grid
│   ├── LoginPage.jsx                   # Autenticação de operadores
│   └── TransformadoresPage.jsx         # Relatório por transformador
├── services/
│   └── consumidorApi.js                # Cliente Fetch API + Promise.race + AbortController
├── utils/
│   └── consumidorUtils.js              # Constantes, schemas e funções puras
├── App.jsx                             # Configuração de rotas e notificações
├── App.css                             # Estilização customizada e variáveis CSS
└── main.jsx                            # Providers raiz (QueryClient e ThemeProvider)
```

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* **npm**

### Passo 1: Clonar o repositório e instalar dependências
```bash
git clone https://github.com
cd controle-energia
npm install
```

### Passo 2: Iniciar a API REST local (`json-server`)
Em um terminal dentro da pasta do projeto, execute:
```bash
npx json-server --watch db.json --port 3001
```

### Passo 3: Iniciar o servidor front-end (Vite)
Em um **segundo terminal**, execute:
```bash
npm run dev
```
Acesse **`http://localhost:5173`** no navegador.

---

## 🔐 Rotas e Credenciais de Acesso

### Mapa de Rotas
* **Públicas:** `/` (Lista), `/detalhes/:id` (Ficha Técnica), `/transformadores` (Relatório), `/login`
* **Privadas (Requerem Login):** `/admin` (Painel Administrativo), `/novo` (Cadastro), `/editar/:id` (Edição)

### Credenciais de Demonstração
* **E-mail:** `admin@energia.com`
* **Senha:** `123456`

