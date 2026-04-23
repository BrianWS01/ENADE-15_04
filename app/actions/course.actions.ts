"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCourse, updateCourse, deleteCourse } from "@/services/course.service";
import type { CreateCourseInput, UpdateCourseInput, CourseCategory, CourseModality, RiskLevel } from "@/types";

export async function createCourseAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado.");
  }

  const name = formData.get("name") as string;
  const category = formData.get("category") as CourseCategory;
  const modality = formData.get("modality") as CourseModality;
  const riskLevel = (formData.get("riskLevel") as RiskLevel) || "Médio";

  if (!name || !category || !modality) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const data: CreateCourseInput = {
    name,
    category,
    modality,
    riskLevel,
    enadeScore: 0,
    nationalAvg: 0,
    participationRate: 0,
    idd: 0,
  };

  await createCourse(data, session.user.id);

  revalidatePath("/cursos");
  redirect("/cursos");
}

export async function updateCourseAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado.");
  }

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as CourseCategory;
  const modality = formData.get("modality") as CourseModality;
  const riskLevel = formData.get("riskLevel") as RiskLevel;

  if (!id || !name || !category || !modality) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const data: UpdateCourseInput = {
    id,
    name,
    category,
    modality,
    riskLevel,
  };

  await updateCourse(data, session.user.id, session.user.role);

  revalidatePath("/cursos");
  revalidatePath(`/cursos/${id}`);
  redirect("/cursos");
}

export async function deleteCourseAction(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado.");
  }

  const success = await deleteCourse(id, session.user.id, session.user.role);
  
  if (!success) {
    throw new Error("Erro ao deletar o curso ou permissão negada.");
  }

  revalidatePath("/cursos");
}
