import { NextResponse } from "next/server";
import { getPrismaDashboard } from "@/adapters/prisma/dashboard.prisma";

// Rota revalidada a cada 5 minutos — dados não mudam a cada request
export const revalidate = 300;

export async function GET() {
  try {
    const data = await getPrismaDashboard();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API/DASHBOARD]", error);
    return NextResponse.json(
      { error: "Erro interno ao carregar dashboard." },
      { status: 500 }
    );
  }
}

