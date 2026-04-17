"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { DashboardStats } from "@/types";

interface Props {
  label: string;
  value: string | number;
  trend: string;
  trendLabel: string;
  isPositive: boolean;
}

export function StatCard({ label, value, trend, trendLabel, isPositive }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
        {label}
      </h4>
      <p className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">
        {value}
      </p>
      <div
        className={`flex items-center gap-1.5 mt-3 text-xs font-bold ${
          isPositive
            ? "text-green-600 dark:text-green-500"
            : "text-red-600 dark:text-red-500"
        }`}
      >
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend}</span>
        <span className="text-zinc-400 font-medium ml-1 text-[10px]">{trendLabel}</span>
      </div>
    </div>
  );
}
