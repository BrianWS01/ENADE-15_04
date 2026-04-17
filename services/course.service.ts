import type { Course, CourseQueryParams, PaginatedResponse } from '@/types';

const USE_MOCK = process.env.USE_MOCK === 'true';

export async function getCourses(params: CourseQueryParams): Promise<PaginatedResponse<Course>> {
  if (USE_MOCK) {
    const { getMockCourses } = await import('@/adapters/mock/course.mock');
    return getMockCourses(params);
  }
  
  const { getPrismaCourses } = await import('@/adapters/prisma/course.prisma');
  return getPrismaCourses(params);
}

export async function getCourseById(id: string): Promise<Course | null> {
  if (USE_MOCK) {
    const { getMockCourseById } = await import('@/adapters/mock/course.mock');
    return getMockCourseById(id);
  }
  
  const { getPrismaCourseById } = await import('@/adapters/prisma/course.prisma');
  return getPrismaCourseById(id);
}
