import Link from "next/link";
import { ArrowRight, FileCheck, Calendar, Users, BarChart2, Edit2 } from "lucide-react";
import type { Simulado, PaginatedResponse } from "@/types";
import { DeleteSimuladoButton } from "./DeleteSimuladoButton";

interface Props {
  response: PaginatedResponse<Simulado>;
}

export function SimuladoList({ response }: Props) {
  const { data, meta } = response;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <FileCheck size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
        <p className="text-zinc-500 font-medium">Nenhum simulado encontrado com estes filtros.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">Simulado</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">Curso</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">Data</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">Média / Partic.</th>
                <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 text-right whitespace-nowrap">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {data.map((sim) => {
                const dateObj = new Date(sim.date);
                const formattedDate = dateObj.toLocaleDateString('pt-BR');
                
                return (
                  <tr key={sim.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                      <div className="flex flex-col">
                        <span>{sim.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                      <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-md uppercase">
                        {sim.courseName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        sim.status === 'Finalizado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        sim.status === 'Em andamento' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {sim.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <Calendar size={14} /> {formattedDate}
                    </td>
                    <td className="px-6 py-4">
                      {sim.status === 'Finalizado' ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                            <BarChart2 size={14} className="text-zinc-400" /> {sim.avg.toFixed(1)}
                          </span>
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Users size={12} /> {sim.participation}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/simulados/${sim.id}`}
                          className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium text-xs"
                        >
                          {sim.status === 'Finalizado' ? 'Relatório' : 'Detalhes'} <ArrowRight size={14} />
                        </Link>
                        
                        <div className="flex items-center gap-1 border-l border-zinc-200 dark:border-zinc-700 pl-3">
                          <Link 
                            href={`/simulados/${sim.id}/editar`}
                            className="text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"
                            title="Editar Simulado"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <DeleteSimuladoButton id={sim.id} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          {Array.from({ length: meta.totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            const isCurrent = pageNumber === meta.page;
            
            return (
              <Link
                key={pageNumber}
                href={`?page=${pageNumber}`}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  isCurrent
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
