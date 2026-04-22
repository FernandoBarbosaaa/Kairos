export const PARTICIPANTS_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1uF0yJNVXfvUwfMBxTyFAjb1sRbw97SRq61XLSpxjXQY/edit";

export const DEFAULT_PARTICIPANTS_WORKSHEET_TITLE = "Página1";
export const REQUIRED_PARTICIPANTS_HEADERS = [
  "Nome",
  "E-mail",
  "Status de Inscrição",
  "Evento",
] as const;

export function getSpreadsheetIdFromUrl(url: string): string {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);

  if (!match) {
    throw new Error("A URL da planilha do Google Sheets é inválida.");
  }

  return match[1];
}

export function normalizeSheetLabel(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}
