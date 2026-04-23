"use client";

import { useTransition } from "react";
import { deleteSimuladoAction } from "@/app/actions/simulado.actions";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteSimuladoButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja deletar este simulado? Essa ação é irreversível.")) {
      startTransition(async () => {
        try {
          await deleteSimuladoAction(id);
        } catch (error: any) {
          alert(error.message);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors disabled:opacity-50"
      title="Excluir Simulado"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
