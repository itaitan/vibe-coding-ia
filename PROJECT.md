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

## Funcionalidades
- [ ] Auth com email/senha (NextAuth.js + JWT)
- [ ] CRUD de transações
- [ ] Categorias de gasto personalizáveis
- [ ] Dashboard com gráficos (pizza por categoria, barras evolução mensal)
- [ ] Análise IA dos gastos (Claude API via Server Action)
- [ ] Filtros por período e tipo
- [ ] Exportação CSV

## Decisões Técnicas

