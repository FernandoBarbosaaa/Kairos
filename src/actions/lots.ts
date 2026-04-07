"use server";

import { prisma } from "@/lib/prisma";
import { createLotSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createLot(data: unknown) {
  const validated = createLotSchema.parse(data);

  const lot = await prisma.lot.create({
    data: {
      name: validated.name,
      price: validated.price,
      startDate: validated.startDate,
      endDate: validated.endDate,
      eventId: validated.eventId,
    },
  });

  revalidatePath(`/events/${validated.eventId}`);

  return lot;
}

export async function getEventLots(eventId: string) {
  return prisma.lot.findMany({
    where: { eventId },
    orderBy: { startDate: "asc" },
  });
}

export async function deleteLot(id: string) {
  const lot = await prisma.lot.findUnique({ where: { id } });

  await prisma.lot.delete({ where: { id } });

  if (lot) {
    revalidatePath(`/events/${lot.eventId}`);
  }
}
