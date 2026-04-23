import type { Diagnostico, DiagnosticoQueryParams, PaginatedResponse } from '@/types';

const USE_MOCK = process.env.USE_MOCK === 'true';

export async function getDiagnosticos(params: DiagnosticoQueryParams): Promise<PaginatedResponse<Diagnostico>> {
  if (USE_MOCK) {
    const { getMockDiagnosticos } = await import('@/adapters/mock/diagnostico.mock');
    return getMockDiagnosticos(params);
  }
  
  const { getPrismaDiagnosticos } = await import('@/adapters/prisma/diagnostico.prisma');
  return getPrismaDiagnosticos(params);
}

export async function getDiagnosticoById(id: string): Promise<Diagnostico | null> {
  if (USE_MOCK) {
    const { getMockDiagnosticoById } = await import('@/adapters/mock/diagnostico.mock');
    return getMockDiagnosticoById(id);
  }
  
  const { getPrismaDiagnosticoById } = await import('@/adapters/prisma/diagnostico.prisma');
  return getPrismaDiagnosticoById(id);
}
