"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTransaction,
  updateTransaction,
  type TransactionFormState,
} from "@/app/actions/transactions";
import { Loader2, Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

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
}

interface TransactionFormProps {
  categories: Category[];
  transaction?: Transaction; // se presente → edição
}

function SubmitButton({ isEdit, pending }: { isEdit: boolean; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      id={isEdit ? "edit-transaction-submit" : "add-transaction-submit"}
      className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Salvando...
        </>
      ) : isEdit ? (
        "Salvar alterações"
      ) : (
        "Adicionar transação"
      )}
    </button>
  );
}

// Formata número para exibir no input (ex: 1234 → "12.34")
function centsToInputValue(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function toInputDate(date: Date): string {
  return new Date(date).toISOString().split("T")[0];
}

function maskCurrency(value: string): string {
  // Remove tudo que não é dígito
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  // Converte para número e divide por 100 para ter as casas decimais
  const amount = Number(digits) / 100;

  // Formata com 2 casas decimais e vírgula
  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function TransactionForm({ categories, transaction }: TransactionFormProps) {
  const isEdit = !!transaction;
  const action = isEdit ? updateTransaction : createTransaction;

  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(
    transaction?.type ?? "DESPESA"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    transaction?.categoryId ?? ""
  );
  const [amount, setAmount] = useState<string>(
    transaction ? centsToInputValue(transaction.amount) : ""
  );

  const [pending, setPending] = useState(false);
  const [state, setState] = useState<TransactionFormState>(undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setState(undefined);

    const formData = new FormData(e.currentTarget);
    const result = await action(undefined, formData);

    setPending(false);

    if (result?.message === "success") {
      toast.success(isEdit ? "Transação atualizada!" : "Transação salva!");
      setOpen(false);
      if (!isEdit) {
        setSelectedType("DESPESA");
        setSelectedCategory("");
        setAmount("");
      }
    } else if (result?.message) {
      toast.error(result.message);
      setState(result);
    } else if (result?.errors) {
      setState(result);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEdit ? (
            <button
              id={`edit-tx-${transaction.id}`}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              id="add-transaction-button"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              Nova transação
            </button>
          )
        }
      />

      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {isEdit && (
            <input type="hidden" name="transactionId" value={transaction.id} />
          )}

          {state?.message && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
              {state.message}
            </div>
          )}

          {/* Tipo */}
          <div className="space-y-1.5">
            <Label className="text-zinc-300 text-sm">Tipo</Label>
            <input type="hidden" name="type" value={selectedType} />
            <div className="grid grid-cols-2 gap-2">
              {(["RECEITA", "DESPESA"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`h-10 rounded-xl text-sm font-medium border transition-all ${
                    selectedType === t
                      ? t === "RECEITA"
                        ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-400"
                        : "bg-red-500/20 border-red-500/60 text-red-400"
                      : "bg-zinc-800/40 border-zinc-700/40 text-zinc-500 hover:border-zinc-600"
                  }`}
                >
                  {t === "RECEITA" ? "📈 Receita" : "📉 Despesa"}
                </button>
              ))}
            </div>
            {state?.errors?.type && (
              <p className="text-xs text-red-400">{state.errors.type[0]}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-description" className="text-zinc-300 text-sm">
              Descrição
            </Label>
            <Input
              id="tx-description"
              name="description"
              placeholder="Ex: Almoço, salário, uber..."
              defaultValue={transaction?.description}
              className="bg-zinc-800/60 border-zinc-700/60 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/60"
            />
            {state?.errors?.description && (
              <p className="text-xs text-red-400">{state.errors.description[0]}</p>
            )}
          </div>

          {/* Valor */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-amount" className="text-zinc-300 text-sm">
              Valor (R$)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                R$
              </span>
              <Input
                id="tx-amount"
                name="amount"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(maskCurrency(e.target.value))}
                className="bg-zinc-800/60 border-zinc-700/60 text-white placeholder:text-zinc-600 pl-9 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/60"
              />
            </div>
            {state?.errors?.amount && (
              <p className="text-xs text-red-400">{state.errors.amount[0]}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="space-y-1.5">
            <Label className="text-zinc-300 text-sm">Categoria</Label>
            <input type="hidden" name="categoryId" value={selectedCategory} />
            <Select
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val ?? "")}
            >
              <SelectTrigger className="bg-zinc-800/60 border-zinc-700/60 text-white focus:ring-emerald-500/30">
                <SelectValue
                  placeholder="Selecionar categoria"
                  render={(props, state) => {
                    const cat = categories.find((c) => c.id === state.value);
                    return (
                      <span {...props}>
                        {cat ? (
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                          </span>
                        ) : (
                          state.placeholder
                        )}
                      </span>
                    );
                  }}
                />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {categories.map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id}
                    className="text-white focus:bg-zinc-800 focus:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.categoryId && (
              <p className="text-xs text-red-400">{state.errors.categoryId[0]}</p>
            )}
          </div>

          {/* Data */}
          <div className="space-y-1.5">
            <Label htmlFor="tx-date" className="text-zinc-300 text-sm">
              Data
            </Label>
            <Input
              id="tx-date"
              name="date"
              type="date"
              defaultValue={
                transaction
                  ? toInputDate(transaction.date)
                  : new Date().toISOString().split("T")[0]
              }
              className="bg-zinc-800/60 border-zinc-700/60 text-white focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/60 [color-scheme:dark]"
            />
            {state?.errors?.date && (
              <p className="text-xs text-red-400">{state.errors.date[0]}</p>
            )}
          </div>

          <div className="pt-1">
            <SubmitButton isEdit={isEdit} pending={pending} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
