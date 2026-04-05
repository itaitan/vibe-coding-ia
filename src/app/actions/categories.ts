"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const CategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").trim(),
  color: z.string().min(4, "Cor é obrigatória"),
  icon: z.string().min(1, "Ícone é obrigatório"),
});

export type CategoryFormState =
  | { errors?: Record<string, string[]>; message?: string; success?: boolean }
  | undefined;

async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) redirect("/login");
  return session.userId;
}

export async function createCategory(
  state: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const userId = await requireUserId();

  const raw = {
    name: formData.get("name"),
    color: formData.get("color"),
    icon: formData.get("icon"),
  };

  const validated = CategorySchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, color, icon } = validated.data;

  try {
    await prisma.category.create({
      data: {
        name,
        color,
        icon,
        userId,
      },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return { message: "Você já possui uma categoria com este nome." };
    }
    return { message: "Erro ao criar categoria." };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCategory(
  state: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const userId = await requireUserId();
  const categoryId = formData.get("categoryId") as string;

  if (!categoryId) return { message: "ID da categoria não fornecido." };

  const raw = {
    name: formData.get("name"),
    color: formData.get("color"),
    icon: formData.get("icon"),
  };

  const validated = CategorySchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, color, icon } = validated.data;

  try {
    // Verificar propriedade
    const existing = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!existing) return { message: "Categoria não encontrada." };

    await prisma.category.update({
      where: { id: categoryId },
      data: { name, color, icon },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[updateCategory]", error);
    return { message: "Erro ao atualizar categoria." };
  }
}

export async function deleteCategory(categoryId: string): Promise<{ success: boolean; message?: string }> {
  const userId = await requireUserId();

  try {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
      include: { _count: { select: { transactions: true } } },
    });

    if (!category) return { success: false, message: "Categoria não encontrada." };

    // Proteger categorias padrão
    if (category.isDefault) {
      return { success: false, message: "Categorias padrão não podem ser excluídas." };
    }

    // Verificar transações vinculadas
    if (category._count.transactions > 0) {
      return { 
        success: false, 
        message: `Esta categoria possui ${category._count.transactions} transações vinculadas e não pode ser excluída.` 
      };
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("[deleteCategory]", error);
    return { success: false, message: "Erro ao excluir categoria." };
  }
}
