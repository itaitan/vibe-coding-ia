# DevFinance

## Descrição
Dashboard de finanças pessoais onde o usuário registra receitas e despesas, visualiza gráficos de gastos por categoria e evolução mensal, e recebe análises inteligentes dos seus gastos via IA.

## Stack
- Next.js 14 com App Router
- PostgreSQL
- Prisma
- NextAuth.js
- Claude API
- Tailwind
- shadcn/ui

## Banco de dados (Prisma + PostgreSQL)
- **User**: email, senha hasheada com bcrypt, nome
- **Transaction**: valor em centavos (integer), tipo (receita/despesa), descrição, data, referência ao usuário e categoria
- **Category**: nome, cor, ícone (emoji), referência ao usuário (cada usuário tem suas próprias categorias)
  - Categorias padrão criadas no cadastro: Alimentação, Transporte, Lazer, Saúde, Moradia, Salário, Freelance

### Schema Final do Prisma
```prisma
model User {
  id            String        @id @default(cuid())
  name          String?
  email         String        @unique
  password      String
  transactions  Transaction[]
  categories    Category[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Category {
  id           String        @id @default(cuid())
  name         String
  color        String
  icon         String
  userId       String
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@unique([name, userId])
}

model Transaction {
  id          String   @id @default(cuid())
  amount      Int      // Value in cents as requested
  type        String   // "RECEITA" | "DESPESA"
  description String
  date        DateTime
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
## Funcionalidades
- [x] Auth com email/senha (NextAuth.js + JWT)
- [x] Landing Page de Atração
- [x] CRUD de transações
- [x] Categorias de gasto personalizáveis (CRUD com seletores flexíveis)
- [x] Dashboard com gráficos (pizza por categoria, barras evolução mensal)
- [x] Análise IA dos gastos (Claude API via Server Action)
- [x] Filtros por período e tipo
- [ ] Exportação CSV

## Decisões Técnicas
- **Setup e UI**: Utilizado o setup em Next.js com App Router. Adicionado Tailwind v4 e inicializado o shadcn/ui utilizando CSS variables.
- **Banco de Dados (Prisma 7)**: O Prisma foi atualizado e configurado para sua versão mais recente (v7) que alterou o comportamento da propriedade url no schema. Utilizamos a string de conexão nativa do postgres sendo lida pelo constructor do PrismaClient no arquivo `src/lib/prisma.ts` através do adapter nativo e lib `pg`. Foi garantido uso local clássico com Pool (sem dependência cloud do prisma+postgres).
- **Esquema de Banco**: Aprovados os campos básicos das entidades User, Transaction e Category dentro do arquivo de diagramação `schema.prisma`.
- **Autenticação sem NextAuth**: Next.js 16 recomenda auth customizada com Server Actions. NextAuth v5 (Auth.js) ainda está em beta com incompatibilidades no Next 16. Implementamos JWT próprio via `jose` + cookies HttpOnly. Lógica de sessão em `src/lib/session.ts`, actions em `src/app/actions/auth.ts`.
- **Estrutura do Middleware**: Next.js exige `middleware.ts` na raiz do projeto. A lógica de proteção de rotas foi isolada em `src/lib/middleware/auth-guard.ts`; o `middleware.ts` na raiz apenas delega para ele.
- **Categorias padrão no cadastro**: No `signUp`, após criar o usuário, é feito um `prisma.category.createMany` com as 7 categorias padrão já vinculadas ao `userId`.
- **Dashboard com Recharts**: Implementada visão geral com gráficos `recharts`. A estrutura foi dividida em portais (Visão Geral, Transações, Categorias).
- **Filtragem por Período**: Implementada lógica de filtros via Query Params (`month`, `year`) processados no lado do servidor (Server Components) para garantir performance e SEO.
- **Script de Seed**: Criado script `prisma/seed.ts` para facilitar o ciclo de desenvolvimento com dados reais e variados.
- **Segurança da API do Claude**: Adotado o uso de Server Actions (`src/app/actions/ai.ts`) para interagir com o Anthropic SDK, garantindo que o `ANTHROPIC_API_KEY` jamais vaze pro lado do cliente (Client Components), funcionando assim como um proxy seguro na infraestrutura da Vercel/Node.
- **Micro-Mockups na Landing Page**: A index `/` teve seus gráficos e representações criadas totalmente utilizando técnicas de *Glassmorphism* com HTML/Tailwind em vez de imagens rasterizadas; garantindo que o bounce rate do produto não seja alto por conta de loading demorado. Sessão é verificada na mesma requisição (`page.tsx`) Server Side.
