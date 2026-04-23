import { getCourses } from "@/services/course.service";
import { CourseFilters } from "@/components/courses/CourseFilters";
import { CourseList } from "@/components/courses/CourseList";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CoursesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined;
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const riskLevel = typeof searchParams.riskLevel === "string" ? searchParams.riskLevel : undefined;

  const response = await getCourses({
    page,
    perPage: 6,
    search,
    category,
    riskLevel,
    userId: session?.user?.id,
    userRole: session?.user?.role,
  });

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
            Catálogo de Cursos
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            Gerencie e analise todos os cursos cadastrados na base.
          </p>
        </div>
        <Link 
          href="/cursos/novo"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
        >
          Novo Curso
        </Link>
      </div>

      {/* Filtros interativos */}
      <CourseFilters
        initialSearch={search}
        initialCategory={category}
        initialRiskLevel={riskLevel}
      />

      {/* Lista de cursos paginada */}
      <CourseList response={response} />
    </div>
  );
}

