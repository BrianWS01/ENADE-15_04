import type { Course, CourseQueryParams, PaginatedResponse } from '@/types';

// Mock de 15+ cursos para uso no adaptador
const MOCK_COURSES: Course[] = [
  { id: 'c1', name: 'Administração', category: 'Bacharelado', modality: 'Semipresencial', enadeScore: 3.2, nationalAvg: 3.1, participationRate: 85, idd: 3.4, riskLevel: 'Baixo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c2', name: 'Biomedicina', category: 'Bacharelado', modality: 'Presencial', enadeScore: 4.1, nationalAvg: 3.5, participationRate: 94, idd: 4.2, riskLevel: 'Baixo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c3', name: 'Ciências Contábeis', category: 'Bacharelado', modality: 'Semipresencial', enadeScore: 3.8, nationalAvg: 3.2, participationRate: 88, idd: 3.9, riskLevel: 'Baixo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c4', name: 'Direito', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.9, nationalAvg: 3.4, participationRate: 92, idd: 3.8, riskLevel: 'Médio', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c5', name: 'Educação Física', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.5, nationalAvg: 3.2, participationRate: 80, idd: 3.5, riskLevel: 'Médio', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c6', name: 'Enfermagem', category: 'Bacharelado', modality: 'Presencial', enadeScore: 4.2, nationalAvg: 3.6, participationRate: 96, idd: 4.1, riskLevel: 'Baixo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c7', name: 'Engenharia Civil', category: 'Bacharelado', modality: 'Presencial', enadeScore: 2.8, nationalAvg: 3.3, participationRate: 75, idd: 2.9, riskLevel: 'Alto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c8', name: 'Psicologia', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.7, nationalAvg: 3.5, participationRate: 90, idd: 3.6, riskLevel: 'Médio', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c9', name: 'Letras - Inglês', category: 'Licenciatura', modality: 'EaD', enadeScore: 4.0, nationalAvg: 3.8, participationRate: 89, idd: 3.9, riskLevel: 'Baixo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c10', name: 'Pedagogia', category: 'Licenciatura', modality: 'EaD', enadeScore: 3.1, nationalAvg: 3.0, participationRate: 82, idd: 3.1, riskLevel: 'Médio', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c11', name: 'Sistemas de Informação', category: 'Bacharelado', modality: 'Presencial', enadeScore: 4.5, nationalAvg: 3.9, participationRate: 95, idd: 4.6, riskLevel: 'Baixo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c12', name: 'Análise e Desenvolvimento de Sistemas', category: 'Tecnológico', modality: 'EaD', enadeScore: 3.4, nationalAvg: 3.5, participationRate: 78, idd: 3.3, riskLevel: 'Médio', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c13', name: 'Marketing', category: 'Tecnológico', modality: 'EaD', enadeScore: 3.8, nationalAvg: 3.6, participationRate: 91, idd: 3.7, riskLevel: 'Baixo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c14', name: 'Design Gráfico', category: 'Tecnológico', modality: 'Presencial', enadeScore: 4.3, nationalAvg: 4.0, participationRate: 93, idd: 4.1, riskLevel: 'Baixo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c15', name: 'Medicina Veterinária', category: 'Bacharelado', modality: 'Presencial', enadeScore: 2.9, nationalAvg: 3.2, participationRate: 70, idd: 3.0, riskLevel: 'Alto', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c16', name: 'Arquitetura e Urbanismo', category: 'Bacharelado', modality: 'Presencial', enadeScore: 3.6, nationalAvg: 3.5, participationRate: 86, idd: 3.5, riskLevel: 'Médio', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export async function getMockCourses(params: CourseQueryParams): Promise<PaginatedResponse<Course>> {
  let filtered = [...MOCK_COURSES];

  if (params.search) {
    const term = params.search.toLowerCase();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(term));
  }

  if (params.category && params.category !== 'all') {
    filtered = filtered.filter(c => c.category === params.category);
  }

  if (params.riskLevel && params.riskLevel !== 'all') {
    filtered = filtered.filter(c => c.riskLevel === params.riskLevel);
  }

  const page = params.page || 1;
  const perPage = params.perPage || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);

  const start = (page - 1) * perPage;
  const paginatedData = filtered.slice(start, start + perPage);

  return {
    data: paginatedData,
    meta: {
      total,
      page,
      perPage,
      totalPages,
    },
  };
}

export async function getMockCourseById(id: string): Promise<Course | null> {
  const course = MOCK_COURSES.find(c => c.id === id);
  return course || null;
}
