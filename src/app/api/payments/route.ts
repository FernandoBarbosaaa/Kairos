import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { createPaymentSchema } from "@/lib/validators";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        participant: {
          select: { fullName: true, id: true },
        },
        installment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    return NextResponse.json({ error: "Erro ao buscar pagamentos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createPaymentSchema.parse(body);

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

    // Se vinculou a uma parcela, marcar como paga (modelo atual é 1 pagamento por parcela)
    if (validated.installmentId) {
      await prisma.installment.update({
        where: { id: validated.installmentId },
        data: { status: "paid", paidAt: new Date() },
      });
    }

    const paidInstallments = await prisma.installment.count({
      where: { participantId: validated.participantId, status: "paid" },
    });

    // Status do participante por saldo
    const totalPaid = await prisma.payment.aggregate({
      where: { participantId: validated.participantId, status: "completed" },
      _sum: { amount: true },
    });
    const participant = await prisma.participant.findUnique({
      where: { id: validated.participantId },
      select: { agreedPrice: true },
    });

    const paid = totalPaid._sum.amount ?? 0;
    const agreed = participant?.agreedPrice ?? 0;
    const remaining = agreed - paid;

    await prisma.participant.update({
      where: { id: validated.participantId },
      data: {
        paidInstallments,
        status: remaining <= 0 ? "paid" : "pending",
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar pagamento:", error);
    return NextResponse.json({ error: "Erro ao registrar pagamento" }, { status: 400 });
  }
}
