"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Props {
  initialRiskLevel?: string;
}

export function DiagnosticoFilters({ initialRiskLevel }: Props) {
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
      <div className="flex gap-4 items-center">
        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Nível de Risco:</label>
        <select
          defaultValue={initialRiskLevel || "all"}
          onChange={(e) => handleFilterChange("riskLevel", e.target.value)}
          className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
        >
          <option value="all">Todos</option>
          <option value="Baixo">Risco Baixo</option>
          <option value="Médio">Risco Médio</option>
          <option value="Alto">Risco Alto</option>
        </select>
        
        {isPending && <Loader2 size={16} className="animate-spin text-blue-500" />}
      </div>
    </div>
  );
}
