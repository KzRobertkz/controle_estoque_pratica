
# 📦 Sistema de Controle de Estoque

![GitHub repo size](https://img.shields.io/github/repo-size/KzRobertkz/controle_estoque_pratica)
![GitHub last commit](https://img.shields.io/github/last-commit/KzRobertkz/controle_estoque_pratica)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sistema Fullstack com **AdonisJS v6** no backend e **React + Tailwind + Vite** no frontend, ideal para controle simples de produtos, entradas e saídas de estoque. Um sistema prático para gestão de produtos, ideal para pequenos comércios ou fins educacionais.

---

## 🚀 Clone este repositório ([Passo a passo](#%EF%B8%8F-instalação-e-configuração))

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&duration=6000&pause=1000&color=6EB6F7&width=840&height=60&lines=%24+git+clone+https%3A%2F%2Fgithub.com%2FKzRobertkz%2Fcontrole_estoque_pratica.git)](https://kzrobertkz.github.io/Dev_links/)

```bash
git clone https://github.com/KzRobertkz/controle_estoque_pratica.git
```

---

## 📸 Demonstração

![Demonstração do Sistema](https://raw.githubusercontent.com/KzRobertkz/controle_estoque_pratica/main/assets/demo.gif)

---

## 📋 Funcionalidades

* ✅ Cadastro de produtos
* ✅ Controle de entrada e saída de estoque
* ✅ Relatório de estoque atual
* ✅ Alerta para estoque mínimo
* ✅ Histórico de movimentações

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia     | Descrição                    |
| -------------- | ---------------------------- | 
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/adonisjs/adonisjs-original.svg" width="25" height="25" style="vertical-align: middle" /> &nbsp;`AdonisJS`          | Backend principal            |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" width="25" height="25" style="vertical-align: middle"/> &nbsp;`PostgreSQL`     | Banco de dados relacional    |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="25" height="25" style="vertical-align: middle"/> &nbsp;`React`                    | Estrutura e visual           |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="25" height="25" style="vertical-align: middle"/> &nbsp;`Vite`                   | Build tool e bundler         |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="25" height="25" style="vertical-align: middle"/> &nbsp;`JavaScript`     | Funcionalidades no frontend  |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="25" height="25" style="vertical-align: middle"/> &nbsp;`TailwindCSS`  | Estilização e responsividade |

---

## ⚙️ Instalação e Configuração

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **PostgreSQL** (versão 12 ou superior)
- **Git**

### 🔽 1. Clone o Repositório

```bash
git clone https://github.com/KzRobertkz/controle_estoque_pratica.git
cd controle_estoque_pratica
```

### 🗄️ 2. Configuração do Banco de Dados PostgreSQL (Se você não tem um banco configurado)

> **📝 Nota**: Se você já possui um banco PostgreSQL configurado e funcionando, pule para o **[Passo 3](#-3-configura%C3%A7%C3%A3o-do-backend-adonisjs-v6)**. Apenas certifique-se de ter as credenciais de acesso (usuário, senha, nome do banco).

#### Onde executar os comandos PostgreSQL:

Os comandos SQL abaixo devem ser executados no **terminal/prompt de comando** do seu PostgreSQL:

**🐧 Linux/Mac:**
```bash
# Abra o terminal e execute:
sudo -u postgres psql
```

**<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows11/windows11-original.svg" width="13" height="13" /> &nbsp;Windows:**
- Abra o **SQL Shell (psql)** que foi instalado junto com o PostgreSQL
- Ou use o **pgAdmin** (interface gráfica)
- Ou abra o **Command Prompt** e digite: `psql -U postgres`

#### Criando o banco de dados:

```sql
-- 1. Conecte-se ao PostgreSQL (você já estará conectado se seguiu os passos acima)

-- 2. Crie o banco de dados
CREATE DATABASE controle_estoque;

-- 3. Crie um usuário específico (RECOMENDADO para segurança)
CREATE USER estoque_user WITH ENCRYPTED PASSWORD 'sua_senha_forte_aqui';

-- 4. Conceda privilégios ao usuário
GRANT ALL PRIVILEGES ON DATABASE controle_estoque TO estoque_user;

-- 5. Conecte ao banco criado para dar permissões adicionais
\c controle_estoque;

-- 6. Conceda permissões no schema public
GRANT ALL ON SCHEMA public TO estoque_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO estoque_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO estoque_user;

-- 7. Saia do PostgreSQL
\q
```

**⚠️ Importante**: Anote as credenciais que você criou:

Exemplo:
- **Banco**: `controle_estoque`
- **Usuário**: `estoque_user` 
- **Senha**: `sua_senha_forte_aqui`

### 🔧 3. Configuração do Backend (AdonisJS v6)

```bash
# Navegue para o diretório do backend
cd backend

# Instale as dependências
npm install
```

#### Configure o arquivo de environment:

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Servidor
PORT=3333
HOST=localhost
NODE_ENV=development
APP_KEY=your-secure-app-key-here

# Configurações do Banco PostgreSQL
DB_CONNECTION=pg
PG_HOST=localhost
PG_PORT=5432
PG_USER=estoque_user
PG_PASSWORD=sua_senha_aqui
PG_DB_NAME=controle_estoque

# CORS (para comunicação com o frontend)
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:5173
```

#### Execute as migrations para criar as tabelas:

```bash
# Gerar uma chave de aplicação
node ace generate:key

# Executar as migrations
node ace migration:run

# (Opcional) Popular o banco com dados de exemplo
node ace db:seed
```

#### Inicie o servidor backend:

```bash
# Modo desenvolvimento (com auto-reload)
node ace serve --watch

# Ou simplesmente
npm run dev
```

O backend estará rodando em: `http://localhost:3333`

### 💻 4. Configuração do Frontend (React + Vite)

Abra um novo terminal e navegue para o diretório do frontend:

```bash
# Navegue para o diretório do frontend
cd frontend

# Instale as dependências
npm install
```

#### Configure o arquivo de environment do frontend:

```bash
# Crie o arquivo .env na raiz do diretório frontend
touch .env
```

Adicione as configurações no arquivo `.env`:

```env
# URL da API backend
VITE_API_URL=http://localhost:3333

# Outras configurações (opcional)
VITE_APP_NAME="Sistema de Controle de Estoque"
```

#### Inicie o servidor frontend:

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

### 🚀 5. Verificação da Instalação

1. **Backend**: Acesse `http://localhost:3333/health` - deve retornar um JSON com status "ok"
2. **Frontend**: Acesse `http://localhost:5173` - deve exibir a interface do sistema
3. **Conexão**: Teste o cadastro de um produto para verificar se frontend e backend estão se comunicando

### 🔍 6. Comandos Úteis

#### Backend (AdonisJS):
```bash
# Ver rotas disponíveis
node ace list:routes

# Executar migrations
node ace migration:run

# Reverter última migration
node ace migration:rollback

# Criar nova migration
node ace make:migration nome_da_migration

# Popular banco com dados de exemplo
node ace db:seed
```

#### Frontend (React + Vite):
```bash
# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executar linter
npm run lint
```

### 🐛 Solução de Problemas Comuns

#### Erro de conexão com PostgreSQL:
- Verifique se o PostgreSQL está rodando: `sudo service postgresql status`
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -h localhost -U estoque_user -d controle_estoque`

#### Erro de CORS:
- Verifique se `CORS_ORIGIN` no backend está configurado corretamente
- Certifique-se de que as portas estão corretas

#### Porta já em uso:
```bash
# Matar processo na porta 3333 (backend)
sudo lsof -ti:3333 | xargs kill -9

# Matar processo na porta 5173 (frontend)
sudo lsof -ti:5173 | xargs kill -9
```

---

## 🔗 Links Úteis

- [Documentação AdonisJS](https://docs.adonisjs.com/)
- [Documentação Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Página de links úteis do projeto](https://kzrobertkz.github.io/Dev_links/)

---

## 🧪 Demonstração

🔗 [Página com links úteis](https://kzrobertkz.github.io/Dev_links/)

---

## 📝 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [`LICENSE`](https://github.com/KzRobertkz/controle_estoque_pratica/blob/main/LICENSE) para mais informações.

---

## 👨‍💻 Desenvolvedor

Feito com ❤️ por [@KzRobertkz](https://github.com/KzRobertkz)

