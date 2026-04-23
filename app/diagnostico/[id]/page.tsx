import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Download,
  Calendar
} from "lucide-react";
import { getDiagnosticoById } from "@/services/diagnostico.service";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DiagnosticoDetailPage(props: Props) {
  const { id } = await props.params;

  const diag = await getDiagnosticoById(id);

  if (!diag) {
    notFound();
  }

  const dateObj = new Date(diag.createdAt);
  const formattedDate = dateObj.toLocaleDateString('pt-BR');

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <Link 
        href="/diagnostico"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 transition-colors w-fit font-medium"
      >
        <ArrowLeft size={16} />
        Voltar para Diagnósticos
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start shadow-sm">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
          <BrainCircuit size={48} />
        </div>
        <div className="flex-1 space-y-3">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Diagnóstico: {diag.courseName}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-zinc-500 flex items-center gap-1.5">
              <Calendar size={14} /> Gerado em {formattedDate}
            </p>
            {diag.simuladoName && (
              <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold px-2.5 py-1 rounded-md">
                Ref: {diag.simuladoName}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 block uppercase font-bold tracking-wider mb-1">Nota Geral</span>
              <span className="text-2xl font-black leading-tight text-zinc-900 dark:text-zinc-100">{diag.scoreGeral.toFixed(1)}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 block uppercase font-bold tracking-wider mb-1">Tendência</span>
              <span className={`text-xl font-black leading-tight ${
                diag.trend === 'Crescente' ? 'text-green-500' :
                diag.trend === 'Em queda' ? 'text-red-500' :
                'text-yellow-500'
              }`}>{diag.trend}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500 block uppercase font-bold tracking-wider mb-1">Nível de Risco</span>
              <span className={`text-xl font-black leading-tight ${
                diag.riskLevel === 'Alto' ? 'text-red-500' :
                diag.riskLevel === 'Médio' ? 'text-yellow-500' :
                'text-green-500'
              }`}>{diag.riskLevel}</span>
            </div>
          </div>
        </div>
        <button className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-sm w-full md:w-auto justify-center shrink-0">
          <Download size={18} />
          Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pontos Fortes */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 h-full shadow-sm">
          <div className="flex items-center gap-3 mb-6 text-green-600 dark:text-green-500">
            <CheckCircle2 size={28} />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Pontos Fortes</h3>
          </div>
          <ul className="space-y-4">
            {diag.strengths.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300 items-start bg-green-50/50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Pontos de Atenção */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 h-full shadow-sm">
          <div className="flex items-center gap-3 mb-6 text-red-600 dark:text-red-500">
            <AlertCircle size={28} />
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Pontos de Atenção</h3>
          </div>
          <ul className="space-y-4">
            {diag.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-3 text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300 items-start bg-red-50/50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-zinc-900 text-zinc-50 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-yellow-400/20 rounded-lg">
              <Lightbulb size={28} className="text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold">Recomendações Estratégicas</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diag.recommendations.map((r, i) => (
              <div key={i} className="bg-zinc-800/80 p-6 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-colors shadow-sm">
                <span className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-3 block">Ação {i + 1}</span>
                <p className="text-sm font-medium leading-relaxed text-zinc-200">{r}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
      </div>
    </div>
  );
}
