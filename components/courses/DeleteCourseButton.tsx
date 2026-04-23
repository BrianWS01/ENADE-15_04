"use client";

import { useTransition } from "react";
import { deleteCourseAction } from "@/app/actions/course.actions";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteCourseButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja deletar este curso? Essa ação é irreversível.")) {
      startTransition(async () => {
        try {
          await deleteCourseAction(id);
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
      title="Excluir Curso"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}
