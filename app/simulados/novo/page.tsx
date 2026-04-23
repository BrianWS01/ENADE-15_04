import { createSimuladoAction } from "@/app/actions/simulado.actions";
import { SimuladoForm } from "@/components/simulados/SimuladoForm";
import { getCourses } from "@/services/course.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NewSimuladoPage() {
  const session = await getServerSession(authOptions);

  // Busca todos os cursos para popular o select (limitado aos do professor, se for o caso)
  const coursesResponse = await getCourses({ 
    perPage: 100,
    userId: session?.user?.id,
    userRole: session?.user?.role, 
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <Link 
        href="/simulados"
        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para Simulados
      </Link>

      <div>
        <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
          Novo Simulado
        </h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">
          Agende um novo simulado vinculado a um curso existente.
        </p>
      </div>

      <SimuladoForm action={createSimuladoAction} courses={coursesResponse.data} />
    </div>
  );
}
