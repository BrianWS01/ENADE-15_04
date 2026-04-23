import Link from "next/link";
import { ArrowRight, BrainCircuit, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Diagnostico, PaginatedResponse } from "@/types";

interface Props {
  response: PaginatedResponse<Diagnostico>;
}

export function DiagnosticoList({ response }: Props) {
  const { data, meta } = response;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <BrainCircuit size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
        <p className="text-zinc-500 font-medium">Nenhum diagnóstico encontrado com estes filtros.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((diag) => {
          const dateObj = new Date(diag.createdAt);
          const formattedDate = dateObj.toLocaleDateString('pt-BR');
          const isHighRisk = diag.riskLevel === 'Alto';

          return (
            <div key={diag.id} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg hover:border-blue-500/30 transition-all relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors leading-tight">
                    {diag.courseName}
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">Gerado em {formattedDate}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg shrink-0">
                  <BrainCircuit size={18} />
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 font-semibold uppercase">Score Geral</span>
                    <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">{diag.scoreGeral.toFixed(1)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-zinc-500 font-semibold uppercase">Tendência</span>
                    <span className={`text-sm font-bold flex items-center gap-1 ${
                      diag.trend === 'Crescente' ? 'text-green-500' :
                      diag.trend === 'Em queda' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {diag.trend === 'Crescente' && <TrendingUp size={14} />}
                      {diag.trend === 'Em queda' && <TrendingDown size={14} />}
                      {diag.trend === 'Estável' && <Minus size={14} />}
                      {diag.trend}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                    isHighRisk 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : diag.riskLevel === 'Médio'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    Risco {diag.riskLevel}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <Link 
                  href={`/diagnostico/${diag.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 font-medium text-sm"
                >
                  Análise Completa <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
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
