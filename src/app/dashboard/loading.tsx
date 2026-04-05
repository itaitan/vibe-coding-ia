import { Loader2, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header Skeleton */}
      <header className="border-b border-zinc-800/60 backdrop-blur-sm sticky top-0 z-10 bg-[#0a0a0f]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 animate-pulse" />
            <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
          </div>

          <div className="flex items-center gap-4 opacity-50">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <div className="w-6 h-6 rounded-lg bg-zinc-800 animate-pulse" />
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-transparent">
              <LogOut className="w-4 h-4 text-zinc-600" />
              <span className="hidden sm:inline text-zinc-600">Sair</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" />
        <p className="text-zinc-500 font-medium animate-pulse">Carregando painel...</p>
      </main>
    </div>
  );
}
