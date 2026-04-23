"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

interface Props {
  initialSearch?: string;
  initialStatus?: string;
  initialCourseId?: string;
}

export function SimuladoFilters({ initialSearch, initialStatus, initialCourseId }: Props) {
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
    
    params.delete('page');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-sm">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={16} className="text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar simulado ou curso..."
          defaultValue={initialSearch}
          onChange={(e) => {
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
        <select
          defaultValue={initialStatus || "all"}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
        >
          <option value="all">Qualquer Status</option>
          <option value="Agendado">Agendado</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>
    </div>
  );
}
