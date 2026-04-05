"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signUp, type FormState } from "@/app/actions/auth";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      id="cadastro-submit"
      type="submit"
      disabled={pending}
      className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Criando conta...
        </>
      ) : (
        "Criar conta"
      )}
    </button>
  );
}

export default function CadastroPage() {
  const [state, action] = useActionState<FormState, FormData>(signUp, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-1">Criar conta</h1>
        <p className="text-sm text-zinc-400">
          Comece a controlar suas finanças hoje
        </p>
      </div>

      <form action={action} className="space-y-4">
        {/* Erro global */}
        {state?.message && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {state.message}
          </div>
        )}

        {/* Nome */}
        <div className="space-y-1.5">
          <label htmlFor="cadastro-name" className="text-sm font-medium text-zinc-300">
            Nome
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="cadastro-name"
              name="name"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              className="w-full h-11 pl-10 pr-4 bg-zinc-800/60 border border-zinc-700/60 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          {state?.errors?.name && (
            <p className="text-xs text-red-400">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="cadastro-email" className="text-sm font-medium text-zinc-300">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="cadastro-email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              className="w-full h-11 pl-10 pr-4 bg-zinc-800/60 border border-zinc-700/60 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          {state?.errors?.email && (
            <p className="text-xs text-red-400">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Senha */}
        <div className="space-y-1.5">
          <label htmlFor="cadastro-password" className="text-sm font-medium text-zinc-300">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="cadastro-password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mín. 8 caracteres"
              autoComplete="new-password"
              className="w-full h-11 pl-10 pr-10 bg-zinc-800/60 border border-zinc-700/60 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {state?.errors?.password && (
            <p className="text-xs text-red-400">{state.errors.password[0]}</p>
          )}
        </div>

        {/* Confirmar senha */}
        <div className="space-y-1.5">
          <label htmlFor="cadastro-confirm" className="text-sm font-medium text-zinc-300">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="cadastro-confirm"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Repita a senha"
              autoComplete="new-password"
              className="w-full h-11 pl-10 pr-10 bg-zinc-800/60 border border-zinc-700/60 rounded-xl text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {state?.errors?.confirmPassword && (
            <p className="text-xs text-red-400">
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-zinc-500">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </>
  );
}
