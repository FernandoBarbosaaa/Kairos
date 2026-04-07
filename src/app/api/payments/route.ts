import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        participant: {
          select: { fullName: true, id: true },
        },
        installment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    return NextResponse.json({ error: "Erro ao buscar pagamentos" }, { status: 500 });
  }
}
