"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { redirect } from "next/navigation";

export async function getDashboardData(month?: number, year?: number) {
  const session = await getSession();
  if (!session) redirect("/login");
  
  const userId = session.userId;

  const now = new Date();
  const selectedMonth = month !== undefined ? month : now.getMonth();
  const selectedYear = year !== undefined ? year : now.getFullYear();

  const startDate = startOfMonth(new Date(selectedYear, selectedMonth));
  const endDate = endOfMonth(new Date(selectedYear, selectedMonth));

  // 1. Totais do mês selecionado
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const income = transactions
    .filter((t) => t.type === "RECEITA")
    .reduce((acc, t) => acc + t.amount, 0);
  
  const expenses = transactions
    .filter((t) => t.type === "DESPESA")
    .reduce((acc, t) => acc + t.amount, 0);

  // 2. Saldo Total (Acumulado de sempre)
  const totalIncome = await prisma.transaction.aggregate({
    where: { userId, type: "RECEITA" },
    _sum: { amount: true },
  });
  const totalExpenses = await prisma.transaction.aggregate({
    where: { userId, type: "DESPESA" },
    _sum: { amount: true },
  });
  
  const balance = (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0);

  // 3. Gastos por Categoria (Gráfico Pizza)
  const categorySpending = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: {
      userId,
      type: "DESPESA",
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: { amount: true },
  });

  const categories = await prisma.category.findMany({
    where: { userId },
  });

  const chartData = categorySpending.map((item) => {
    const category = categories.find((c) => c.id === item.categoryId);
    return {
      name: category?.name || "Outros",
      value: item._sum.amount || 0,
      color: category?.color || "#cbd5e1",
    };
  }).sort((a, b) => b.value - a.value);

  // 4. Evolução 6 meses (Gráfico de Barras)
  const evolutionData = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(selectedYear, selectedMonth), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const monthIncome = await prisma.transaction.aggregate({
      where: { userId, type: "RECEITA", date: { gte: start, lte: end } },
      _sum: { amount: true },
    });
    const monthExpenses = await prisma.transaction.aggregate({
      where: { userId, type: "DESPESA", date: { gte: start, lte: end } },
      _sum: { amount: true },
    });

    evolutionData.push({
      month: date.toLocaleDateString("pt-BR", { month: "short" }),
      receita: (monthIncome._sum.amount || 0) / 100,
      despesa: (monthExpenses._sum.amount || 0) / 100,
    });
  }

  // 5. Transações Recentes (Top 5)
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 5,
    include: { category: true },
  });

  return {
    summary: {
      balance,
      income,
      expenses,
      savings: income - expenses,
    },
    chartData,
    evolutionData,
    recentTransactions,
  };
}
