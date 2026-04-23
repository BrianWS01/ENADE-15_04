import type { Simulado, SimuladoQueryParams, PaginatedResponse, SimuladoStatus } from '@/types';

// Simulados mockados
const MOCK_SIMULADOS: Simulado[] = [
  { id: 'sim1', name: 'Simulado Diagnóstico 2025.1', date: new Date('2025-03-10T14:00:00Z').toISOString(), avg: 4.2, participation: 98, status: 'Finalizado', courseId: 'c2', courseName: 'Biomedicina', createdAt: new Date().toISOString() },
  { id: 'sim2', name: 'Simulado Geral - Enfermagem', date: new Date('2025-04-15T09:00:00Z').toISOString(), avg: 3.8, participation: 85, status: 'Finalizado', courseId: 'c6', courseName: 'Enfermagem', createdAt: new Date().toISOString() },
  { id: 'sim3', name: 'Simulado Final - Direito', date: new Date('2025-05-20T14:00:00Z').toISOString(), avg: 4.5, participation: 95, status: 'Finalizado', courseId: 'c4', courseName: 'Direito', createdAt: new Date().toISOString() },
  { id: 'sim4', name: 'Simulado ENADE - Engenharia Civil', date: new Date('2025-06-10T08:00:00Z').toISOString(), avg: 0, participation: 0, status: 'Em andamento', courseId: 'c7', courseName: 'Engenharia Civil', createdAt: new Date().toISOString() },
  { id: 'sim5', name: '1º Simulado Administração', date: new Date('2025-07-05T19:00:00Z').toISOString(), avg: 0, participation: 0, status: 'Agendado', courseId: 'c1', courseName: 'Administração', createdAt: new Date().toISOString() },
  { id: 'sim6', name: 'Avaliação de Conhecimentos Específicos', date: new Date('2025-03-20T14:00:00Z').toISOString(), avg: 3.5, participation: 75, status: 'Finalizado', courseId: 'c11', courseName: 'Sistemas de Informação', createdAt: new Date().toISOString() },
  { id: 'sim7', name: 'Simulado Formação Geral', date: new Date('2025-04-05T09:00:00Z').toISOString(), avg: 3.9, participation: 88, status: 'Finalizado', courseId: 'c8', courseName: 'Psicologia', createdAt: new Date().toISOString() },
  { id: 'sim8', name: 'Simulado Integrado EaD', date: new Date('2025-05-15T10:00:00Z').toISOString(), avg: 4.1, participation: 92, status: 'Finalizado', courseId: 'c9', courseName: 'Letras - Inglês', createdAt: new Date().toISOString() },
  { id: 'sim9', name: 'Simulado Diagnóstico 2025.2', date: new Date('2025-08-10T14:00:00Z').toISOString(), avg: 0, participation: 0, status: 'Agendado', courseId: 'c3', courseName: 'Ciências Contábeis', createdAt: new Date().toISOString() },
  { id: 'sim10', name: 'Simulado Prático Veterinária', date: new Date('2025-09-05T08:00:00Z').toISOString(), avg: 0, participation: 0, status: 'Agendado', courseId: 'c15', courseName: 'Medicina Veterinária', createdAt: new Date().toISOString() },
  { id: 'sim11', name: 'Simulado de Revisão', date: new Date('2025-04-25T14:00:00Z').toISOString(), avg: 4.0, participation: 90, status: 'Finalizado', courseId: 'c14', courseName: 'Design Gráfico', createdAt: new Date().toISOString() },
  { id: 'sim12', name: 'Simulado Nivelamento', date: new Date('2025-03-01T09:00:00Z').toISOString(), avg: 3.1, participation: 80, status: 'Finalizado', courseId: 'c12', courseName: 'Análise e Desenvolvimento de Sistemas', createdAt: new Date().toISOString() },
];

export async function getMockSimulados(params: SimuladoQueryParams): Promise<PaginatedResponse<Simulado>> {
  let filtered = [...MOCK_SIMULADOS];

  if (params.search) {
    const term = params.search.toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(term) || 
      s.courseName.toLowerCase().includes(term)
    );
  }

  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(s => s.status === params.status);
  }

  if (params.courseId && params.courseId !== 'all') {
    filtered = filtered.filter(s => s.courseId === params.courseId);
  }

  // Ordenação por data (mais recentes primeiro)
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

export async function getMockSimuladoById(id: string): Promise<Simulado | null> {
  const simulado = MOCK_SIMULADOS.find(s => s.id === id);
  return simulado || null;
}
