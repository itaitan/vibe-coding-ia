---
trigger: always_on
---

- Sempre usar Server Actions para mutações no banco
- Validar inputs com zod antes de qualquer operação
- Valores monetários em centavos (integer) no banco - nunca float
- todas as queries Prisma Filtram por userId (nunca expor dados de outro usuario)
- Componentes de UI shadcn/ui
- Ao criar nova funcionalidade, atualizar o PROJECT.md
- Ao tomar uma decisão técnica relevante, documentar no PROJECT.md