import {
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  BarChart3,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from "lucide-react";
import { HistoricalChart } from "@/components/historical-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopCourseRow } from "@/components/dashboard/TopCourseRow";
import { AreaPerfCard } from "@/components/dashboard/AreaPerfCard";
import { AlertItemCard } from "@/components/dashboard/AlertItemCard";
import { SummaryIconCard } from "@/components/dashboard/SummaryIconCard";
import { UploadButton } from "@/components/dashboard/UploadButton";
import {
  getDashboardData,
  getHistoricalChartData,
} from "@/services/dashboard.service";

// Server Component — sem useState, sem useEffect, sem fetch no cliente.
// Dados fluem do service → page → componentes tipados.
export default async function Dashboard() {
  const [data, chartData] = await Promise.all([
    getDashboardData(),
    getHistoricalChartData(),
  ]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">
            Visão geral do desempenho institucional no ENADE
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-xl hidden md:flex items-center gap-2 shadow-sm">
            <Search size={16} className="text-zinc-400 ml-2" />
            <input
              type="text"
              placeholder="Buscar curso..."
              className="bg-transparent border-none focus:outline-none text-sm w-48 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <UploadButton />
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Média Geral ENADE"
          value={data.stats.avgEnade}
          trend="+2.3%"
          trendLabel="vs. ciclo anterior"
          isPositive={true}
        />
        <StatCard
          label="Total de Cursos Avaliados"
          value={data.stats.totalCourses}
          trend="+4.3%"
          trendLabel="vs. ciclo anterior"
          isPositive={true}
        />
        <StatCard
          label="Cursos Acima da Média Nacional"
          value={data.stats.aboveAvg}
          trend="+7.1%"
          trendLabel="vs. ciclo anterior"
          isPositive={true}
        />
        <StatCard
          label="Taxa de Participação"
          value={data.stats.participation}
          trend="-2.1%"
          trendLabel="vs. ciclo anterior"
          isPositive={false}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-100 italic underline decoration-blue-500/30">
            <BarChart3 size={18} className="text-blue-500" />
            Evolução Histórica da Média ENADE
          </h3>
          <div className="h-[300px]">
            <HistoricalChart data={chartData} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-zinc-900 dark:text-zinc-100 italic underline decoration-yellow-500/30">
            <Zap size={18} className="text-yellow-500" />
            Top Cursos por Nota ENADE
          </h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {data.courses.map((c) => (
              <TopCourseRow key={c.name} name={c.name} score={c.score} />
            ))}
          </div>
        </div>
      </div>

      {/* Areas + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 text-zinc-900 dark:text-zinc-100">
            <h3 className="text-lg font-bold">Desempenho por Área de Conhecimento</h3>
          </div>
          <div className="space-y-3">
            {data.areas.map((a) => (
              <AreaPerfCard key={a.title} title={a.title} count={a.count} avg={a.avg} />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 text-zinc-900 dark:text-zinc-100">
            <h3 className="text-lg font-bold">Alertas Recentes</h3>
            <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-6">
            {data.alerts.length > 0 ? (
              data.alerts.map((alert) => (
                <AlertItemCard key={alert.course} {...alert} />
              ))
            ) : (
              <p className="text-zinc-500 text-xs italic text-center py-8">
                Nenhum alerta crítico detectado no momento.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryIconCard
          title="Cursos em Crescimento"
          value="12"
          icon={<TrendingUp className="text-green-500" />}
        />
        <SummaryIconCard
          title="Cursos em Declínio"
          value="3"
          icon={<ArrowDownRight className="text-red-500" />}
        />
        <SummaryIconCard
          title="Requer Atenção"
          value="5"
          icon={<AlertTriangle className="text-yellow-500" />}
        />
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-400 gap-4">
        <p>© 2026 ENADE Analytics. Todos os direitos reservados.</p>
        <div className="flex items-center gap-2">
          <span>Desenvolvido por</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full" /> WoodCompany
          </span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors uppercase font-bold tracking-tighter">
            Privacidade
          </a>
          <a href="#" className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors uppercase font-bold tracking-tighter">
            Termos
          </a>
        </div>
      </div>
    </div>
  );
}
