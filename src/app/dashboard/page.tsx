import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { LogOut, LayoutGrid, ReceiptText, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getDashboardData } from "@/app/actions/dashboard";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { EvolutionChart } from "@/components/dashboard/evolution-chart";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { AiInsights } from "@/components/dashboard/ai-insights";
import { RecentTransactionsSmall } from "@/components/dashboard/recent-transactions-small";
import { TransactionForm } from "@/components/transactions/transaction-form";

interface PageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
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

export default async function DashboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  
  const month = params.month ? parseInt(params.month) - 1 : undefined;
  const year = params.year ? parseInt(params.year) : undefined;

  const data = await getDashboardData(month, year);
  const categories = await prisma.category.findMany({ where: { userId: user.id } });

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
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
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-emerald-500/10 border border-emerald-500/20">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Visão Geral
          </div>
          <Link 
            href="/dashboard/transactions"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all"
          >
            <ReceiptText className="w-4 h-4" />
            Transações
          </Link>
          <Link 
            href="/dashboard/categories"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
            Categorias
          </Link>
        </div>

        {/* Welcome & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Olá, {user.name ?? user.email.split("@")[0]} 👋
            </h1>
            <p className="text-zinc-500 text-sm">
              Aqui está o resumo da sua saúde financeira.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <PeriodSelector />
            <TransactionForm categories={categories} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-10">
          <SummaryCards summary={data.summary} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <SpendingChart data={data.chartData} />
          <EvolutionChart data={data.evolutionData} />
        </div>

        {/* AI Insights */}
        <div className="mb-10">
          <AiInsights />
        </div>

        {/* Recent Activity */}
        <div className="mb-10">
          <RecentTransactionsSmall transactions={data.recentTransactions} />
        </div>
      </main>
    </div>
  );
}
