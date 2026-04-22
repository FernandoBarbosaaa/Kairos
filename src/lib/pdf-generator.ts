import jsPDF from "jspdf";

interface PaymentReceiptData {
  participantName: string;
  participantEmail: string;
  eventName: string;
  installmentNumber: number;
  amount: number;
  paidAt: Date;
  method: string;
}

export function generatePaymentReceipt(data: PaymentReceiptData): void {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Cores RGB
  const darkBg: [number, number, number] = [15, 23, 42]; // slate-950
  const primaryColor: [number, number, number] = [59, 130, 246]; // blue-600
  const textColor: [number, number, number] = [241, 245, 249]; // slate-50

  // Fundo
  pdf.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Cabeçalho
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, pageWidth, 40, "F");

  // Logo/Título
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(24);
  pdf.text("KAIROS", 20, 25);

  pdf.setFontSize(10);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text("Comprovante de Pagamento", pageWidth - 20, 25, { align: "right" });

  // Conteúdo
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.setFontSize(12);

  let yPosition = 60;

  // Seção: Participante
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200);
  pdf.text("PARTICIPANTE:", 20, yPosition);
  yPosition += 7;

  pdf.setFontSize(11);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text(data.participantName, 20, yPosition);
  yPosition += 6;
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text(data.participantEmail, 20, yPosition);
  yPosition += 12;

  // Seção: Evento
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200);
  pdf.text("EVENTO:", 20, yPosition);
  yPosition += 7;

  pdf.setFontSize(11);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  pdf.text(data.eventName, 20, yPosition);
  yPosition += 12;

  // Seção: Detalhes do Pagamento
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200);
  pdf.text("DETALHES DO PAGAMENTO:", 20, yPosition);
  yPosition += 7;

  const details = [
    `Parcela: ${data.installmentNumber}`,
    `Valor: R$ ${data.amount.toFixed(2)}`,
    `Método: ${data.method}`,
    `Data: ${data.paidAt.toLocaleDateString("pt-BR")}`,
  ];

  pdf.setFontSize(11);
  pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
  details.forEach((detail) => {
    pdf.text(detail, 20, yPosition);
    yPosition += 7;
  });

  yPosition += 10;

  // Assinatura
  pdf.setDrawColor(150, 150, 150);
  pdf.line(20, yPosition, 100, yPosition);
  yPosition += 5;
  pdf.setFontSize(9);
  pdf.setTextColor(150, 150, 150);
  pdf.text("Assinatura", 20, yPosition);

  // Rodapé
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  const footerText =
    "Este é um comprovante automatizado. Valido com a assinatura digital.";
  const pageHeightInMM = pageHeight;
  pdf.text(footerText, pageWidth / 2, pageHeightInMM - 10, { align: "center" });

  // Salvar
  pdf.save(
    `comprovante_${data.participantName
      .replace(/\s+/g, "_")
      .toLowerCase()}_${data.installmentNumber}.pdf`
  );
}
