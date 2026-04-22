"use server";

import { prisma } from "@/lib/prisma";
import { createParticipantSchema } from "@/lib/validators";
import { getCurrentLot } from "@/lib/lot-utils";
import { revalidatePath } from "next/cache";

export async function createParticipant(data: unknown) {
  const validated = createParticipantSchema.parse(data);

  // Get current lot for the event
  const currentLot = await getCurrentLot(validated.eventId);

  if (!currentLot) {
    throw new Error("Nenhum lote ativo para este evento");
  }

  // Create participant
  const participant = await prisma.participant.create({
    data: {
      fullName: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      eventId: validated.eventId,
      lotId: currentLot.id,
      agreedPrice: currentLot.price,
      totalInstallments: validated.totalInstallments,
      status: "pending",
    },
  });

  // Create installments
  const totalAmount = currentLot.price;
  const amountPerInstallment = totalAmount / validated.totalInstallments;

  const now = new Date();
  const installments = [];

  for (let i = 1; i <= validated.totalInstallments; i++) {
    const dueDate = new Date(now);
    dueDate.setMonth(dueDate.getMonth() + i);

    installments.push({
      participantId: participant.id,
      number: i,
      amount: amountPerInstallment,
      dueDate,
      status: "pending",
    });
  }

  await prisma.installment.createMany({
    data: installments,
  });

  revalidatePath(`/events/${validated.eventId}`);
  revalidatePath("/participants");

  return participant;
}

export async function getEventParticipants(eventId: string) {
  return prisma.participant.findMany({
    where: { eventId },
    include: {
      installments: true,
      payments: true,
      lot: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getParticipantById(id: string) {
  return prisma.participant.findUnique({
    where: { id },
    include: {
      installments: {
        orderBy: { number: "asc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
      event: true,
      lot: true,
    },
  });
}

export async function deleteParticipant(id: string) {
  const participant = await prisma.participant.findUnique({
    where: { id },
  });

  await prisma.participant.delete({
    where: { id },
  });

  if (participant) {
    revalidatePath(`/events/${participant.eventId}`);
    revalidatePath("/participants");
  }
}
