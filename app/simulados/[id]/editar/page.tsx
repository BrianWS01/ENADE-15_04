import { updateSimuladoAction } from "@/app/actions/simulado.actions";
import { SimuladoForm } from "@/components/simulados/SimuladoForm";
import { getSimuladoById } from "@/services/simulado.service";
import { getCourses } from "@/services/course.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSimuladoPage(props: Props) {
  const { id } = await props.params;
  const session = await getServerSession(authOptions);

  const [simulado, coursesResponse] = await Promise.all([
    getSimuladoById(id),
    getCourses({ 
      perPage: 100,
      userId: session?.user?.id,
      userRole: session?.user?.role, 
    })
  ]);

  if (!simulado) {
    notFound();
  }

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
          Editar Simulado
        </h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">
          Atualize os dados de {simulado.name}.
        </p>
      </div>

      <SimuladoForm action={updateSimuladoAction} initialData={simulado} courses={coursesResponse.data} />
    </div>
  );
}
