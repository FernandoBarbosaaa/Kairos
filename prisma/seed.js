const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco...");

  // Limpar dados antigos
  await prisma.payment.deleteMany();
  await prisma.installment.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.event.deleteMany();

  // Criar evento de teste com lotes
  const event = await prisma.event.create({
    data: {
      name: "Retiro Espiritual 2024",
      eventDate: new Date("2024-06-15"),
      lots: {
        create: [
          {
            name: "Lote 1 - Antecipado",
            price: 800,
            startDate: new Date("2024-03-01"),
            endDate: new Date("2024-03-31"),
          },
          {
            name: "Lote 2 - Normal",
            price: 900,
            startDate: new Date("2024-04-01"),
            endDate: new Date("2024-04-30"),
          },
          {
            name: "Lote 3 - Última Hora",
            price: 1000,
            startDate: new Date("2024-05-01"),
            endDate: new Date("2024-06-15"),
          },
        ],
      },
    },
  });

  console.log("✅ Evento criado:", event.name);

  // Buscar os lotes criados
  const lots = await prisma.lot.findMany({
    where: { eventId: event.id },
  });

  // Criar participant de teste
  const participant = await prisma.participant.create({
    data: {
      fullName: "João Silva",
      email: "joao@example.com",
      phone: "(11) 98765-4321",
      eventId: event.id,
      lotId: lots[0].id, // Lote 1
      agreedPrice: lots[0].price,
      totalInstallments: 12,
      status: "pending",
    },
  });

  console.log("✅ Participante criado:", participant.fullName);

  // Criar parcelas
  const installments = [];
  for (let i = 1; i <= 12; i++) {
    const dueDate = new Date("2024-05-15");
    dueDate.setMonth(dueDate.getMonth() + i);

    const installment = await prisma.installment.create({
      data: {
        participantId: participant.id,
        number: i,
        amount: lots[0].price / 12,
        dueDate,
        status: i === 1 ? "paid" : "pending", // Primeira paga
      },
    });
    installments.push(installment);
  }

  console.log("✅ 12 parcelas criadas");

  // Criar pagamento para primeira parcela
  const payment = await prisma.payment.create({
    data: {
      participantId: participant.id,
      installmentId: installments[0].id,
      amount: installments[0].amount,
      method: "pix",
      status: "completed",
      paidAt: new Date(),
    },
  });

  console.log("✅ Pagamento registrado");

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
