import type { DashboardData, ChartDataPoint, RadarDataPoint } from '@/types';

// Dados mock que respeitam 100% o contrato real de DashboardData.
// Quando o Prisma adapter estiver pronto, este arquivo pode ser deletado
// sem alterar nenhum componente.

export function getMockDashboard(): DashboardData {
  return {
    stats: {
      avgEnade: '3.72',
      totalCourses: 8,
      aboveAvg: 6,
      participation: '87.5%',
    },
    courses: [
      { name: 'Enfermagem', score: 4.2 },
      { name: 'Biomedicina', score: 4.1 },
      { name: 'Direito', score: 3.9 },
      { name: 'Ciências Contábeis', score: 3.8 },
      { name: 'Psicologia', score: 3.7 },
      { name: 'Educação Física', score: 3.5 },
      { name: 'Administração', score: 3.2 },
      { name: 'Engenharia Civil', score: 2.8 },
    ],
    areas: [
      { title: 'Bacharelado', count: 8, avg: 3.7 },
    ],
    alerts: [
      {
        course: 'Engenharia Civil',
        level: 'Alta',
        title: 'Abaixo da Média Nacional',
        desc: 'Nota atual: 2.8 — média nacional: 3.3',
        type: 'danger',
      },
    ],
  };
}

export function getMockHistoricalChart(): ChartDataPoint[] {
  return [
    { year: '2018', score: 3.2 },
    { year: '2019', score: 3.4 },
    { year: '2021', score: 3.5 },
    { year: '2023', score: 3.8 },
  ];
}

export function getMockRadarData(): RadarDataPoint[] {
  return [
    { subject: 'Formação Geral', value: 85, fullMark: 100 },
    { subject: 'Específico', value: 92, fullMark: 100 },
    { subject: 'IDD', value: 78, fullMark: 100 },
    { subject: 'Participação', value: 96, fullMark: 100 },
    { subject: 'Evolução', value: 70, fullMark: 100 },
  ];
}
