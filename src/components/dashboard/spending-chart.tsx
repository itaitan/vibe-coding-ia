"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SpendingChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm h-[400px] flex flex-col items-center justify-center">
        <p className="text-zinc-500 font-medium">Nenhuma despesa registrada no período.</p>
      </Card>
    );
  }

  // Converter para reais para o gráfico
  const formattedData = data.map(item => ({
    ...item,
    value: item.value / 100
  }));

  const total = formattedData.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-zinc-100 text-lg">Distribuição de Gastos</CardTitle>
        <CardDescription className="text-zinc-500">Despesas por categoria no mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: '#f4f4f5' }}
                formatter={(value: any) => formatCurrency(Number(value))}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center text-sm">
          <span className="text-zinc-400 font-medium">Total de Despesas</span>
          <span className="text-rose-500 font-bold">{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
