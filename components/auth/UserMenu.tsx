"use client";

import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon } from "lucide-react";

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function UserMenu({ user }: Props) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-sm">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1.5 rounded-full">
          <UserIcon size={16} />
        </div>
        <div className="flex flex-col pr-2">
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {user.name || "Usuário"}
          </span>
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider leading-tight">
            Admin
          </span>
        </div>
      </div>
      
      <button 
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="p-2.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
        title="Sair do sistema"
      >
        <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
