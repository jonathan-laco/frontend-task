## Task Manager Frontend

### Visão Geral

Este projeto é uma aplicação web frontend para gerenciamento de tarefas (Task Manager), desenvolvida com **React**, **TypeScript** e **Vite**. A aplicação permite aos usuários criar uma conta, fazer login e gerenciar suas tarefas diárias com funcionalidades completas de CRUD (Criar, Ler, Atualizar e Deletar).

---

### Funcionalidades

#### Autenticação de Usuários

- Registro de novos usuários
- Login com email e senha
- Sessões persistentes com cookies
- Proteção de rotas para usuários autenticados

#### Gerenciamento de Tarefas

- Listagem de tarefas com status visual (pendentes, concluídas, atrasadas)
- Criação de novas tarefas com título, descrição e data de vencimento
- Edição de tarefas existentes
- Exclusão de tarefas
- Marcação de tarefas como concluídas/pendentes

#### Interface Responsiva

- Design adaptável para desktop e dispositivos móveis
- Dashboard com estatísticas de tarefas
- Feedback visual para todas as operações

---

### Tecnologias Utilizadas

- **React** – Biblioteca para construção de interfaces
- **TypeScript** – Tipagem estática para JavaScript
- **Vite** – Build tool e dev server
- **React Router** – Navegação entre páginas
- **Tailwind CSS** – Framework CSS para estilização
- **Shadcn/UI** – Componentes UI baseados em Radix UI
- **Lucide React** – Biblioteca de ícones
- **date-fns** – Manipulação e formatação de datas
- **js-cookie** – Gerenciamento de cookies para autenticação

---

### Instalação e Execução

#### Pré-requisitos

- **Node.js**
- **npm**

#### Passos para instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/jonathan-laco/frontend-task
   cd task-manager-frontend
   ```
2. **Instale as dependências**
   ```bash
   npm install
   # ou
   bun install
   ```
3. **Configure as variáveis de ambiente**

   Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário.

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
5. **Acesse a aplicação**

   Abra [http://localhost:8080](http://localhost:8080) no seu navegador.

---

### Scripts Disponíveis

- `npm run dev` – Inicia o servidor de desenvolvimento
- `npm run build` – Cria uma versão otimizada para produção
- `npm run preview` – Visualiza a versão de produção localmente
- `npm run lint` – Executa verificações de linting no código

---

### API Backend

Esta aplicação frontend depende de uma API backend que pode ser encontrada em um repositório separado. A API deve estar rodando na URL especificada no arquivo `.env`.

---

Desenvolvido por Jonathan Laco
