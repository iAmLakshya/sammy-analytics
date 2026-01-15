import type { CsvRow } from "./csv-parser";

const GERMAN_COMPANY_PREFIXES = [
  "Müller",
  "Schmidt",
  "Fischer",
  "Weber",
  "Meyer",
  "Wagner",
  "Becker",
  "Hoffmann",
  "Schäfer",
  "Koch",
  "Richter",
  "Klein",
  "Wolf",
  "Neumann",
  "Schwarz",
];

const GERMAN_COMPANY_SUFFIXES = [
  "GmbH",
  "AG",
  "KG",
  "GmbH & Co. KG",
  "SE",
  "Holding GmbH",
  "Services GmbH",
  "Solutions AG",
  "Industries GmbH",
  "Tech GmbH",
];

export const generateProcessingDuration = (): number => {
  return Math.floor(Math.random() * 4000) + 2000;
};

export const generateStepDuration = (): number => {
  return Math.floor(Math.random() * 1000) + 500;
};

export const shouldTaskFail = (): boolean => {
  return Math.random() < 0.15;
};

export const generateEnrichedData = (
  row: CsvRow
): {
  companyName: string;
  sumCheck: string;
  taxIdLast4: string;
  confirmationNumber: string;
} => {
  const leIdNum = parseInt(row.leId.replace(/\D/g, ""), 10) || 1;
  const prefixIndex = leIdNum % GERMAN_COMPANY_PREFIXES.length;
  const suffixIndex = Math.floor(leIdNum / 10) % GERMAN_COMPANY_SUFFIXES.length;

  const companyName = `${GERMAN_COMPANY_PREFIXES[prefixIndex]} ${GERMAN_COMPANY_SUFFIXES[suffixIndex]}`;

  const amount = Math.floor(Math.random() * 49000) + 1000;
  const sumCheck = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

  const taxIdLast4 = row.leId.replace(/\D/g, "").slice(-4).padStart(4, "0");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let confirmationNumber = "TAX-";
  for (let i = 0; i < 8; i++) {
    confirmationNumber += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return {
    companyName,
    sumCheck,
    taxIdLast4,
    confirmationNumber,
  };
};

const STEP_IDS = [
  "payroll-download",
  "data-extraction",
  "tax-submission",
  "document-upload",
];

export const getFailureStep = (): string => {
  const weights = [0.1, 0.15, 0.45, 0.3];
  const random = Math.random();
  let cumulative = 0;

  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return STEP_IDS[i];
    }
  }

  return STEP_IDS[2];
};

const FAILURE_REASONS: Record<string, string[]> = {
  "payroll-download": [
    "LSTA system connection timeout",
    "Authentication failed with LSTA server",
    "Payroll file not found for specified period",
    "Invalid credentials for LSTA access",
  ],
  "data-extraction": [
    "Legal entity name mismatch detected",
    "Missing required field: socialSecurityNumber",
    "Data validation failed for employee records",
    "Invalid date format in payroll data",
  ],
  "tax-submission": [
    "ELSTER portal returned error code 503",
    "Sum check validation failed",
    "Tax ID verification unsuccessful",
    "ELSTER service temporarily unavailable",
  ],
  "document-upload": [
    "Personio API rate limit exceeded",
    "Document upload authentication failed",
    "File size exceeds Personio limit",
    "Invalid document format for upload",
  ],
};

export const getFailureReason = (stepId: string): string => {
  const reasons = FAILURE_REASONS[stepId] ?? FAILURE_REASONS["tax-submission"];
  return reasons[Math.floor(Math.random() * reasons.length)];
};
