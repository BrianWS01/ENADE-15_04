import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, Search } from "lucide-react";
import { getSimuladoById } from "@/services/simulado.service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SimuladoStudentsPage(props: Props) {
  const { id } = await props.params;
  const simulado = await getSimuladoById(id);

  if (!simulado) {
    notFound();
  }

  const results = simulado.results || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-4">
        <Link 
          href={`/simulados/${id}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors w-fit font-medium"
        >
          <ArrowLeft size={16} />
          Voltar para Detalhes do Simulado
        </Link>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">Lista de Alunos</h1>
            <p className="text-zinc-500 font-medium">{simulado.name} — {simulado.courseName}</p>
          </div>
          <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400">
            {results.length} Alunos Participantes
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-bottom border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Aluno</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">RA</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Nota Geral</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {results.map((r, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{r.student.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500 font-mono">
                    {r.student.ra}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-black text-lg ${r.totalCorrect < 10 ? 'text-red-500' : 'text-blue-600'}`}>
                      {r.totalCorrect}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      r.totalCorrect < 10 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {r.totalCorrect < 10 ? 'Risco' : 'Seguro'}
                    </span>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 italic">
                    Nenhum aluno encontrado para este simulado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
