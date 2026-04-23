import { google } from "googleapis";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_PARTICIPANTS_WORKSHEET_TITLE,
  getSpreadsheetIdFromUrl,
  PARTICIPANTS_SHEET_URL,
  REQUIRED_PARTICIPANTS_HEADERS,
} from "@/lib/google-sheets";

export const runtime = "nodejs";

type ParticipantRow = {
  "Nome do participante": string;
  Whatsapp: string;
  Email: string;
  Valor: string;
  Vencimento: string;
  Status: string;
  "Se Pagou": string;
};

type ExportResult = {
  worksheet: string;
  exported: number;
  skipped: number;
  totalParticipants: number;
};

function getServiceAccountCredentials() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (json) {
    const parsed = JSON.parse(json) as {
      client_email?: string;
      private_key?: string;
    };

    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON está inválida.");
    }

    return {
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    };
  }

  if (!email || !privateKey) {
    throw new Error(
      "Defina GOOGLE_SERVICE_ACCOUNT_JSON ou GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
    );
  }

  return {
    clientEmail: email,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  };
}

async function getSheetsClient() {
  const { clientEmail, privateKey } = getServiceAccountCredentials();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  return google.sheets({ version: "v4", auth });
}

function isSameMonthOrEarlier(date: Date, reference: Date) {
  const dateYear = date.getFullYear();
  const referenceYear = reference.getFullYear();

  if (dateYear < referenceYear) return true;
  if (dateYear > referenceYear) return false;

  return date.getMonth() <= reference.getMonth();
}

function getMonthlyPaymentStatus(
  participant: {
    agreedPrice: number;
    installments: Array<{
      amount: number;
      dueDate: Date;
      status: string;
    }>;
  },
  now: Date
) {
  const nextOpenInstallment = participant.installments.find(
    (installment) => installment.status !== "paid"
  );

  if (!nextOpenInstallment) {
    return {
      status: "pago",
      paidCurrentMonth: "Sim",
      nextInstallment: null,
    };
  }

  const currentMonthStillCovered = !isSameMonthOrEarlier(
    nextOpenInstallment.dueDate,
    now
  );

  return {
    status: currentMonthStillCovered ? "pago" : "pendente",
    paidCurrentMonth: currentMonthStillCovered ? "Sim" : "Não",
    nextInstallment: nextOpenInstallment,
  };
}

async function fetchParticipants(): Promise<ParticipantRow[]> {
  const participants = await prisma.participant.findMany({
    include: {
      installments: {
        orderBy: {
          dueDate: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const formatCurrency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const formatDate = new Intl.DateTimeFormat("pt-BR");
  const now = new Date();

  return participants.map((participant) => {
    const monthlyStatus = getMonthlyPaymentStatus(participant, now);
    const nextInstallment = monthlyStatus.nextInstallment;

    return {
      "Nome do participante": participant.fullName,
      Whatsapp: participant.phone,
      Email: participant.email,
      Valor: formatCurrency.format(nextInstallment?.amount ?? participant.agreedPrice),
      Vencimento: nextInstallment ? formatDate.format(nextInstallment.dueDate) : "",
      Status: monthlyStatus.status,
      "Se Pagou": monthlyStatus.paidCurrentMonth,
    };
  });
}

async function getWorksheetData(
  spreadsheetId: string,
  worksheetTitle: string,
  sheets: Awaited<ReturnType<typeof getSheetsClient>>
) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: worksheetTitle,
  });

  return response.data.values ?? [];
}

async function ensureHeaders(
  spreadsheetId: string,
  worksheetTitle: string,
  sheets: Awaited<ReturnType<typeof getSheetsClient>>
) {
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${worksheetTitle}!A1:G1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[...REQUIRED_PARTICIPANTS_HEADERS]],
    },
  });

  return [...REQUIRED_PARTICIPANTS_HEADERS];
}

function buildExistingRowsMap(rows: string[][], headers: string[]) {
  const emailIndex = headers.indexOf("Email");
  const whatsappIndex = headers.indexOf("Whatsapp");
  const existingRows = new Map<string, number>();

  for (const [index, row] of rows.slice(1).entries()) {
    const email = (row[emailIndex] ?? "").trim().toLowerCase();
    const whatsapp = (row[whatsappIndex] ?? "").trim().toLowerCase();

    if (email || whatsapp) {
      existingRows.set(`${email}::${whatsapp}`, index + 2);
    }
  }

  return existingRows;
}

function buildRowsToSync(
  participants: ParticipantRow[],
  headers: string[],
  existingRows: Map<string, number>
) {
  const rowsToAppend: string[][] = [];
  const rowsToUpdate: Array<{ rowNumber: number; values: string[] }> = [];

  for (const participant of participants) {
    const key = `${participant.Email.trim().toLowerCase()}::${participant.Whatsapp
      .trim()
      .toLowerCase()}`;
    const rowValues = headers.map(
      (header) => participant[header as keyof ParticipantRow] ?? ""
    );
    const existingRowNumber = existingRows.get(key);

    if (existingRowNumber) {
      rowsToUpdate.push({
        rowNumber: existingRowNumber,
        values: rowValues,
      });
    } else {
      rowsToAppend.push(rowValues);
    }
  }

  return { rowsToAppend, rowsToUpdate };
}

async function exportParticipantsToGoogleSheets(): Promise<ExportResult> {
  const sheets = await getSheetsClient();
  const spreadsheetUrl =
    process.env.KAIROS_GOOGLE_SHEET_URL || PARTICIPANTS_SHEET_URL;
  const worksheetTitle =
    process.env.KAIROS_GOOGLE_WORKSHEET_TITLE ||
    DEFAULT_PARTICIPANTS_WORKSHEET_TITLE;
  const spreadsheetId = getSpreadsheetIdFromUrl(spreadsheetUrl);

  const participants = await fetchParticipants();
  const headers = await ensureHeaders(spreadsheetId, worksheetTitle, sheets);
  const values = await getWorksheetData(spreadsheetId, worksheetTitle, sheets);
  const existingRows = buildExistingRowsMap(values, headers);
  const { rowsToAppend, rowsToUpdate } = buildRowsToSync(
    participants,
    headers,
    existingRows
  );

  if (rowsToUpdate.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: rowsToUpdate.map((row) => ({
          range: `${worksheetTitle}!A${row.rowNumber}:G${row.rowNumber}`,
          values: [row.values],
        })),
      },
    });
  }

  if (rowsToAppend.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: worksheetTitle,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rowsToAppend,
      },
    });
  }

  return {
    worksheet: worksheetTitle,
    exported: rowsToAppend.length + rowsToUpdate.length,
    skipped: 0,
    totalParticipants: participants.length,
  };
}

export async function POST() {
  try {
    const result = await exportParticipantsToGoogleSheets();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao exportar participantes para o Google Sheets:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível exportar os participantes para o Google Sheets.",
      },
      { status: 500 }
    );
  }
}
