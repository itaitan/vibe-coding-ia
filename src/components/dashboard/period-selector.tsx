"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

export function PeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());
  const currentYear = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

  function updatePeriod(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-3 text-zinc-400">
        <Calendar className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Período</span>
      </div>
      
      <Select 
        value={currentMonth.toString()} 
        onValueChange={(val) => updatePeriod("month", val || "")}
      >
        <SelectTrigger className="w-[140px] h-9 bg-zinc-950 border-zinc-800 text-zinc-200 rounded-xl focus:ring-emerald-500/20">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-zinc-800">
          {MONTHS.map((month, index) => (
            <SelectItem key={month} value={(index + 1).toString()} className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={currentYear.toString()} 
        onValueChange={(val) => updatePeriod("year", val || "")}
      >
        <SelectTrigger className="w-[100px] h-9 bg-zinc-950 border-zinc-800 text-zinc-200 rounded-xl focus:ring-emerald-500/20">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-zinc-800">
          {YEARS.map((year) => (
            <SelectItem key={year} value={year.toString()} className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
