import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  summary: {
    balance: number;
    income: number;
    expenses: number;
    savings: number;
  };
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: "Saldo Total",
      value: summary.balance,
      icon: Wallet,
      color: "text-zinc-100",
      bgColor: "bg-zinc-900/50",
    },
    {
      title: "Receitas do Mês",
      value: summary.income,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Despesas do Mês",
      value: summary.expenses,
      icon: TrendingDown,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      title: "Economia do Mês",
      value: summary.savings,
      icon: PiggyBank,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm shadow-xl hover:translate-y-[-2px] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold tracking-tight ${card.color}`}>
              {formatCurrency(card.value / 100)}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {card.title === "Saldo Total" ? "Saldo acumulado" : "Neste período"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
