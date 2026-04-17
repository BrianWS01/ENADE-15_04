import { ShieldAlert, AlertTriangle, Users } from "lucide-react";
import type { AlertItem as AlertItemType } from "@/types";

type Props = AlertItemType;

const levelColors: Record<string, string> = {
  Alta: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  Média: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Baixa: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
};

export function AlertItemCard({ course, level, title, desc, type }: Props) {
  return (
    <div className="space-y-2 group cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {type === "danger" && <ShieldAlert size={16} className="text-red-500" />}
          {type === "warning" && <AlertTriangle size={16} className="text-yellow-500" />}
          {type === "info" && <Users size={16} className="text-blue-500" />}
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{course}</span>
        </div>
        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${levelColors[level]}`}
        >
          {level}
        </span>
      </div>
      <div className="pl-6 border-l-2 border-zinc-100 dark:border-zinc-800 group-hover:border-blue-500 transition-colors">
        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{title}</p>
        <p className="text-[11px] text-zinc-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
