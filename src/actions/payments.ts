"use server";

import { prisma } from "@/lib/prisma";
import { createPaymentSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createPayment(data: unknown) {
  const validated = createPaymentSchema.parse(data);

  const payment = await prisma.payment.create({
    data: {
      amount: validated.amount,
      method: validated.method,
      status: "completed",
      paidAt: new Date(),
      notes: validated.notes,
      participantId: validated.participantId,
      installmentId: validated.installmentId,
    },
  });

  // Update installment status if linked
  if (validated.installmentId) {
    await prisma.installment.update({
      where: { id: validated.installmentId },
      data: {
        status: "paid",
        paidAt: new Date(),
      },
    });
  }

  // Update participant paidInstallments
  const paidInstallments = await prisma.installment.count({
    where: {
      participantId: validated.participantId,
      status: "paid",
    },
  });

  await prisma.participant.update({
    where: { id: validated.participantId },
    data: {
      paidInstallments,
    },
  });

  revalidatePath("/payments");
  revalidatePath(`/participants`);

  return payment;
}

export async function getPayments(participantId?: string) {
  return prisma.payment.findMany({
    where: participantId ? { participantId } : {},
    include: {
      participant: true,
      installment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPaymentsByEvent(eventId: string) {
  return prisma.payment.findMany({
    where: {
      participant: {
        eventId,
      },
    },
    include: {
      participant: true,
      installment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
