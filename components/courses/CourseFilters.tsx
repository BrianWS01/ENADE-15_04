"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

interface Props {
  initialSearch?: string;
  initialCategory?: string;
  initialRiskLevel?: string;
}

export function CourseFilters({ initialSearch, initialCategory, initialRiskLevel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reseta paginação ao filtrar
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-sm">
      {/* Container de Busca */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={16} className="text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar curso por nome..."
          defaultValue={initialSearch}
          onChange={(e) => {
            // Debounce super simples usando setTimeout
            const timeoutId = setTimeout(() => {
              handleFilterChange("search", e.target.value);
            }, 300);
            return () => clearTimeout(timeoutId);
          }}
          className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500"
        />
        {isPending && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Loader2 size={14} className="animate-spin text-blue-500" />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {/* Filtro de Categoria */}
        <select
          defaultValue={initialCategory || "all"}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
        >
          <option value="all">Todas as Áreas</option>
          <option value="Bacharelado">Bacharelado</option>
          <option value="Licenciatura">Licenciatura</option>
          <option value="Tecnológico">Tecnológico</option>
        </select>

        {/* Filtro de Risco */}
        <select
          defaultValue={initialRiskLevel || "all"}
          onChange={(e) => handleFilterChange("riskLevel", e.target.value)}
          className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
        >
          <option value="all">Qualquer Risco</option>
          <option value="Baixo">Risco Baixo</option>
          <option value="Médio">Risco Médio</option>
          <option value="Alto">Risco Alto</option>
        </select>
      </div>
    </div>
  );
}
