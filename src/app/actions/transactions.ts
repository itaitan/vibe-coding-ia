"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

// ---- Helpers ----

async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  return session.userId;
}

// ---- Schemas ----

const TransactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória").trim(),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((v) => {
      const n = parseFloat(v.replace(/\./g, "").replace(",", "."));
      return !isNaN(n) && n > 0;
    }, "Valor deve ser maior que zero"),
  type: z.enum(["RECEITA", "DESPESA"], {
    message: "Tipo inválido",
  }),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
});

export type TransactionFormState =
  | { errors?: Record<string, string[]>; message?: string }
  | undefined;

function parseToCents(value: string): number {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  return Math.round(parseFloat(normalized) * 100);
}

// ---- Create ----

export async function createTransaction(
  state: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const userId = await requireUserId();

  const raw = {
    description: formData.get("description"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
  };

  const validated = TransactionSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { description, amount, type, categoryId, date } = validated.data;

  // Garantir que a categoria pertence ao usuário
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) {
    return { errors: { categoryId: ["Categoria inválida"] } };
  }

  await prisma.transaction.create({
    data: {
      description,
      amount: parseToCents(amount),
      type,
      categoryId,
      userId,
      date: new Date(date),
    },
  });

  revalidatePath("/dashboard");
  return undefined;
}

// ---- Update ----

export async function updateTransaction(
  state: TransactionFormState,
  formData: FormData
): Promise<TransactionFormState> {
  const userId = await requireUserId();

  const transactionId = formData.get("transactionId") as string;
  if (!transactionId) return { message: "ID da transação inválido" };

  const raw = {
    description: formData.get("description"),
    amount: formData.get("amount"),
    type: formData.get("type"),
    categoryId: formData.get("categoryId"),
    date: formData.get("date"),
  };

  const validated = TransactionSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { description, amount, type, categoryId, date } = validated.data;

  // Garantir que a transação pertence ao usuário
  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });
  if (!existing) return { message: "Transação não encontrada" };

  // Garantir que a categoria pertence ao usuário
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });
  if (!category) return { errors: { categoryId: ["Categoria inválida"] } };

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      description,
      amount: parseToCents(amount),
      type,
      categoryId,
      date: new Date(date),
    },
  });

  revalidatePath("/dashboard");
  return undefined;
}

// ---- Delete ----

export async function deleteTransaction(transactionId: string): Promise<void> {
  const userId = await requireUserId();

  // Garantir que a transação pertence ao usuário antes de deletar
  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });
  if (!existing) return;

  await prisma.transaction.delete({ where: { id: transactionId } });
  revalidatePath("/dashboard");
}
