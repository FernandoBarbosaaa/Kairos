import { google } from "googleapis";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_PARTICIPANTS_WORKSHEET_TITLE,
  getSpreadsheetIdFromUrl,
  normalizeSheetLabel,
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
  "Pago?": string;
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

  return participants.map((participant) => ({
    "Nome do participante": participant.fullName,
    Whatsapp: participant.phone,
    Email: participant.email,
    Valor: formatCurrency.format(
      participant.installments.find((installment) => installment.status !== "paid")?.amount ??
        participant.agreedPrice
    ),
    Vencimento: (() => {
      const nextOpenInstallment = participant.installments.find(
        (installment) => installment.status !== "paid"
      );

      return nextOpenInstallment ? formatDate.format(nextOpenInstallment.dueDate) : "";
    })(),
    Status: participant.status,
    "Se Pagou": participant.status === "paid" ? "Sim" : "Não",
  }));
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
  const values = await getWorksheetData(spreadsheetId, worksheetTitle, sheets);
  const currentHeaders = values[0] ?? [];
  const normalizedCurrentHeaders = new Set(
    currentHeaders.map((header) => normalizeSheetLabel(header))
  );

  const mergedHeaders = [...currentHeaders];

  for (const requiredHeader of REQUIRED_PARTICIPANTS_HEADERS) {
    if (!normalizedCurrentHeaders.has(normalizeSheetLabel(requiredHeader))) {
      mergedHeaders.push(requiredHeader);
    }
  }

  if (values.length === 0 || mergedHeaders.length !== currentHeaders.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${worksheetTitle}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [mergedHeaders],
      },
    });
  }

  return mergedHeaders.length > 0 ? mergedHeaders : [...REQUIRED_PARTICIPANTS_HEADERS];
}

function buildExistingKeys(rows: string[][], headers: string[]) {
  const emailIndex = headers.indexOf("Email");
  const whatsappIndex = headers.indexOf("Whatsapp");
  const existingKeys = new Set<string>();

  for (const row of rows.slice(1)) {
    const email = (row[emailIndex] ?? "").trim().toLowerCase();
    const whatsapp = (row[whatsappIndex] ?? "").trim().toLowerCase();

    if (email || whatsapp) {
      existingKeys.add(`${email}::${whatsapp}`);
    }
  }

  return existingKeys;
}

function buildRowsToAppend(
  participants: ParticipantRow[],
  headers: string[],
  existingKeys: Set<string>
) {
  const rowsToAppend: string[][] = [];
  let skipped = 0;

  for (const participant of participants) {
    const key = `${participant.Email.trim().toLowerCase()}::${participant.Whatsapp
      .trim()
      .toLowerCase()}`;

    if (existingKeys.has(key)) {
      skipped += 1;
      continue;
    }

    rowsToAppend.push(headers.map((header) => participant[header as keyof ParticipantRow] ?? ""));
    existingKeys.add(key);
  }

  return { rowsToAppend, skipped };
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
  const existingKeys = buildExistingKeys(values, headers);
  const { rowsToAppend, skipped } = buildRowsToAppend(
    participants,
    headers,
    existingKeys
  );

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
    exported: rowsToAppend.length,
    skipped,
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
