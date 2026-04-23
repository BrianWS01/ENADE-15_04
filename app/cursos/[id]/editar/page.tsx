import { updateCourseAction } from "@/app/actions/course.actions";
import { CourseForm } from "@/components/courses/CourseForm";
import { getCourseById } from "@/services/course.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCoursePage(props: Props) {
  const { id } = await props.params;
  const course = await getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <Link 
        href="/cursos"
        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para Cursos
      </Link>

      <div>
        <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
          Editar Curso
        </h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">
          Atualize os dados de {course.name}.
        </p>
      </div>

      <CourseForm action={updateCourseAction} initialData={course} />
    </div>
  );
}
