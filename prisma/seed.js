import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Limpar dados antigos
  await prisma.payment.deleteMany();
  await prisma.installment.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.event.deleteMany();

  // Criar um evento de exemplo
  const event = await prisma.event.create({
    data: {
      name: "Retiro Espiritual 2024",
      eventDate: new Date("2024-12-15"),
    },
  });

  console.log(`✅ Evento criado: ${event.name}`);

  // Criar lotes com preços diferentes por período
  const lot1 = await prisma.lot.create({
    data: {
      name: "Lote 1 - Antecipado",
      price: 500,
      startDate: new Date("2024-09-01"),
      endDate: new Date("2024-10-31"),
      eventId: event.id,
    },
  });

  const lot2 = await prisma.lot.create({
    data: {
      name: "Lote 2 - Normal",
      price: 650,
      startDate: new Date("2024-11-01"),
      endDate: new Date("2024-12-05"),
      eventId: event.id,
    },
  });

  const lot3 = await prisma.lot.create({
    data: {
      name: "Lote 3 - Última Chance",
      price: 800,
      startDate: new Date("2024-12-06"),
      endDate: new Date("2024-12-14"),
      eventId: event.id,
    },
  });

  console.log(`✅ Lotes criados: ${lot1.name}, ${lot2.name}, ${lot3.name}`);

  // Criar um participante de exemplo
  const participant = await prisma.participant.create({
    data: {
      fullName: "João Silva",
      email: "joao@example.com",
      phone: "11999999999",
      status: "pending",
      agreedPrice: lot1.price,
      eventId: event.id,
      lotId: lot1.id,
    },
  });

  console.log(`✅ Participante criado: ${participant.fullName}`);

  // Criar parcelas automáticas
  const installmentAmount = lot1.price / 12;
  const installments = [];

  for (let i = 1; i <= 12; i++) {
    const dueDate = new Date(event.eventDate);
    dueDate.setMonth(dueDate.getMonth() - (12 - i));

    const installment = await prisma.installment.create({
      data: {
        number: i,
        amount: installmentAmount,
        dueDate,
        status: "pending",
        participantId: participant.id,
      },
    });

    installments.push(installment);
  }

  console.log(`✅ ${installments.length} parcelas criadas`);

  // Registrar um pagamento de teste
  const payment = await prisma.payment.create({
    data: {
      amount: installmentAmount,
      method: "pix",
      status: "completed",
      paidAt: new Date(),
      participantId: participant.id,
      installmentId: installments[0].id,
    },
  });

  console.log(`✅ Pagamento registrado: R$ ${payment.amount}`);

  console.log("\n🎉 Seed completado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
