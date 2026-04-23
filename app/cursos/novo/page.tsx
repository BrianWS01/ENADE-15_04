import { createCourseAction } from "@/app/actions/course.actions";
import { CourseForm } from "@/components/courses/CourseForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCoursePage() {
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
          Novo Curso
        </h2>
        <p className="text-sm text-zinc-500 font-medium mt-1">
          Cadastre um novo curso para acompanhar seu desempenho.
        </p>
      </div>

      <CourseForm action={createCourseAction} />
    </div>
  );
}
