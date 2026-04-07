import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createParticipantSchema } from "@/lib/validators";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const participant = await prisma.participant.delete({
      where: { id },
    });

    return NextResponse.json({
      id: participant.id,
      message: "Participante deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar participante:", error);
    return NextResponse.json(
      { error: "Erro ao deletar participante" },
      { status: 500 }
    );
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        installments: { orderBy: { number: "asc" } },
        payments: { orderBy: { createdAt: "desc" } },
        event: true,
        lot: true,
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Participante não encontrado" }, { status: 404 });
    }

    return NextResponse.json(participant);
  } catch (error) {
    console.error("Erro ao buscar participante:", error);
    return NextResponse.json({ error: "Erro ao buscar participante" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = createParticipantSchema
      .pick({ fullName: true, email: true, phone: true, totalInstallments: true, lotId: true })
      .partial()
      .parse(body);

    // Não vamos recalcular parcelas automaticamente aqui para evitar bagunçar histórico.
    const updated = await prisma.participant.update({
      where: { id },
      data: {
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        totalInstallments: validated.totalInstallments,
        ...(validated.lotId ? { lotId: validated.lotId } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Já existe um participante com este email neste evento" },
        { status: 409 }
      );
    }
    console.error("Erro ao atualizar participante:", error);
    return NextResponse.json({ error: "Erro ao atualizar participante" }, { status: 400 });
  }
}
