import { getSimulados } from "@/services/simulado.service";
import { SimuladoFilters } from "@/components/simulados/SimuladoFilters";
import { SimuladoList } from "@/components/simulados/SimuladoList";
import { FileCheck, BarChart2 } from "lucide-react";
import { HistoricalChart } from "@/components/historical-chart";
import { getHistoricalChartData } from "@/services/dashboard.service";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SimuladosPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const courseId = typeof searchParams.courseId === "string" ? searchParams.courseId : undefined;

  const [response, chartData] = await Promise.all([
    getSimulados({
      page,
      perPage: 5,
      search,
      status,
      courseId,
      userId: session?.user?.id,
      userRole: session?.user?.role,
    }),
    getHistoricalChartData() // Reusing for the projection chart
  ]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
            Módulo de Simulados
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Registre e compare simulados acadêmicos com o ENADE oficial.
          </p>
        </div>
        <Link href="/simulados/novo" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm">
          Novo Simulado
          <FileCheck size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SimuladoFilters
            initialSearch={search}
            initialStatus={status}
            initialCourseId={courseId}
          />
          
          <SimuladoList response={response} />
          
          <div className="bg-blue-600 text-white p-8 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-900/20">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Gap de Aprendizado Detectado</h3>
              <p className="text-blue-100 text-sm max-w-md font-medium leading-relaxed">
                O desempenho na Formação Geral nos últimos simulados está 15% abaixo do esperado para atingir a meta oficial.
              </p>
            </div>
            <BarChart2 size={64} className="text-white/20 hidden sm:block shrink-0" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col shadow-sm h-fit">
          <h3 className="font-bold text-lg mb-6 text-zinc-900 dark:text-zinc-100">Projeção ENADE Real</h3>
          <div className="flex-1 space-y-6">
            <div className="h-48 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 p-4">
              <HistoricalChart data={chartData} />
            </div>
            <div className="space-y-5">
               <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 mb-1.5 tracking-wider">
                     <span>Probabilidade de Nota 4 ou 5</span>
                     <span className="text-green-600 dark:text-green-400">65%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 w-[65%] rounded-full" />
                  </div>
               </div>
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-zinc-500 mb-1.5 tracking-wider">
                     <span>Engajamento do Aluno</span>
                     <span className="text-blue-600 dark:text-blue-400">92%</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-[92%] rounded-full" />
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

