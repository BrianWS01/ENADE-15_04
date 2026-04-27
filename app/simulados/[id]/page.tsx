import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Target, Users, BookOpen, AlertTriangle } from "lucide-react";
import { getSimuladoById } from "@/services/simulado.service";
import { StatCard } from "@/components/dashboard/StatCard";
import { CompetenceRadar } from "@/components/competence-radar";
import { getRadarData } from "@/services/dashboard.service"; // Reusing for placeholder chart

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SimuladoDetailPage(props: Props) {
  const { id } = await props.params;

  const [simulado, radarData] = await Promise.all([
    getSimuladoById(id),
    getRadarData(id) // Reusing dashboard service radar data for now
  ]);

  if (!simulado) {
    notFound();
  }

  const isFinished = simulado.status === "Finalizado";
  const dateObj = new Date(simulado.date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR');
  const isHighRisk = simulado.avg < 3.0 && isFinished;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header com Navegação */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/simulados"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors w-fit font-medium"
        >
          <ArrowLeft size={16} />
          Voltar para Simulados
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">{simulado.name}</h1>
              <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                  simulado.status === 'Finalizado' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  simulado.status === 'Em andamento' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }`}>
                  {simulado.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {simulado.courseName}
              </span>
              <span className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
                <Calendar size={14} /> Aplicado em {formattedDate}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 px-4 py-2.5 rounded-xl border border-blue-100 dark:border-blue-900/20 shrink-0">
            <Target size={18} />
            <span className="font-bold text-sm tracking-tight">Análise Preditiva ENADE</span>
          </div>
        </div>
      </div>

      {isFinished ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Média do Simulado" 
              value={simulado.avg.toFixed(1)} 
              trend={simulado.avg >= 3.0 ? "Adequado" : "Atenção necessária"}
              trendLabel=""
              isPositive={simulado.avg >= 3.0} 
            />
            <StatCard 
              label="Taxa de Participação" 
              value={`${simulado.participation.toFixed(1)}%`} 
              trend={simulado.participation > 80 ? "Boa amostragem" : "Risco estatístico"}
              trendLabel=""
              isPositive={simulado.participation > 80} 
            />
            <StatCard 
              label="Acertos: Formação Geral" 
              value="62%" 
              trend="Abaixo da meta"
              trendLabel=""
              isPositive={false} 
            />
            <StatCard 
              label="Acertos: Específico" 
              value="78%" 
              trend="Acima da meta"
              trendLabel=""
              isPositive={true} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg mb-6 text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                Desempenho por Competência
              </h3>
              <div className="flex-1 min-h-[400px]">
                <CompetenceRadar data={radarData} />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col gap-6">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" />
                Alunos em Risco
              </h3>
              <div className="space-y-4 flex-1">
                <p className="text-sm text-zinc-500 font-medium">
                  Alunos com pontuação abaixo de 2.0 que precisam de intervenção imediata antes do ENADE.
                </p>
                
                {/* Lista mockada estática para visualização temporária */}
                <ul className="space-y-3 mt-4">
                  {(simulado.results || []).slice(0, 4).map((result, idx) => (
                    <li key={idx} className="flex justify-between items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{result.student.name}</span>
                      <span className="font-black text-red-500 text-sm">{result.totalCorrect}</span>
                    </li>
                  ))}
                  {(!simulado.results || simulado.results.length === 0) && (
                    <p className="text-zinc-500 text-xs italic">Nenhum aluno em nível de risco detectado.</p>
                  )}
                </ul>
              </div>
              <Link 
                href={`/simulados/${id}/alunos`}
                className="w-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 py-2.5 rounded-lg text-sm font-bold transition-colors text-center"
              >
                Ver todos os alunos
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <Calendar size={64} className="text-zinc-300 dark:text-zinc-700 mb-6" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Simulado Não Finalizado</h2>
          <p className="text-zinc-500 max-w-md">
            Os relatórios preditivos e diagnósticos detalhados estarão disponíveis assim que este simulado for concluído e as notas forem processadas.
          </p>
        </div>
      )}
    </div>
  );
}
