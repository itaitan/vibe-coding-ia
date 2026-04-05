"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface EvolutionChartProps {
  data: {
    month: string;
    receita: number;
    despesa: number;
  }[];
}

export function EvolutionChart({ data }: EvolutionChartProps) {
  return (
    <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-zinc-100 text-lg">Evolução Mensal</CardTitle>
        <CardDescription className="text-zinc-500">Fluxo de caixa nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value >= 1000 ? `${value / 1000}k` : value}`}
              />
              <Tooltip
                cursor={{ fill: '#27272a', opacity: 0.4 }}
                contentStyle={{ 
                  backgroundColor: '#18181b', 
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#f4f4f5' }}
                formatter={(value: any) => [formatCurrency(Number(value)), '']}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
              />
              <Bar 
                name="Receitas"
                dataKey="receita" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
              <Bar 
                name="Despesas"
                dataKey="despesa" 
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
