"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

// ---- Schemas Zod ----

const SignUpSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").trim(),
    email: z.string().email("Email inválido").trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .regex(/[a-zA-Z]/, "Senha deve conter pelo menos uma letra")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const SignInSchema = z.object({
  email: z.string().email("Email inválido").trim().toLowerCase(),
  password: z.string().min(1, "Senha é obrigatória"),
});

// ---- Categorias padrão ----

const DEFAULT_CATEGORIES = [
  { name: "Alimentação", color: "#F97316", icon: "🍔" },
  { name: "Transporte", color: "#3B82F6", icon: "🚗" },
  { name: "Lazer", color: "#A855F7", icon: "🎮" },
  { name: "Saúde", color: "#EF4444", icon: "❤️" },
  { name: "Moradia", color: "#F59E0B", icon: "🏠" },
  { name: "Salário", color: "#22C55E", icon: "💼" },
  { name: "Freelance", color: "#14B8A6", icon: "💻" },
];

// ---- Types ----

export type FormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

// ---- Actions ----

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validated = SignUpSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = validated.data;

  // Verificar email duplicado
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { errors: { email: ["Este email já está cadastrado"] } };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Criar categorias padrão para o novo usuário
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      userId: user.id,
      isDefault: true,
    })),
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validated = SignInSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { errors: { email: ["Email ou senha incorretos"] } };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return { errors: { email: ["Email ou senha incorretos"] } };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
