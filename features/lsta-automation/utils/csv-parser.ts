export interface CsvRow {
  companyId: string;
  leId: string;
  certificate: string | null;
  specialCase: boolean;
  submitted: boolean;
}

const parseBoolean = (value: string): boolean => {
  const normalizedValue = value.trim().toLowerCase();
  return normalizedValue === "true";
};

const parseNullableString = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export const parseDemoCsv = (csvContent: string): CsvRow[] => {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headers = headerLine.split(",").map((h) => h.trim());

  const companyIdIndex = headers.findIndex(
    (h) => h.toLowerCase() === "company id"
  );
  const leIdIndex = headers.findIndex((h) => h.toLowerCase() === "le id");
  const certificateIndex = headers.findIndex(
    (h) => h.toLowerCase() === "certificate"
  );
  const specialCaseIndex = headers.findIndex(
    (h) => h.toLowerCase() === "special case"
  );
  const submittedIndex = headers.findIndex(
    (h) => h.toLowerCase() === "submitted and uploaded"
  );

  const dataLines = lines.slice(1);
  const rows: CsvRow[] = [];

  for (const line of dataLines) {
    if (line.trim() === "") continue;

    const values = line.split(",");

    rows.push({
      companyId: values[companyIdIndex]?.trim() ?? "",
      leId: values[leIdIndex]?.trim() ?? "",
      certificate: parseNullableString(values[certificateIndex] ?? ""),
      specialCase: parseBoolean(values[specialCaseIndex] ?? ""),
      submitted: parseBoolean(values[submittedIndex] ?? ""),
    });
  }

  return rows;
};
