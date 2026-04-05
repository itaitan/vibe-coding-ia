"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCategory } from "@/app/actions/categories";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
  isDefault: boolean;
}

export function DeleteCategoryDialog({
  categoryId,
  categoryName,
  isDefault,
}: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);

    const result = await deleteCategory(categoryId);

    if (result.success) {
      toast.success("Categoria excluída!");
      setOpen(false);
    } else {
      setError(result.message ?? "Erro ao excluir categoria.");
    }
    setLoading(false);
  }

  if (isDefault) {
    return (
      <button
        disabled
        className="p-1.5 rounded-lg text-zinc-700 cursor-not-allowed opacity-50"
        title="Categorias padrão não podem ser excluídas"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="p-1.5 rounded-lg text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        }
      />

      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <DialogTitle className="text-center text-white">Excluir Categoria?</DialogTitle>
          <p className="text-sm text-zinc-400 text-center mt-2">
            Tem certeza que deseja excluir <strong>{categoryName}</strong>? 
            Esta ação não poderá ser desfeita.
          </p>
        </DialogHeader>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 h-10 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white transition-all text-sm font-semibold flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sim, excluir"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
