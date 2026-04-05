"use client";

import { useState } from "react";
import { deleteTransaction } from "@/app/actions/transactions";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteTransactionButtonProps {
  transactionId: string;
  description: string;
}

export function DeleteTransactionButton({
  transactionId,
  description,
}: DeleteTransactionButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteTransaction(transactionId);
    setLoading(false);
    setConfirming(false);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          id={`confirm-delete-${transactionId}`}
          onClick={handleDelete}
          disabled={loading}
          className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirmar"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-all"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      id={`delete-tx-${transactionId}`}
      title={`Deletar "${description}"`}
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
