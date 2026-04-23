"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createSimulado, updateSimulado, deleteSimulado } from "@/services/simulado.service";
import type { CreateSimuladoInput, UpdateSimuladoInput, SimuladoStatus } from "@/types";

export async function createSimuladoAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado.");
  }

  const name = formData.get("name") as string;
  const courseId = formData.get("courseId") as string;
  const date = formData.get("date") as string;
  const status = (formData.get("status") as SimuladoStatus) || "Agendado";

  if (!name || !courseId || !date) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const data: CreateSimuladoInput = {
    name,
    courseId,
    date,
    status,
  };

  await createSimulado(data, session.user.id);

  revalidatePath("/simulados");
  redirect("/simulados");
}

export async function updateSimuladoAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado.");
  }

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const courseId = formData.get("courseId") as string;
  const date = formData.get("date") as string;
  const status = formData.get("status") as SimuladoStatus;

  if (!id || !name || !courseId || !date) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const data: UpdateSimuladoInput = {
    id,
    name,
    courseId,
    date,
    status,
  };

  await updateSimulado(data, session.user.id, session.user.role);

  revalidatePath("/simulados");
  revalidatePath(`/simulados/${id}`);
  redirect("/simulados");
}

export async function deleteSimuladoAction(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado.");
  }

  const success = await deleteSimulado(id, session.user.id, session.user.role);
  
  if (!success) {
    throw new Error("Erro ao deletar o simulado ou permissão negada.");
  }

  revalidatePath("/simulados");
}
