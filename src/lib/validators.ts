import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3, "Nome do evento deve ter pelo menos 3 caracteres"),
  eventDate: z.coerce.date(),
  location: z.string().min(2, "Local é obrigatório"),
  description: z.string().optional(),
  totalPrice: z.coerce.number().min(0, "Valor total deve ser maior ou igual a 0"),
});

export const createLotSchema = z.object({
  name: z.string().min(1, "Nome do lote é obrigatório"),
  price: z.coerce.number().min(0, "Preço deve ser maior que 0"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  eventId: z.string().cuid(),
});

export const createParticipantSchema = z.object({
  fullName: z.string().min(3, "Nome completo obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  eventId: z.string().cuid(),
  lotId: z.string().cuid().optional(),
  totalInstallments: z.coerce.number().min(1).max(48),
});

export const createPaymentSchema = z.object({
  participantId: z.string().cuid(),
  installmentId: z.string().cuid().optional(),
  amount: z.coerce.number().min(0.01, "Valor deve ser maior que 0"),
  method: z.enum(["pix", "cash", "card"]),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});
