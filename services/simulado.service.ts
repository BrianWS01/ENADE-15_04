import type { Simulado, SimuladoQueryParams, PaginatedResponse } from '@/types';

const USE_MOCK = process.env.USE_MOCK === 'true';

export async function getSimulados(params: SimuladoQueryParams): Promise<PaginatedResponse<Simulado>> {
  if (USE_MOCK) {
    const { getMockSimulados } = await import('@/adapters/mock/simulado.mock');
    return getMockSimulados(params);
  }
  
  const { getPrismaSimulados } = await import('@/adapters/prisma/simulado.prisma');
  return getPrismaSimulados(params);
}

export async function getSimuladoById(id: string): Promise<Simulado | null> {
  if (USE_MOCK) {
    const { getMockSimuladoById } = await import('@/adapters/mock/simulado.mock');
    return getMockSimuladoById(id);
  }
  
  const { getPrismaSimuladoById } = await import('@/adapters/prisma/simulado.prisma');
  return getPrismaSimuladoById(id);
}

export async function createSimulado(data: import('@/types').CreateSimuladoInput, userId: string): Promise<Simulado> {
  if (USE_MOCK) {
    throw new Error("Mutations not implemented in mock adapter yet.");
  }
  const { createPrismaSimulado } = await import('@/adapters/prisma/simulado.prisma');
  return createPrismaSimulado(data, userId);
}

export async function updateSimulado(data: import('@/types').UpdateSimuladoInput, userId: string, role: string): Promise<Simulado> {
  if (USE_MOCK) {
    throw new Error("Mutations not implemented in mock adapter yet.");
  }
  const { updatePrismaSimulado } = await import('@/adapters/prisma/simulado.prisma');
  return updatePrismaSimulado(data, userId, role);
}

export async function deleteSimulado(id: string, userId: string, role: string): Promise<boolean> {
  if (USE_MOCK) {
    throw new Error("Mutations not implemented in mock adapter yet.");
  }
  const { deletePrismaSimulado } = await import('@/adapters/prisma/simulado.prisma');
  return deletePrismaSimulado(id, userId, role);
}
