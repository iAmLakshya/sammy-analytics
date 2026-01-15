import type { CsvRow } from "./csv-parser";
import type { ValidationCheck } from "../types";

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
  return Math.random() < 0.35;
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

interface EnrichedData {
  companyName: string;
  sumCheck: string;
  taxIdLast4: string;
  confirmationNumber: string;
}

export const generateFailedValidationChecks = (
  stepId: string,
  leId: string,
  enrichedData: EnrichedData
): ValidationCheck[] => {
  const targetMonth = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const pdfFileName = `lsta_${leId.toLowerCase()}.pdf`;
  const expectedFile = `payroll_${leId.toLowerCase()}.csv`;

  const failureVariant = Math.floor(Math.random() * 2);

  switch (stepId) {
    case "payroll-download": {
      const passedChecks: ValidationCheck[] = [
        {
          key: "status-accepted",
          title: "Status",
          value: null,
          expected: "Accepted",
          actual: failureVariant === 0 ? "Rejected" : "Pending review",
          description: "Payroll submission status from Personio",
          downloadLink: null,
          status: "failed",
        },
      ];
      const failedCheck: ValidationCheck = {
        key: "lsta-file-found",
        title: "LSTA File",
        value: null,
        expected: expectedFile,
        actual: failureVariant === 0 ? "File not found" : "Access denied",
        description: "Source payroll file from LSTA system",
        downloadLink: null,
        status: "failed",
      };
      return [...passedChecks, failedCheck];
    }

    case "data-extraction": {
      const passedCheck: ValidationCheck = {
        key: "le-name-consistent",
        title: "LE Name",
        value: null,
        expected: enrichedData.companyName,
        actual: failureVariant === 0
          ? enrichedData.companyName.replace(" GmbH", "").replace(" AG", "").replace(" KG", "")
          : `${enrichedData.companyName.split(" ")[0]} Holdings`,
        description: "Legal entity name extracted correctly from payroll data",
        downloadLink: null,
        status: "failed",
      };
      return [passedCheck];
    }

    case "tax-submission": {
      const sumAmount = parseFloat(enrichedData.sumCheck.replace(/[^\d,]/g, "").replace(",", ".")) || 10000;
      const wrongSum = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(sumAmount - 0.5);

      return [
        {
          key: "full-name",
          title: "Full Name",
          value: enrichedData.companyName,
          expected: null,
          actual: null,
          description: "Legal entity full name for ELSTER submission",
          downloadLink: null,
          status: "passed",
        },
        {
          key: "tax-id-consistent",
          title: "Tax ID",
          value: null,
          expected: `****${enrichedData.taxIdLast4}`,
          actual: failureVariant === 0 ? "****0000" : `****${String(parseInt(enrichedData.taxIdLast4) + 1).padStart(4, "0")}`,
          description: "Tax identification number matches records",
          downloadLink: null,
          status: failureVariant === 0 ? "failed" : "passed",
        },
        {
          key: "le-number-consistent",
          title: "LE Number",
          value: leId,
          expected: null,
          actual: null,
          description: "Legal entity number consistent with submission",
          downloadLink: null,
          status: "passed",
        },
        {
          key: "sum-check",
          title: "Sum Check",
          value: null,
          expected: enrichedData.sumCheck,
          actual: wrongSum,
          description: "Total wage sum does not match calculated amount",
          downloadLink: null,
          status: "failed",
        },
        {
          key: "downloaded-pdf",
          title: "Certificate PDF",
          value: null,
          expected: "Certificate generated",
          actual: failureVariant === 0 ? "ELSTER service unavailable" : "Generation timeout",
          description: "Failed to download certificate from ELSTER",
          downloadLink: null,
          status: "failed",
        },
        {
          key: "no-existing-doc",
          title: "Existing Document",
          value: "None",
          expected: null,
          actual: null,
          description: "No duplicate submission detected",
          downloadLink: null,
          status: "passed",
        },
      ];
    }

    case "document-upload": {
      const sumAmount = parseFloat(enrichedData.sumCheck.replace(/[^\d,]/g, "").replace(",", ".")) || 10000;
      const wrongSum = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(sumAmount + 100);

      return [
        {
          key: "le-number-consistent",
          title: "LE Number",
          value: leId,
          expected: null,
          actual: null,
          description: "Legal entity number matches upload destination",
          downloadLink: null,
          status: "passed",
        },
        {
          key: "sum-check",
          title: "Sum Check",
          value: null,
          expected: enrichedData.sumCheck,
          actual: wrongSum,
          description: "Document amounts do not match submission totals",
          downloadLink: null,
          status: failureVariant === 0 ? "failed" : "passed",
        },
        {
          key: "uploaded-pdf",
          title: "Uploaded PDF",
          value: null,
          expected: pdfFileName,
          actual: failureVariant === 0 ? "Upload rejected" : "File corrupted",
          description: "Certificate upload to Personio failed",
          downloadLink: null,
          status: "failed",
        },
      ];
    }

    default:
      return [];
  }
};
