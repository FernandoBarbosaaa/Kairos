import { prisma } from "./prisma";
import { PaymentStatus, InstallmentStatus } from "@/types";

/**
 * Calcula o status do participante baseado no status das parcelas
 */
export async function calculateParticipantStatus(
  participantId: string
): Promise<PaymentStatus> {
  const installments = await prisma.installment.findMany({
    where: { participantId },
  });

  if (installments.length === 0) {
    return PaymentStatus.PENDING;
  }

  const paidCount = installments.filter(
    (i) => i.status === InstallmentStatus.PAID
  ).length;
  const totalCount = installments.length;

  // Se todas pagas
  if (paidCount === totalCount) {
    return PaymentStatus.PAID;
  }

  // Se alguma atrasada
  const now = new Date();
  const lateCount = installments.filter(
    (i) => i.status === InstallmentStatus.LATE && i.dueDate < now
  ).length;

  if (lateCount > 0) {
    // Se total de atrasos > 50% do total, is "defaulting"
    if (lateCount > totalCount * 0.5) {
      return PaymentStatus.DEFAULTING;
    }
    return PaymentStatus.LATE;
  }

  return PaymentStatus.PENDING;
}

/**
 * Cria parcelas automaticamente para um participante
 */
export async function createInstallments(
  participantId: string,
  totalAmount: number,
  totalInstallments: number
) {
  const amountPerInstallment = totalAmount / totalInstallments;
  const now = new Date();
  const installments = [];

  for (let i = 1; i <= totalInstallments; i++) {
    const dueDate = new Date(now);
    dueDate.setMonth(dueDate.getMonth() + i);

    installments.push({
      participantId,
      number: i,
      amount: amountPerInstallment,
      dueDate,
      status: InstallmentStatus.PENDING,
    });
  }

  return prisma.installment.createMany({
    data: installments,
  });
}

/**
 * Retorna resumo financeiro de um evento
 */
export async function getEventFinancialSummary(eventId: string) {
  const participants = await prisma.participant.findMany({
    where: { eventId },
    include: {
      installments: true,
      payments: true,
    },
  });

  let totalParticipants = participants.length;
  let totalRevenue = 0;
  let totalPaid = 0;
  let totalPending = 0;
  let totalLate = 0;
  let totalDefaulting = 0;

  participants.forEach((participant) => {
    const paidAmount = participant.payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);

    totalRevenue += participant.agreedPrice;
    totalPaid += paidAmount;
    totalPending += participant.agreedPrice - paidAmount;

    if (participant.status === PaymentStatus.LATE) {
      totalLate += participant.agreedPrice - paidAmount;
    } else if (participant.status === PaymentStatus.DEFAULTING) {
      totalDefaulting += participant.agreedPrice - paidAmount;
    }
  });

  return {
    totalParticipants,
    totalRevenue,
    totalPaid,
    totalPending,
    totalLate,
    totalDefaulting,
  };
}

/**
 * Atualiza status de parcelas atrasadas
 */
export async function updateLateInstallments() {
  const now = new Date();

  const lateInstallments = await prisma.installment.findMany({
    where: {
      status: InstallmentStatus.PENDING,
      dueDate: {
        lt: now,
      },
    },
  });

  for (const installment of lateInstallments) {
    await prisma.installment.update({
      where: { id: installment.id },
      data: { status: InstallmentStatus.LATE },
    });
  }

  return lateInstallments.length;
}
