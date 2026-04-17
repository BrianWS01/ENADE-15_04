import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export function SummaryIconCard({ title, value, icon }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">{icon}</div>
      <div>
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-tight">
          {title}
        </h4>
        <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}
