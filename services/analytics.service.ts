import { prisma } from '@/lib/prisma';
import type { CourseAnalytics, GlobalAnalytics, RiskLevel } from '@/types';

// MOCKS INICIAIS (Podem ser movidos para o banco depois)
const NATIONAL_AVG_MOCK: Record<string, { total: number; specific: number; fg: number }> = {
  'Direito': { total: 12, specific: 9, fg: 3 },
  'Administração': { total: 10, specific: 7, fg: 3 },
  'Psicologia': { total: 11, specific: 8, fg: 3 },
  'DEFAULT': { total: 10, specific: 7, fg: 3 }
};

const REGIONAL_AVG_MOCK: Record<string, { total: number }> = {
  'Direito': { total: 11 },
  'Administração': { total: 9 },
  'DEFAULT': { total: 9.5 }
};

import { getBenchmark } from '@/services/benchmark.service';

/**
 * Calcula métricas detalhadas de um curso específico.
 */
export async function getCourseAnalytics(
  courseId: string, 
  session: { user: { id: string; role: string } }
): Promise<CourseAnalytics> {
  const { id: userId, role } = session.user;

  // 1. Busca o curso validando Data Tenancy
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      ...(role === 'PROFESSOR' ? { userId } : {})
    },
    include: {
      students: true,
      results: {
        include: { student: true },
        orderBy: { totalCorrect: 'desc' }
      }
    }
  });

  if (!course) {
    throw new Error('Curso não encontrado ou acesso negado.');
  }

  const results = course.results;
  const totalResults = results.length;
  const totalStudents = course.students.length;

  // 2. Cálculos de Médias
  const sumTotal = results.reduce((acc, r) => acc + r.totalCorrect, 0);
  const sumSpecific = results.reduce((acc, r) => acc + r.specificCorrect, 0);
  const sumFG = results.reduce((acc, r) => acc + r.fgCorrect, 0);

  const avgTotal = totalResults > 0 ? sumTotal / totalResults : 0;
  const avgSpecific = totalResults > 0 ? sumSpecific / totalResults : 0;
  const avgFG = totalResults > 0 ? sumFG / totalResults : 0;

  // 3. Análise de Risco e Ranking
  const risk = {
    high: 0,
    medium: 0,
    low: 0,
    students: [] as any[]
  };

  results.forEach(r => {
    let level: RiskLevel = 'Baixo';
    if (r.totalCorrect < 8) { // Ajustado para corresponder a "abaixo de 2.0" (ex: 8 acertos de 20 ou 40%)
      level = 'Alto';
      risk.high++;
    } else if (r.totalCorrect < 12) {
      level = 'Médio';
      risk.medium++;
    } else {
      risk.low++;
    }

    if (level === 'Alto' || level === 'Médio') {
      risk.students.push({
        id: r.student.id,
        name: r.student.name,
        ra: r.student.ra,
        score: r.totalCorrect,
        level
      });
    }
  });

  // 4. Comparações com Benchmark Real
  const benchmark = await getBenchmark(course.name, 2023) || await getBenchmark(course.name, 2024);

  const nationalMock = NATIONAL_AVG_MOCK[course.name] || NATIONAL_AVG_MOCK['DEFAULT'];
  const regionalMock = REGIONAL_AVG_MOCK[course.name] || REGIONAL_AVG_MOCK['DEFAULT'];

  const getComparison = (current: number, target: number) => {
    const diff = target > 0 ? ((current - target) / target) * 100 : 0;
    const status = diff > 0 ? 'above' : diff < 0 ? 'below' : 'equal';
    return { diff: Math.abs(Number(diff.toFixed(1))), status: status as any };
  };

  // Bloco: Simulado atual vs UF e Brasil
  const vsUf = benchmark ? {
    fg: Number((avgFG - benchmark.avgFgUf).toFixed(2)),
    ce: Number((avgSpecific - benchmark.avgCeUf).toFixed(2))
  } : undefined;

  const vsBrasil = benchmark ? {
    fg: Number((avgFG - benchmark.avgFgBrasil).toFixed(2)),
    ce: Number((avgSpecific - benchmark.avgCeBrasil).toFixed(2))
  } : undefined;

  // Bloco: Simulado atual vs ENADE anterior da instituição
  const hasCourseData = benchmark?.avgFgCourse != null && benchmark?.avgCeCourse != null;
  const vsLastEnade = benchmark ? {
    fg: hasCourseData ? Number((avgFG - benchmark.avgFgCourse!).toFixed(2)) : null,
    ce: hasCourseData ? Number((avgSpecific - benchmark.avgCeCourse!).toFixed(2)) : null,
    hasData: hasCourseData
  } : undefined;

  // Bloco: Posição histórica — ENADE da IES vs UF/Brasil naquele ciclo
  const historicalPosition = benchmark ? {
    fg: hasCourseData ? {
      course: benchmark.avgFgCourse!,
      uf: benchmark.avgFgUf,
      brasil: benchmark.avgFgBrasil
    } : null,
    ce: hasCourseData ? {
      course: benchmark.avgCeCourse!,
      uf: benchmark.avgCeUf,
      brasil: benchmark.avgCeBrasil
    } : null,
    hasData: hasCourseData
  } : undefined;

  // Bloco: Dados brutos para referência direta no frontend
  const baseline = benchmark ? {
    avgFgCourse: benchmark.avgFgCourse,
    avgCeCourse: benchmark.avgCeCourse,
    avgFgUf: benchmark.avgFgUf,
    avgFgBrasil: benchmark.avgFgBrasil,
    avgCeUf: benchmark.avgCeUf,
    avgCeBrasil: benchmark.avgCeBrasil,
    year: benchmark.year
  } : undefined;

  // 5. Retorno Estruturado
  return {
    averages: {
      total: Number(avgTotal.toFixed(2)),
      specific: Number(avgSpecific.toFixed(2)),
      fg: Number(avgFG.toFixed(2)),
    },
    risk: {
      ...risk,
      highRate: totalResults > 0 ? (risk.high / totalResults) * 100 : 0,
    },
    comparison: {
      national: getComparison(avgTotal, nationalMock.total),
      regional: getComparison(avgTotal, regionalMock.total),
      vsUf,
      vsBrasil,
      vsLastEnade,
      historicalPosition,
      baseline,
    },
    ranking: {
      top: results.slice(0, 5).map(r => ({ name: r.student.name, score: r.totalCorrect })),
      bottom: results.slice(-5).reverse().map(r => ({ name: r.student.name, score: r.totalCorrect })),
    },
    participation: {
      totalStudents,
      participated: totalResults,
      rate: totalStudents > 0 ? (totalResults / totalStudents) * 100 : 0,
    },
    insights: generateInsights(avgTotal, avgSpecific, avgFG, nationalMock, risk, { vsUf, vsBrasil, vsLastEnade })
  };
}

function generateInsights(
  avgTotal: number,
  avgSpecific: number,
  avgFG: number,
  nationalMock: any,
  risk: any,
  bk?: { vsUf?: any; vsBrasil?: any; vsLastEnade?: any }
): string[] {
  const insights: string[] = [];

  // Insights de evolução vs ENADE anterior da instituição (mais prioritário)
  if (bk?.vsLastEnade?.hasData) {
    const fgEv = bk.vsLastEnade.fg as number;
    const ceEv = bk.vsLastEnade.ce as number;
    if (fgEv > 0) {
      insights.push(`📈 Evolução positiva em Formação Geral: +${fgEv.toFixed(1)} pts em relação ao último ENADE oficial.`);
    } else if (fgEv < 0) {
      insights.push(`📉 Recessão em Formação Geral: ${fgEv.toFixed(1)} pts abaixo do último ENADE oficial.`);
    }
    if (ceEv > 0) {
      insights.push(`🏆 Evolução positiva em Conhecimento Específico: +${ceEv.toFixed(1)} pts vs último ENADE.`);
    } else if (ceEv < 0) {
      insights.push(`⚠️ Conhecimento Específico caiu ${Math.abs(ceEv).toFixed(1)} pts em relação ao último ENADE.`);
    }
  }

  // Insights vs UF
  if (bk?.vsUf) {
    if (bk.vsUf.fg < 0) {
      insights.push(`🚨 Formação Geral abaixo da média estadual (${Math.abs(bk.vsUf.fg).toFixed(1)} pts).`);
    } else if (bk.vsUf.fg > 0) {
      insights.push(`✅ Formação Geral acima da média estadual (+${bk.vsUf.fg.toFixed(1)} pts).`);
    }
  }

  // Insights vs Brasil
  if (bk?.vsBrasil) {
    if (bk.vsBrasil.ce < 0) {
      insights.push(`⚠️ Conhecimentos Específicos abaixo da média nacional (${Math.abs(bk.vsBrasil.ce).toFixed(1)} pts).`);
    } else if (bk.vsBrasil.ce > 0) {
      insights.push(`🏅 Destaque nacional em Específicos (+${bk.vsBrasil.ce.toFixed(1)} pts vs Brasil).`);
    }
  }

  // Fallback quando não há benchmark real cadastrado
  if (!bk?.vsUf && !bk?.vsBrasil) {
    if (avgTotal < nationalMock.total) {
      insights.push("⚠️ Média geral abaixo da referência nacional.");
    }
    if (avgFG < nationalMock.fg) {
      insights.push("📘 Formação Geral abaixo do esperado.");
    }
    if (avgTotal > nationalMock.total * 1.1) {
      insights.push("✅ Desempenho 10% acima da média nacional.");
    }
  }

  if (risk.highRate > 15) {
    insights.push("🚨 Alta concentração de alunos em Risco Alto (acima de 15%).");
  }

  if (insights.length === 0) {
    insights.push("ℹ️ Desempenho estável dentro das médias esperadas.");
  }

  return insights;
}

/**
 * Calcula métricas globais para o Dashboard principal.
 */
export async function getGlobalAnalytics(
  session: { user: { id: string; role: string } }
): Promise<GlobalAnalytics> {
  const { id: userId, role } = session.user;

  const whereClause = role === 'PROFESSOR' ? { userId } : {};

  // Busca dados agregados
  const courses = await prisma.course.findMany({
    where: whereClause,
    include: {
      _count: { select: { students: true } },
      results: { select: { totalCorrect: true } }
    }
  });

  const totalCourses = courses.length;
  let totalStudents = 0;
  let totalScore = 0;
  let totalResultsCount = 0;
  
  const riskCounts = { high: 0, medium: 0, low: 0 };
  const areaPerformance: Record<string, { sum: number; count: number }> = {};

  courses.forEach(c => {
    totalStudents += c._count.students;
    c.results.forEach(r => {
      totalScore += r.totalCorrect;
      totalResultsCount++;

      if (r.totalCorrect < 8) riskCounts.high++;
      else if (r.totalCorrect < 12) riskCounts.medium++;
      else riskCounts.low++;
    });

    if (!areaPerformance[c.category]) {
      areaPerformance[c.category] = { sum: 0, count: 0 };
    }
    const courseAvg = c.results.length > 0 
      ? c.results.reduce((a, b) => a + b.totalCorrect, 0) / c.results.length 
      : 0;
    
    areaPerformance[c.category].sum += courseAvg;
    areaPerformance[c.category].count++;
  });

  return {
    totalStudents,
    totalCourses,
    globalAvg: totalResultsCount > 0 ? Number((totalScore / totalResultsCount).toFixed(2)) : 0,
    riskDistribution: [
      { name: 'Alto Risco', value: riskCounts.high },
      { name: 'Médio Risco', value: riskCounts.medium },
      { name: 'Baixo Risco', value: riskCounts.low },
    ],
    performanceByArea: Object.entries(areaPerformance).map(([area, data]) => ({
      area,
      avg: Number((data.sum / data.count).toFixed(2))
    }))
  };
}
