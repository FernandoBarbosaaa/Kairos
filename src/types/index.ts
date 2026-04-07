export enum PaymentStatus {
  PAID = "paid",
  PENDING = "pending",
  LATE = "late",
  DEFAULTING = "defaulting",
}

export enum PaymentMethod {
  PIX = "pix",
  CASH = "cash",
  CARD = "card",
}

export enum InstallmentStatus {
  PAID = "paid",
  PENDING = "pending",
  LATE = "late",
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "organizador";
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  id: string;
  name: string;
  eventDate: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILot {
  id: string;
  name: string;
  price: number;
  startDate: Date;
  endDate: Date;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IParticipant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  agreedPrice: number;
  totalInstallments: number;
  paidInstallments: number;
  status: PaymentStatus;
  eventId: string;
  lotId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInstallment {
  id: string;
  number: number;
  amount: number;
  dueDate: Date;
  status: InstallmentStatus;
  paidAt: Date | null;
  participantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: "pending" | "completed" | "failed";
  paidAt: Date | null;
  notes: string | null;
  participantId: string;
  installmentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
