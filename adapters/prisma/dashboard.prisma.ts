import { prisma } from '@/lib/prisma';
import type { DashboardData, AlertItem, AlertLevel, AlertType } from '@/types';

// Implementação real usando Prisma.
// Mesmo contrato de DashboardData que o mock — componentes não sabem a diferença.

export async function getPrismaDashboard(): Promise<DashboardData> {
  const courses = await prisma.course.findMany({
    orderBy: { enadeScore: 'desc' },
  });

  const totalCourses = courses.length;

  if (totalCourses === 0) {
    return {
      stats: { avgEnade: '0.00', totalCourses: 0, aboveAvg: 0, participation: '0%' },
      courses: [],
      areas: [],
      alerts: [],
    };
  }

  const avgEnade = courses.reduce((acc, c) => acc + c.enadeScore, 0) / totalCourses;
  const aboveAvg = courses.filter(c => c.enadeScore > c.nationalAvg).length;
  const avgParticipation =
    courses.reduce((acc, c) => acc + c.participationRate, 0) / totalCourses;

  // Agrupar por categoria
  const areasMap = new Map<string, { count: number; sum: number }>();
  for (const c of courses) {
    const prev = areasMap.get(c.category) ?? { count: 0, sum: 0 };
    areasMap.set(c.category, { count: prev.count + 1, sum: prev.sum + c.enadeScore });
  }
  const areas = Array.from(areasMap.entries()).map(([title, val]) => ({
    title,
    count: val.count,
    avg: Number((val.sum / val.count).toFixed(1)),
  }));

  // Alertas dinâmicos
  const alerts: AlertItem[] = courses
    .filter(c => c.riskLevel === 'Alto' || c.enadeScore < 3)
    .map(c => {
      const isHigh = c.riskLevel === 'Alto';
      return {
        course: c.name,
        level: (isHigh ? 'Alta' : 'Média') as AlertLevel,
        title: c.enadeScore < 3 ? 'Abaixo da Média Nacional' : 'Alerta de Risco',
        desc: `Nota atual: ${c.enadeScore.toFixed(1)} — Média nacional: ${c.nationalAvg.toFixed(1)}`,
        type: (isHigh ? 'danger' : 'warning') as AlertType,
      };
    });

  return {
    stats: {
      avgEnade: avgEnade.toFixed(2),
      totalCourses,
      aboveAvg,
      participation: avgParticipation.toFixed(1) + '%',
    },
    courses: courses.map(c => ({ name: c.name, score: c.enadeScore })),
    areas,
    alerts,
  };
}
