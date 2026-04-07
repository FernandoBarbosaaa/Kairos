import { prisma } from "./prisma";
import { Lot } from "@prisma/client";

/**
 * Encontra o lote ativo para um evento baseado na data atual
 */
export async function getCurrentLot(eventId: string): Promise<Lot | null> {
  const now = new Date();

  const lot = await prisma.lot.findFirst({
    where: {
      eventId,
      startDate: {
        lte: now,
      },
      endDate: {
        gte: now,
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });

  return lot;
}

/**
 * Retorna todos os lotes de um evento ordenados por data
 */
export async function getEventLots(eventId: string) {
  return prisma.lot.findMany({
    where: { eventId },
    orderBy: { startDate: "asc" },
  });
}

/**
 * Calcula o preço para um participante baseado no lote atual
 */
export async function getLotPriceForParticipant(
  eventId: string
): Promise<number | null> {
  const lot = await getCurrentLot(eventId);
  return lot ? lot.price : null;
}
