"use client";

import { useState } from "react";
import { TransactionForm } from "./transaction-form";
import { DeleteTransactionButton } from "./delete-transaction-button";
import { TrendingUp, TrendingDown, ArrowLeftRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  categoryId: string;
  date: Date;
  category: Category;
}

type FilterType = "TODAS" | "RECEITA" | "DESPESA";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

const FILTERS: { label: string; value: FilterType; icon: React.ReactNode }[] = [
  { label: "Todas", value: "TODAS", icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
  { label: "Receitas", value: "RECEITA", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { label: "Despesas", value: "DESPESA", icon: <TrendingDown className="w-3.5 h-3.5" /> },
];

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const [filter, setFilter] = useState<FilterType>("TODAS");

  const filtered =
    filter === "TODAS"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTERS.map(({ label, value, icon }) => (
          <button
            key={value}
            id={`filter-${value.toLowerCase()}`}
            onClick={() => setFilter(value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              filter === value
                ? value === "RECEITA"
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : value === "DESPESA"
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-zinc-700/60 border-zinc-600/60 text-white"
                : "bg-transparent border-zinc-800/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700/60"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-zinc-600">
          {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-sm">Nenhuma transação encontrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 p-4 bg-zinc-900/40 border border-zinc-800/40 rounded-xl hover:bg-zinc-900/60 hover:border-zinc-800/60 transition-all group"
            >
              {/* Category dot */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ backgroundColor: `${tx.category.color}20`, border: `1px solid ${tx.category.color}30` }}
              >
                {tx.category.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {tx.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${tx.category.color}15`,
                      color: tx.category.color,
                    }}
                  >
                    {tx.category.name}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {formatDate(tx.date)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <span
                className={`text-sm font-semibold flex-shrink-0 ${
                  tx.type === "RECEITA" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {tx.type === "RECEITA" ? "+" : "-"}
                {formatBRL(tx.amount)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <TransactionForm
                  categories={categories}
                  transaction={tx}
                />
                <DeleteTransactionButton
                  transactionId={tx.id}
                  description={tx.description}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
