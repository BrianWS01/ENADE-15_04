"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X } from "lucide-react";
import type { Simulado, Course } from "@/types";

interface Props {
  action: (formData: FormData) => Promise<void>;
  initialData?: Simulado;
  courses: Course[];
}

export function SimuladoForm({ action, initialData, courses }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      if (initialData) {
        formData.append("id", initialData.id);
      }
      await action(formData);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao salvar o simulado.");
      setLoading(false);
    }
  };

  // Extract date part in YYYY-MM-DD for datetime-local or date input
  const defaultDate = initialData?.date 
    ? new Date(initialData.date).toISOString().split('T')[0]
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-2xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Nome do Simulado</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            placeholder="Ex: Simulado Geral - Ciclo 1"
          />
        </div>

        <div>
          <label htmlFor="courseId" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Curso Vinculado</label>
          <select
            id="courseId"
            name="courseId"
            required
            defaultValue={initialData?.courseId || ""}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
          >
            <option value="" disabled>Selecione um curso</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Data de Realização</label>
            <input
              type="date"
              id="date"
              name="date"
              required
              defaultValue={defaultDate}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Status</label>
            <select
              id="status"
              name="status"
              required
              defaultValue={initialData?.status || "Agendado"}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            >
              <option value="Agendado">Agendado</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <X size={16} /> Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {initialData ? "Salvar Alterações" : "Criar Simulado"}
        </button>
      </div>
    </form>
  );
}
