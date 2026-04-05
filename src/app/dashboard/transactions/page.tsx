import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { LogOut, LayoutGrid, ReceiptText, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

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

async function getTransactionsData(userId: string, page: number) {
  const ITEMS_PER_PAGE = 10;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const [transactions, categories, totalCount] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.category.findMany({
      where: { userId },
    }),
    prisma.transaction.count({
      where: { userId },
    })
  ]);

  return { 
    transactions, 
    categories,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page
  };
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1") || 1);
  const { transactions, categories, totalPages, currentPage } = await getTransactionsData(user.id, page);

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
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 mb-10 border-b border-zinc-800/30 pb-4">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500/10 border border-emerald-500/20">
            <ReceiptText className="w-4 h-4 text-emerald-400" />
            Transações
          </div>
          <Link 
            href="/dashboard/categories"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
            Categorias
          </Link>
        </div>

        {/* Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Minhas Transações</h1>
            <p className="text-zinc-500 text-sm">Gerencie seu histórico detalhado de movimentações.</p>
          </div>
          <TransactionForm categories={categories} />
        </div>

        {/* Transactions List */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 lg:p-8">
          <TransactionList 
            transactions={transactions as any} 
            categories={categories} 
          />

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-zinc-800/60 pt-6">
              <span className="text-sm text-zinc-500">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/transactions?page=${currentPage - 1}`}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-zinc-800 bg-zinc-900/50 transition-all ${
                    currentPage <= 1 
                      ? 'pointer-events-none opacity-50' 
                      : 'hover:bg-zinc-800 hover:text-white text-zinc-400'
                  }`}
                  aria-disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Link>
                <Link
                  href={`/dashboard/transactions?page=${currentPage + 1}`}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-zinc-800 bg-zinc-900/50 transition-all ${
                    currentPage >= totalPages 
                      ? 'pointer-events-none opacity-50' 
                      : 'hover:bg-zinc-800 hover:text-white text-zinc-400'
                  }`}
                  aria-disabled={currentPage >= totalPages}
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
