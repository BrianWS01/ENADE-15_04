# ENADE SaaS - Painel de Desempenho Acadêmico

Uma plataforma analítica avançada desenvolvida para acompanhar o desempenho institucional no ENADE, simulados e diagnósticos, voltada para Administradores e Professores.

## 🚀 Tecnologias e Stack Arquitetural

Este projeto foi construído sobre uma arquitetura limpa, escalável e *Server-Driven*.

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Banco de Dados**: [Prisma ORM](https://www.prisma.io/) (SQLite no desenvolvimento)
- **Autenticação**: [NextAuth.js (Auth.js)](https://next-auth.js.org/)
- **Segurança**: Criptografia Hash via `bcryptjs`
- **Ícones**: [Lucide React](https://lucide.dev/)

### Padrão Arquitetural
O projeto utiliza um padrão customizado **Service Layer + Adapter Pattern**:
- `app/`: Foca apenas em UI (React Server Components e Client Components).
- `services/`: Fachada que executa a regra de negócio e decide de onde vêm os dados.
- `adapters/`: Contém a lógica bruta (ex: Integração Prisma ou Mocks Locais).
- `types/`: Define estritamente os contratos de dados que o sistema utiliza.

---

## 🛠 Como Rodar Localmente (Desenvolvimento)

Siga os passos abaixo para preparar o ambiente de desenvolvimento.

### 1. Clonar o repositório e instalar dependências

```bash
git clone https://github.com/BrianWS01/ENADE-15_04.git
cd ENADE-15_04
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, tomando como base o arquivo `.env.example`:

```bash
cp .env.example .env
```
*(Verifique se `USE_MOCK=false` para habilitar a conexão com o banco)*.

### 3. Preparar Banco de Dados e Popular (Seed)

Rode as migrações para gerar as tabelas do banco SQLite e execute o seeder que criará os primeiros usuários (Admin e Professor).

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

**Usuários padrão criados no Seed:**
- **Admin** (Acesso total)
  - E-mail: `admin@enade.com`
  - Senha: `admin123`
- **Professor** (Acesso restrito a seus próprios dados)
  - E-mail: `professor@enade.com`
  - Senha: `prof123`

### 4. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🚀 Preparações para Deploy (Produção)

Este projeto está estruturalmente preparado para rodar em plataformas como **Vercel** ou **Render**.

### Atenção com o Banco de Dados (SQLite x PostgreSQL)
Durante o desenvolvimento, utilizamos **SQLite** pela facilidade. Porém, ambientes serverless como a Vercel possuem sistema de arquivos "read-only", o que significa que o SQLite de arquivos não salvará alterações na produção.
Para rodar este projeto online:
1. No arquivo `prisma/schema.prisma`, altere o provedor para PostgreSQL: `provider = "postgresql"`.
2. Mude a variável `DATABASE_URL` do `.env` apontando para o seu banco da Vercel Postgres ou Supabase.
3. Gere o banco online rodando `npx prisma db push`.

### Deploy na Vercel
1. Conecte sua conta GitHub na Vercel.
2. Defina as variáveis de ambiente essenciais (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).
3. (Opcional) Gere uma Hash segura para `NEXTAUTH_SECRET` através do terminal: `openssl rand -base64 32`.
4. Faça o deploy direto do painel. A Vercel entende Next.js e executará automaticamente o script de `build`.
