import { getDiagnosticos } from "@/services/diagnostico.service";
import { DiagnosticoFilters } from "@/components/diagnosticos/DiagnosticoFilters";
import { DiagnosticoList } from "@/components/diagnosticos/DiagnosticoList";
import { BrainCircuit, ChevronRight } from "lucide-react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DiagnosticoPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const riskLevel = typeof searchParams.riskLevel === "string" ? searchParams.riskLevel : undefined;
  // TODO: Add course list to select from in filters later if needed, for now just pass URL params
  const courseId = typeof searchParams.courseId === "string" ? searchParams.courseId : undefined;

  const response = await getDiagnosticos({
    page,
    perPage: 6,
    riskLevel,
    courseId,
    userId: session?.user?.id,
    userRole: session?.user?.role,
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
            Diagnósticos Inteligentes
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Análises geradas com base nos dados do ciclo atual e simulados recentes.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
          Gerar Novo Relatório
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="space-y-6">
        <DiagnosticoFilters initialRiskLevel={riskLevel} />
        
        <DiagnosticoList response={response} />
      </div>
    </div>
  );
}

