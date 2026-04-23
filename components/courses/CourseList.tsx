import Link from "next/link";
import { GraduationCap, BookOpen, Laptop, Users, TrendingUp, Edit2, ChevronRight } from "lucide-react";
import type { Course, PaginatedResponse } from "@/types";
import { DeleteCourseButton } from "./DeleteCourseButton";

interface Props {
  response: PaginatedResponse<Course>;
}

export function CourseList({ response }: Props) {
  const { data, meta } = response;

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <GraduationCap size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
        <p className="text-zinc-500 font-medium">Nenhum curso encontrado com estes filtros.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Paginação Básica via links de search params */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          {Array.from({ length: meta.totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            const isCurrent = pageNumber === meta.page;
            
            return (
              <Link
                key={pageNumber}
                href={`?page=${pageNumber}`}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                  isCurrent
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const isHighRisk = course.riskLevel === 'Alto';

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {course.name}
          </h4>
          <div className="flex items-center gap-2">
            {course.modality === "Presencial" && <Users size={14} className="text-zinc-400" />}
            {course.modality === "EaD" && <Laptop size={14} className="text-zinc-400" />}
            {course.modality === "Semipresencial" && <BookOpen size={14} className="text-zinc-400" />}
            <span className="text-xs text-zinc-500 font-medium">{course.modality}</span>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg shrink-0">
          <GraduationCap size={18} />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-zinc-500 font-medium">Nota ENADE</span>
          <span className="font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-1 text-sm">
            {course.enadeScore?.toFixed(1)} 
            {(course.enadeScore || 0) >= (course.nationalAvg || 0) && (
              <TrendingUp size={12} className="text-green-500" />
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-zinc-500 font-medium mr-1">Risco</span>
          <span className={`px-2 py-0.5 rounded-full font-bold ${
            isHighRisk 
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
              : course.riskLevel === 'Médio'
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          }`}>
            {course.riskLevel}
          </span>
        </div>
      </div>

      {/* Ações */}
      <div className="pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
        <Link 
          href={`/cursos/${course.id}`}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 transition-colors"
        >
          Ver Análise <ChevronRight size={14} />
        </Link>

        <div className="flex items-center gap-1">
          <Link 
            href={`/cursos/${course.id}/editar`}
            className="text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"
            title="Editar Curso"
          >
            <Edit2 size={16} />
          </Link>
          <DeleteCourseButton id={course.id} />
        </div>
      </div>
    </div>
  );
}
