import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        lots: true,
        participants: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json({ error: "Erro ao buscar eventos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = createEventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        name: validated.name,
        eventDate: validated.eventDate,
        location: validated.location,
        description: validated.description,
        totalPrice: validated.totalPrice,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 400 });
  }
}

