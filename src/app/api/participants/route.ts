import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const participants = await prisma.participant.findMany({
      include: {
        event: {
          select: { name: true, id: true },
        },
        installments: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    return NextResponse.json({ error: "Erro ao buscar participantes" }, { status: 500 });
  }
}
