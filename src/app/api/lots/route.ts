import { prisma } from "@/lib/prisma";
import { createLotSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId") || undefined;

    const lots = await prisma.lot.findMany({
      where: eventId ? { eventId } : {},
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(lots);
  } catch (error) {
    console.error("Erro ao buscar lotes:", error);
    return NextResponse.json({ error: "Erro ao buscar lotes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = createLotSchema.parse(body);

    const lot = await prisma.lot.create({
      data: {
        name: validated.name,
        price: validated.price,
        startDate: validated.startDate,
        endDate: validated.endDate,
        eventId: validated.eventId,
      },
    });

    return NextResponse.json(lot, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lote:", error);
    return NextResponse.json({ error: "Erro ao criar lote" }, { status: 400 });
  }
}

