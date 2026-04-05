import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, ReceiptText } from "lucide-react";
import Link from "next/link";

interface RecentTransactionsSmallProps {
  transactions: any[];
}

export function RecentTransactionsSmall({ transactions }: RecentTransactionsSmallProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm shadow-xl flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-zinc-100 text-lg">Últimas Atividades</CardTitle>
          <CardDescription className="text-zinc-500">Suas 5 transações mais recentes</CardDescription>
        </div>
        <Link 
          href="/dashboard/transactions" 
          className="text-xs font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors group"
        >
          Ver todas
          <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mb-1">
                <ReceiptText className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-zinc-400 font-medium">Nenhuma transação registrada</p>
              <p className="text-sm text-zinc-600 max-w-[200px]">As suas movimentações recentes aparecerão aqui.</p>
            </div>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between group hover:bg-zinc-900/40 p-2 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-xl shadow-inner shadow-black/20"
                    style={{ backgroundColor: t.category.color + '20', color: t.category.color }}
                  >
                    {t.category.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200 line-clamp-1">{t.description}</p>
                    <p className="text-xs text-zinc-500">
                      {format(new Date(t.date), "dd 'de' MMM", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-bold ${t.type === 'RECEITA' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {t.type === 'RECEITA' ? '+' : '-'} {formatCurrency(t.amount / 100)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
