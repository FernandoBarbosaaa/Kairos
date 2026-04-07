import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        lots: { orderBy: { startDate: "asc" } },
        participants: {
          include: {
            lot: true,
            installments: true,
            payments: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!event) return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    return NextResponse.json(event);
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return NextResponse.json({ error: "Erro ao buscar evento" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validated = createEventSchema.partial().parse(body);

    const updated = await prisma.event.update({
      where: { id },
      data: {
        name: validated.name,
        eventDate: validated.eventDate,
        location: validated.location,
        description: validated.description,
        totalPrice: validated.totalPrice,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ id, message: "Evento deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return NextResponse.json({ error: "Erro ao deletar evento" }, { status: 500 });
  }
}

