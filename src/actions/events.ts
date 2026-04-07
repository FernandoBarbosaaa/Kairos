"use server";

import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

// TODO: Get real user ID from session
const TEST_USER_ID = "user-1";

async function getTestUser() {
  // Get first user from database (for development)
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error("Nenhum usuário encontrado. Execute 'node prisma/seed.js' primeiro.");
  }
  return user.id;
}

export async function createEvent(data: unknown) {
  const validated = createEventSchema.parse(data);

  // Get actual user ID from database
  const userId = await getTestUser();

  const event = await prisma.event.create({
    data: {
      name: validated.name,
      eventDate: validated.eventDate,
      userId,
    },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");

  return event;
}

export async function getEvents(userId?: string) {
  // If no userId provided, get first user
  const actualUserId = userId || (await getTestUser());

  return prisma.event.findMany({
    where: { userId: actualUserId },
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
