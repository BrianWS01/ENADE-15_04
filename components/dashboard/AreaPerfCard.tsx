import type { AreaKPI } from "@/types";

type Props = AreaKPI;

export function AreaPerfCard({ title, count, avg }: Props) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group shadow-sm">
      <div>
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
          {title}
        </h4>
        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">
          {count} cursos avaliados
        </p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{avg}</p>
        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Média</p>
      </div>
    </div>
  );
}
