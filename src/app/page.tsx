import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, LayoutGrid, CheckCircle2 } from "lucide-react";

export default async function HomePage() {
  const session = await getSession();

  if (session?.userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full border-b border-zinc-800/40 bg-[#0a0a0f]/60 backdrop-blur-md z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm shadow-lg shadow-emerald-500/20">
              💰
            </div>
            <span className="text-xl font-bold tracking-tight">
              Dev<span className="text-emerald-400">Finance</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link 
              href="/login" 
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/cadastro" 
              className="text-sm font-medium bg-emerald-600 text-white px-5 py-2 rounded-full shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:scale-105 transition-all duration-300"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 sm:pt-40 lg:pt-48">
        {/* Glows Background Top */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Insights de IA agora disponíveis
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15]">
            Assuma o controle total <br className="hidden md:block" /> das suas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              finanças.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Uma plataforma inteligente que não apenas registra seus gastos, mas ajuda você a entender seus hábitos financeiros com previsões via Inteligência Artificial.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/cadastro" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-emerald-500/20 group"
            >
              Começar agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup (CSS Pure Glassmorphism) */}
        <div className="max-w-5xl mx-auto px-6 mt-24 relative z-10 perspective-1000">
          <div className="relative rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8 transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out flex flex-col gap-6 ring-1 ring-white/5">
            {/* Top Bar Mock */}
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
              <div className="flex gap-4">
                <div className="w-24 h-8 rounded-lg bg-zinc-800/50" />
                <div className="w-32 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20" />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-800/50" />
              </div>
            </div>

            {/* Content Mock */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 flex flex-col gap-4">
                <div className="h-28 rounded-xl bg-zinc-800/30 border border-zinc-800/50 p-4 flex flex-col justify-end">
                  <div className="w-12 h-4 rounded bg-zinc-700/50 mb-2" />
                  <div className="w-3/4 h-6 rounded bg-emerald-500/40" />
                </div>
                <div className="h-56 rounded-xl bg-zinc-800/30 border border-zinc-800/50 relative overflow-hidden flex flex-col justify-center items-center py-6">
                  {/* Fake Donut */}
                  <div className="w-24 h-24 rounded-full border-[12px] border-emerald-500/30 border-r-indigo-500/50 border-t-amber-500/50" />
                  <div className="w-1/2 h-3 rounded bg-zinc-700/50 mt-6" />
                </div>
              </div>
              
              <div className="md:col-span-3 flex flex-col gap-6">
                <div className="h-56 rounded-xl flex items-end justify-between bg-zinc-800/30 border border-zinc-800/50 p-6 gap-3">
                  {/* Fake Bar Chart */}
                  {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
                    <div key={i} className="w-full flex justify-center items-end gap-1 group">
                      <div className="w-full max-w-[20px] rounded-t-sm bg-red-400/80 hover:bg-red-400 transition-colors" style={{ height: `${h * 0.4}%` }} />
                      <div className="w-full max-w-[20px] rounded-t-sm bg-emerald-400/80 hover:bg-emerald-400 transition-colors" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                <div className="h-24 rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-5 flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="p-3 bg-emerald-500/10 rounded-full">
                       <BrainCircuit className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className="w-48 h-3 rounded bg-emerald-500/30" />
                       <div className="w-80 h-3 rounded bg-zinc-700/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-6 mt-32 relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo o que você precisa</h2>
             <p className="text-zinc-400">Funcionalidades focadas para dar o mapa do seu tesouro.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-3xl hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100">Visão Panorâmica</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Dashboard analítico interativo que constrói gráficos automaticamente conforme você adiciona seu histórico de transações.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-3xl hover:bg-zinc-900/60 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-2xl rounded-full" />
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BrainCircuit className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100">Consultor IA Privado</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Integração nativa com a API do Claude para gerar relatórios verbais em linguagem natural e dar conselhos em cima dos seus cálculos mensais.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-3xl hover:bg-zinc-900/60 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <LayoutGrid className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-100">Personalizado</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Crie um número ilimitado de categorias com as cores e emojis exatos correspondentes à sua rotina, para indexar seus gastos perfeitamente ao seu gosto.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="border-t border-zinc-800/60 py-10 mt-16 text-center text-zinc-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[10px] opacity-80">
              💰
            </div>
            <span className="font-semibold text-zinc-300">DevFinance</span>
        </div>
        <p>© {new Date().getFullYear()} DevFinance Analytics OS. Nenhum dado é vendido pela plataforma.</p>
      </footer>
    </div>
  );
}
