# 📦 Sistema de Controle de Estoque

![GitHub repo size](https://img.shields.io/github/repo-size/KzRobertkz/controle_estoque_pratica)
![GitHub last commit](https://img.shields.io/github/last-commit/KzRobertkz/controle_estoque_pratica)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sistema Fullstack com **AdonisJS v6** no backend e **React + Tailwind + Vite** no frontend, ideal para controle simples de produtos, entradas e saídas de estoque. Um sistema prático para gestão de produtos, ideal para pequenos comércios ou fins educacionais.

---

## 🚀 Clone este repositório 👉([Passo a passo](#%EF%B8%8F-instalação-e-configuração))

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
| `AdonisJS`     | Backend principal            |
| `PostgreSQL`   | Banco de dados relacional    |
| `React`+`Vite` | Estrutura e visual           |
| `JavaScript`   | Funcionalidades no frontend  |
| `TailwindCSS`  | Estilização e responsividade |

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

### 🗄️ 2. Configuração do Banco de Dados PostgreSQL

#### Criando o banco de dados:

```sql
-- Conecte-se ao PostgreSQL como superusuário
psql -U postgres

-- Crie o banco de dados
CREATE DATABASE controle_estoque;

-- Crie um usuário específico (opcional)
CREATE USER estoque_user WITH ENCRYPTED PASSWORD 'sua_senha_aqui';

-- Conceda privilégios
GRANT ALL PRIVILEGES ON DATABASE controle_estoque TO estoque_user;

-- Saia do PostgreSQL
\q
```

### 🔧 3. Configuração do Backend (AdonisJS v6)

```bash
# Navegue para o diretório do backend
cd Back_End/adonis

# Instale as dependências
npm install
```

#### Configure o arquivo de environment (`.env`):

```bash
# Copie o arquivo de exemplo e cole no seu .env, se não tiver, pode simplesmente renomear o ".env.example" para ".env"
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Servidor
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY="cole sua chave aqui (O proximo passo mostrará como gerá-la)"

# Configurações do Banco PostgreSQL
NODE_ENV=development
DB_HOST=127.0.0.1 // Ou Localhost
DB_PORT=5432
DB_USER=Nome de Usuário do seu banco de Dados
DB_PASSWORD=Senha do Banco de Dados
DB_DATABASE=Nome Do seu Banco de Dados

```

#### Execute as migrations para criar as tabelas:

```bash
# Gerar uma chave de aplicação
node ace generate:key

# Executar as migrations
node ace migration:run
```
#### **Opcional:**

```bash

# (Opcional) Popular o banco com dados de exemplo
node ace db:seed
```

#### Caso a migration não rode corretamente:

```bash
# Gerar uma chave de aplicação
node ace migration:refresh

# Executar as migrations
node ace migration:run
```


#### Inicie o servidor backend:

```bash
# Modo desenvolvimento
node ace serve --watch

# Ou simplesmente
npm run dev
```

O backend estará rodando em: `http://localhost:3333`

### 💻 4. Configuração do Frontend (React + Vite)

Abra um novo terminal e navegue para o diretório do frontend:

```bash
# Navegue para o diretório do frontend
cd Front_End

# Instale as dependências
npm install
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

# Reverter última migration
node ace migration:rollback

# Criar nova migration
node ace make:migration nome_da_migration
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

---

## 📝 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [`LICENSE`](https://github.com/KzRobertkz/controle_estoque_pratica/blob/main/LICENSE) para mais informações.

---

## 👨‍💻 Desenvolvedor

Feito com ❤️ por [@KzRobertkz](https://github.com/KzRobertkz)

