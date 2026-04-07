"use server";

import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createEvent(data: unknown) {
  const validated = createEventSchema.parse(data);

  const event = await prisma.event.create({
    data: {
      name: validated.name,
      eventDate: validated.eventDate,
    },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");

  return event;
}

export async function getEvents() {
  return prisma.event.findMany({
    include: {
      lots: true,
      participants: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      lots: {
        orderBy: { startDate: "asc" },
      },
      participants: {
        include: {
          installments: true,
          payments: true,
        },
      },
    },
  });
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");
}
