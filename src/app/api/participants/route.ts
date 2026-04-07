import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createParticipantSchema } from "@/lib/validators";
import { getCurrentLot } from "@/lib/lot-utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || undefined;

    const participants = await prisma.participant.findMany({
      where: eventId ? { eventId } : {},
      include: {
        event: {
          select: { name: true, id: true },
        },
        installments: true,
        payments: true,
        lot: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    return NextResponse.json({ error: "Erro ao buscar participantes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createParticipantSchema.parse(body);

    const lot =
      validated.lotId
        ? await prisma.lot.findFirst({ where: { id: validated.lotId, eventId: validated.eventId } })
        : await getCurrentLot(validated.eventId);

    if (!lot) {
      return NextResponse.json({ error: "Nenhum lote válido para este evento" }, { status: 400 });
    }

    const participant = await prisma.participant.create({
      data: {
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        eventId: validated.eventId,
        lotId: lot.id,
        agreedPrice: lot.price,
        totalInstallments: validated.totalInstallments,
        status: "pending",
      },
    });

    const totalAmount = lot.price;
    const amountPerInstallment = totalAmount / validated.totalInstallments;
    const now = new Date();

    const installments = Array.from({ length: validated.totalInstallments }).map((_, idx) => {
      const number = idx + 1;
      const dueDate = new Date(now);
      dueDate.setMonth(dueDate.getMonth() + number);
      return {
        participantId: participant.id,
        number,
        amount: amountPerInstallment,
        dueDate,
        status: "pending",
      };
    });

    await prisma.installment.createMany({ data: installments });

    return NextResponse.json(participant, { status: 201 });
  } catch (error: any) {
    // Unique constraint: (eventId,email)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Já existe um participante com este email neste evento" },
        { status: 409 }
      );
    }

    console.error("Erro ao criar participante:", error);
    return NextResponse.json({ error: "Erro ao criar participante" }, { status: 400 });
  }
}
