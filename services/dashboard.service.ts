import type { DashboardData, ChartDataPoint, RadarDataPoint } from '@/types';

// =============================================================================
// DASHBOARD SERVICE — Fachada pública
//
// Os componentes e rotas de API importam DAQUI, nunca dos adapters diretamente.
// Para alternar entre mock e Prisma, mude USE_MOCK abaixo ou via .env.
// =============================================================================

const USE_MOCK = process.env.USE_MOCK === 'true';

export async function getDashboardData(): Promise<DashboardData> {
  if (USE_MOCK) {
    const { getMockDashboard } = await import('@/adapters/mock/dashboard.mock');
    return getMockDashboard();
  }
  const { getPrismaDashboard } = await import('@/adapters/prisma/dashboard.prisma');
  return getPrismaDashboard();
}

export async function getHistoricalChartData(): Promise<ChartDataPoint[]> {
  if (USE_MOCK) {
    const { getMockHistoricalChart } = await import('@/adapters/mock/dashboard.mock');
    return getMockHistoricalChart();
  }
  // TODO (Etapa 3): buscar evolução histórica real via Assessment no Prisma
  // Por ora, retorna mock mesmo em modo real até a tabela Assessment ser populada
  const { getMockHistoricalChart } = await import('@/adapters/mock/dashboard.mock');
  return getMockHistoricalChart();
}

export async function getRadarData(courseId?: string): Promise<RadarDataPoint[]> {
  if (USE_MOCK || !courseId) {
    const { getMockRadarData } = await import('@/adapters/mock/dashboard.mock');
    return getMockRadarData();
  }
  // TODO (Etapa 3): buscar dados de competência real por curso
  const { getMockRadarData } = await import('@/adapters/mock/dashboard.mock');
  return getMockRadarData();
}
