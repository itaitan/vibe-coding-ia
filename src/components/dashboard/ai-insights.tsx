"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrainCircuit, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { analyzeExpenses } from "@/app/actions/ai";

export function AiInsights() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");
  
  // Como agora o dashboard repassa valores 1-based, subtraímos ao buscar p/ AI
  const month = monthParam ? parseInt(monthParam) - 1 : undefined;
  const year = yearParam ? parseInt(yearParam) : undefined;

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeExpenses(month, year);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-emerald-900/40 bg-zinc-950/60 backdrop-blur-sm shadow-xl shadow-emerald-900/5 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      
      <CardHeader className="relative z-10 flex flex-row items-start justify-between pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-zinc-100 text-lg">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            Insights da IA
          </CardTitle>
          <CardDescription className="text-zinc-400 mt-1">
            Análise automática de gastos com recomendações personalizadas.
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        {!data && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-10 bg-zinc-900/30 rounded-xl border border-zinc-800/80 dashed border-dashed">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-zinc-400 text-sm text-center max-w-sm mb-6">
              O Claude analisará seus gastos do período, comparando receitas, despesas e suas principais categorias.
            </p>
            <Button 
              onClick={handleAnalyze}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            >
              Analisar meus gastos
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
            <p className="text-zinc-400 font-medium animate-pulse">Processando seus dados na nuvem...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 break-words">{error}</p>
          </div>
        )}

        {data && !loading && (
          <div className="flex flex-col gap-4">
            <div className="prose prose-invert prose-emerald max-w-none text-zinc-300 text-sm prose-p:leading-relaxed prose-li:my-1 prose-headings:text-zinc-100 prose-headings:font-semibold prose-strong:text-zinc-100 prose-ul:list-disc prose-ul:pl-4 bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/50">
              <ReactMarkdown
                components={{
                  p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 last:mb-0 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 last:mb-0 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="text-zinc-300" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-emerald-400 font-bold mb-2 mt-4 first:mt-0 text-base" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-emerald-300" {...props} />,
                }}
              >
                {data}
              </ReactMarkdown>
            </div>
            
            <div className="flex justify-end mt-2">
              <Button 
                onClick={handleAnalyze} 
                variant="outline" 
                size="sm"
                className="border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10"
              >
                Analisar Novamente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
