"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X } from "lucide-react";
import type { Course } from "@/types";

interface Props {
  action: (formData: FormData) => Promise<void>;
  initialData?: Course;
}

export function CourseForm({ action, initialData }: Props) {
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
      setError(err.message || "Ocorreu um erro ao salvar o curso.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm max-w-2xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Nome do Curso</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            placeholder="Ex: Engenharia de Software"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Categoria</label>
            <select
              id="category"
              name="category"
              required
              defaultValue={initialData?.category || "Bacharelado"}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            >
              <option value="Bacharelado">Bacharelado</option>
              <option value="Licenciatura">Licenciatura</option>
              <option value="Tecnológico">Tecnológico</option>
            </select>
          </div>

          <div>
            <label htmlFor="modality" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Modalidade</label>
            <select
              id="modality"
              name="modality"
              required
              defaultValue={initialData?.modality || "Presencial"}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            >
              <option value="Presencial">Presencial</option>
              <option value="Semipresencial">Semipresencial</option>
              <option value="EaD">EaD</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="riskLevel" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Nível de Risco Inicial</label>
          <select
            id="riskLevel"
            name="riskLevel"
            required
            defaultValue={initialData?.riskLevel || "Médio"}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
          >
            <option value="Baixo">Baixo</option>
            <option value="Médio">Médio</option>
            <option value="Alto">Alto</option>
          </select>
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
          {initialData ? "Salvar Alterações" : "Criar Curso"}
        </button>
      </div>
    </form>
  );
}
