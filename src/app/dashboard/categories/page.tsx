import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LogOut, LayoutGrid, ReceiptText, BarChart3 } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryList } from "@/components/categories/category-list";

async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) redirect("/login");
  return user;
}

async function getCategories(userId: string) {
  return await prisma.category.findMany({
    where: { userId },
    orderBy: [
      { isDefault: "desc" }, // Padrão primeiro
      { name: "asc" },
    ],
  });
}

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  const categories = await getCategories(user.id);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/60 backdrop-blur-sm sticky top-0 z-10 bg-[#0a0a0f]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm shadow-lg shadow-emerald-500/20">
              💰
            </div>
            <Link href="/dashboard" className="text-lg font-bold tracking-tight">
              Dev<span className="text-emerald-400">Finance</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                {initials}
              </div>
              <span className="text-xs text-zinc-400 font-medium">{user.email}</span>
            </div>
            
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all duration-200 border border-transparent hover:border-zinc-700/60"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap items-center gap-2 sm:gap-4 mb-6 sm:mb-10 border-b border-zinc-800/30 pb-4 scrollbar-none">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </Link>
          <Link 
            href="/dashboard/transactions"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all"
          >
            <ReceiptText className="w-4 h-4" />
            Transações
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500/10 border border-emerald-500/20">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            Categorias
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Minhas Categorias
              </h1>
              <p className="text-zinc-500 text-sm">
                Organize suas transações com categorias personalizadas.
              </p>
            </div>
            <CategoryForm />
          </div>

          <CategoryList categories={categories} />
        </div>
      </main>
    </div>
  );
}
