import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { 
  LayoutDashboard, 
  BarChart3, 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  Settings
} from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { UserMenu } from "@/components/auth/UserMenu";

export const metadata: Metadata = {
  title: "ENADE SaaS - Desempenho Acadêmico",
  description: "Análise inteligente de desempenho ENADE e simulados",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Acessa a sessão no Server Component
  const session = await getServerSession(authOptions);

  // Se não houver sessão (usuário deslogado na página de login, por exemplo), renderiza apenas o conteúdo
  if (!session) {
    return (
      <html lang="pt-BR">
        <body className="antialiased bg-zinc-50 dark:bg-zinc-950">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className="antialiased bg-zinc-50 dark:bg-[#09090b]">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex flex-col shrink-0">
            <div className="p-6">
              <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                ENADE<span className="text-blue-600">SaaS</span>
              </h1>
            </div>
            
            <nav className="flex-1 px-4 py-2 space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link href="/cursos" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <BookOpen size={18} />
                Cursos
              </Link>
              <Link href="/simulados" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <BookOpen size={18} />
                Simulados
              </Link>
              <Link href="/diagnostico" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <BrainCircuit size={18} />
                Diagnóstico IA
              </Link>
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
              <Link href="/configuracoes" className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-bold rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Settings size={18} />
                Configurações
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto relative">
            <header className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-8 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-0.5">Painel Administrativo</h2>
                <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Visão Geral</h1>
              </div>
              
              {/* O componente cliente renderiza a UI de deslogar e interações */}
              <UserMenu user={session.user || {}} />
            </header>
            
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
