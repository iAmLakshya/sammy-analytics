import type { CountByStatus, LstaTask, ValidationCheck } from "../types";

const STEP_DEFINITIONS: Record<string, { title: string; description: string }> =
  {
    "payroll-download": {
      title: "Download LSTA",
      description: "Download payroll data from LSTA system",
    },
    "data-extraction": {
      title: "Extract & Map",
      description: "Extract and map data fields",
    },
    "tax-submission": {
      title: "Submit to ELSTER",
      description: "Submit tax data to ELSTER portal",
    },
    "document-upload": {
      title: "Upload to Personio",
      description: "Upload documents to Personio system",
    },
  };

const createStep = (
  stepId: string,
  status: "pending" | "failed" | "completed" | "not-ready",
  options: {
    statusDescription?: string;
    data?: Record<string, unknown>;
    errorReasons?: string[];
    validationChecks?: ValidationCheck[];
    startedAt?: string;
    endedAt?: string;
  } = {}
) => ({
  step: stepId,
  title: STEP_DEFINITIONS[stepId].title,
  description: STEP_DEFINITIONS[stepId].description,
  statusDescription: options.statusDescription ?? null,
  data: options.data ?? {},
  errorReasons: options.errorReasons ?? [],
  validationChecks: options.validationChecks ?? [],
  status,
  startedAt: options.startedAt ?? null,
  endedAt: options.endedAt ?? null,
});

const createPayrollDownloadChecks = (
  leId: string,
  targetMonth: string,
  fileName: string,
  status: "passed" | "pending" | "failed" = "passed"
): ValidationCheck[] => [
  {
    key: "status-accepted",
    title: "Status",
    value: "Accepted",
    expected: null,
    actual: null,
    description: "Payroll submission status from Personio",
    downloadLink: null,
    status,
  },
  {
    key: "target-month",
    title: "Target Month",
    value: targetMonth,
    expected: null,
    actual: null,
    description: "Target reporting period for this submission",
    downloadLink: null,
    status,
  },
  {
    key: "lsta-file-found",
    title: "LSTA File",
    value: fileName,
    expected: null,
    actual: null,
    description: "Source payroll file from LSTA system",
    downloadLink: `/downloads/${fileName}`,
    status,
  },
  {
    key: "le-number-consistent",
    title: "LE Number",
    value: leId,
    expected: null,
    actual: null,
    description: "Legal entity identifier matches across systems",
    downloadLink: null,
    status,
  },
  {
    key: "no-manual-wage-tax",
    title: "Manual Wage Tax",
    value: "None found",
    expected: null,
    actual: null,
    description: "No manual wage tax document conflicts detected",
    downloadLink: null,
    status,
  },
];

const createDataExtractionChecks = (
  leName: string,
  status: "passed" | "pending" | "failed" = "passed"
): ValidationCheck[] => [
  {
    key: "le-name-consistent",
    title: "LE Name",
    value: leName,
    expected: null,
    actual: null,
    description: "Legal entity name extracted correctly from payroll data",
    downloadLink: null,
    status,
  },
];

const createTaxSubmissionChecks = (
  fullName: string,
  taxId: string,
  leId: string,
  sumAmount: string,
  pdfFileName: string,
  status: "passed" | "pending" | "failed" = "passed"
): ValidationCheck[] => [
  {
    key: "full-name",
    title: "Full Name",
    value: fullName,
    expected: null,
    actual: null,
    description: "Legal entity full name for ELSTER submission",
    downloadLink: null,
    status,
  },
  {
    key: "tax-id-consistent",
    title: "Tax ID",
    value: taxId,
    expected: null,
    actual: null,
    description: "Tax identification number matches records",
    downloadLink: null,
    status,
  },
  {
    key: "le-number-consistent",
    title: "LE Number",
    value: leId,
    expected: null,
    actual: null,
    description: "Legal entity number consistent with submission",
    downloadLink: null,
    status,
  },
  {
    key: "sum-check",
    title: "Sum Check",
    value: sumAmount,
    expected: null,
    actual: null,
    description: "Total wage sum matches calculated amount",
    downloadLink: null,
    status,
  },
  {
    key: "downloaded-pdf",
    title: "Certificate PDF",
    value: pdfFileName,
    expected: null,
    actual: null,
    description: "Tax certificate downloaded from ELSTER",
    downloadLink: `/downloads/${pdfFileName}`,
    status,
  },
  {
    key: "no-existing-doc",
    title: "Existing Document",
    value: "None",
    expected: null,
    actual: null,
    description: "No duplicate submission detected",
    downloadLink: null,
    status,
  },
];

const createDocumentUploadChecks = (
  leId: string,
  sumAmount: string,
  pdfFileName: string,
  status: "passed" | "pending" | "failed" = "passed"
): ValidationCheck[] => [
  {
    key: "le-number-consistent",
    title: "LE Number",
    value: leId,
    expected: null,
    actual: null,
    description: "Legal entity number matches upload destination",
    downloadLink: null,
    status,
  },
  {
    key: "sum-check",
    title: "Sum Check",
    value: sumAmount,
    expected: null,
    actual: null,
    description: "Document amounts match submission totals",
    downloadLink: null,
    status,
  },
  {
    key: "uploaded-pdf",
    title: "Uploaded PDF",
    value: pdfFileName,
    expected: null,
    actual: null,
    description: "Certificate uploaded to Personio",
    downloadLink: `/downloads/${pdfFileName}`,
    status,
  },
];

const createNotReadyPayrollChecks = (
  leId: string,
  targetMonth: string,
  variant: "pending-review" | "file-unavailable"
): ValidationCheck[] => {
  if (variant === "pending-review") {
    return [
      {
        key: "status-accepted",
        title: "Status",
        value: null,
        expected: "Accepted",
        actual: "Pending review",
        description: "Payroll submission awaiting review in source system",
        downloadLink: null,
        status: "failed",
      },
      {
        key: "target-month",
        title: "Target Month",
        value: targetMonth,
        expected: null,
        actual: null,
        description: "Target reporting period for this submission",
        downloadLink: null,
        status: "passed",
      },
      {
        key: "lsta-file-found",
        title: "LSTA File",
        value: null,
        expected: `payroll_${leId.toLowerCase()}.csv`,
        actual: "Not yet available",
        description: "Source file will be available after review completion",
        downloadLink: null,
        status: "failed",
      },
    ];
  }
  return [
    {
      key: "status-accepted",
      title: "Status",
      value: "Accepted",
      expected: null,
      actual: null,
      description: "Payroll submission status from Personio",
      downloadLink: null,
      status: "passed",
    },
    {
      key: "target-month",
      title: "Target Month",
      value: targetMonth,
      expected: null,
      actual: null,
      description: "Target reporting period for this submission",
      downloadLink: null,
      status: "passed",
    },
    {
      key: "lsta-file-found",
      title: "LSTA File",
      value: null,
      expected: `payroll_${leId.toLowerCase()}.csv`,
      actual: "File not yet generated",
      description: "LSTA export scheduled, file pending generation",
      downloadLink: null,
      status: "failed",
    },
  ];
};

export const mockLstaTasks: LstaTask[] = [
  {
    id: "task-001",
    organisationId: "ORG-001",
    companyId: "COMP-001",
    leId: "LE-001",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: true,
    status: "completed",
    statusDescription: null,
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 156 },
        validationChecks: createPayrollDownloadChecks(
          "LE-001",
          "January 2026",
          "payroll_jan_2026.csv"
        ),
        startedAt: "2026-01-14T08:00:00Z",
        endedAt: "2026-01-14T08:02:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions"],
          recordsProcessed: 156,
        },
        validationChecks: createDataExtractionChecks("Acme Corporation GmbH"),
        startedAt: "2026-01-14T08:02:00Z",
        endedAt: "2026-01-14T08:04:00Z",
      }),
      createStep("tax-submission", "completed", {
        data: { confirmationNumber: "TAX-2026-48291", documentId: "DOC-73829" },
        validationChecks: createTaxSubmissionChecks(
          "Acme Corporation GmbH",
          "****1234",
          "LE-001",
          "€47,892.00",
          "lsta_jan_2026_001.pdf"
        ),
        startedAt: "2026-01-14T08:04:00Z",
        endedAt: "2026-01-14T08:08:00Z",
      }),
      createStep("document-upload", "completed", {
        data: { documentId: "DOC-73830" },
        validationChecks: createDocumentUploadChecks(
          "LE-001",
          "€47,892.00",
          "lsta_jan_2026_001.pdf"
        ),
        startedAt: "2026-01-14T08:08:00Z",
        endedAt: "2026-01-14T08:09:00Z",
      }),
    ],
    createdAt: "2026-01-14T08:00:00Z",
    updatedAt: "2026-01-14T08:09:00Z",
  },
  {
    id: "task-002",
    organisationId: "ORG-001",
    companyId: "COMP-002",
    leId: "LE-002",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: true,
    status: "completed",
    statusDescription: null,
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 89 },
        validationChecks: createPayrollDownloadChecks(
          "LE-002",
          "January 2026",
          "payroll_jan_2026.csv"
        ),
        startedAt: "2026-01-14T07:30:00Z",
        endedAt: "2026-01-14T07:32:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions", "socialSecurity"],
          recordsProcessed: 89,
        },
        validationChecks: createDataExtractionChecks("Beta Industries AG"),
        startedAt: "2026-01-14T07:32:00Z",
        endedAt: "2026-01-14T07:34:00Z",
      }),
      createStep("tax-submission", "completed", {
        data: { confirmationNumber: "TAX-2026-31472", documentId: "DOC-61924" },
        validationChecks: createTaxSubmissionChecks(
          "Beta Industries AG",
          "****5678",
          "LE-002",
          "€31,245.00",
          "lsta_jan_2026_002.pdf"
        ),
        startedAt: "2026-01-14T07:34:00Z",
        endedAt: "2026-01-14T07:38:00Z",
      }),
      createStep("document-upload", "completed", {
        data: { documentId: "DOC-61925" },
        validationChecks: createDocumentUploadChecks(
          "LE-002",
          "€31,245.00",
          "lsta_jan_2026_002.pdf"
        ),
        startedAt: "2026-01-14T07:38:00Z",
        endedAt: "2026-01-14T07:39:00Z",
      }),
    ],
    createdAt: "2026-01-14T07:30:00Z",
    updatedAt: "2026-01-14T07:39:00Z",
  },
  {
    id: "task-003",
    organisationId: "ORG-001",
    companyId: "COMP-003",
    leId: "LE-003",
    certificate: "Q4 Wage Report",
    specialCase: false,
    submitted: true,
    status: "completed",
    statusDescription: null,
    batch: { id: "batch-002", name: "Q4 2025 Quarterly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_q4_2025.csv", recordsProcessed: 468 },
        validationChecks: createPayrollDownloadChecks(
          "LE-003",
          "Q4 2025",
          "payroll_q4_2025.csv"
        ),
        startedAt: "2026-01-13T22:00:00Z",
        endedAt: "2026-01-13T22:03:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions", "bonuses"],
          recordsProcessed: 468,
        },
        validationChecks: createDataExtractionChecks("Gamma Holdings KG"),
        startedAt: "2026-01-13T22:03:00Z",
        endedAt: "2026-01-13T22:06:00Z",
      }),
      createStep("tax-submission", "completed", {
        data: {
          confirmationNumber: "TAX-2025-Q4-7821",
          documentId: "DOC-82910",
        },
        validationChecks: createTaxSubmissionChecks(
          "Gamma Holdings KG",
          "****9012",
          "LE-003",
          "€128,560.00",
          "lsta_q4_2025_003.pdf"
        ),
        startedAt: "2026-01-13T22:06:00Z",
        endedAt: "2026-01-13T22:12:00Z",
      }),
      createStep("document-upload", "completed", {
        data: { documentId: "DOC-82911" },
        validationChecks: createDocumentUploadChecks(
          "LE-003",
          "€128,560.00",
          "lsta_q4_2025_003.pdf"
        ),
        startedAt: "2026-01-13T22:12:00Z",
        endedAt: "2026-01-13T22:13:00Z",
      }),
    ],
    createdAt: "2026-01-13T22:00:00Z",
    updatedAt: "2026-01-13T22:13:00Z",
  },
  {
    id: "task-004",
    organisationId: "ORG-001",
    companyId: "COMP-004",
    leId: "LE-004",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "processing",
    statusDescription: "Submitting tax data to ELSTER portal...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 234 },
        validationChecks: createPayrollDownloadChecks(
          "LE-004",
          "January 2026",
          "payroll_jan_2026.csv"
        ),
        startedAt: "2026-01-14T09:00:00Z",
        endedAt: "2026-01-14T09:02:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions"],
          recordsProcessed: 234,
        },
        validationChecks: createDataExtractionChecks("Delta Services GmbH"),
        startedAt: "2026-01-14T09:02:00Z",
        endedAt: "2026-01-14T09:04:00Z",
      }),
      createStep("tax-submission", "pending", {
        statusDescription: "Connecting to ELSTER portal...",
        validationChecks: createTaxSubmissionChecks(
          "Delta Services GmbH",
          "****3456",
          "LE-004",
          "€52,340.00",
          "lsta_jan_2026_004.pdf",
          "pending"
        ),
        startedAt: "2026-01-14T09:04:00Z",
      }),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T09:00:00Z",
    updatedAt: "2026-01-14T09:04:30Z",
  },
  {
    id: "task-005",
    organisationId: "ORG-002",
    companyId: "COMP-005",
    leId: "LE-005",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: true,
    submitted: false,
    status: "processing",
    statusDescription: "Extracting and mapping payroll fields...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 67 },
        validationChecks: createPayrollDownloadChecks(
          "LE-005",
          "January 2026",
          "payroll_jan_2026.csv"
        ),
        startedAt: "2026-01-14T09:10:00Z",
        endedAt: "2026-01-14T09:12:00Z",
      }),
      createStep("data-extraction", "pending", {
        statusDescription: "Processing 67 employee records...",
        validationChecks: createDataExtractionChecks(
          "Epsilon Tech Solutions",
          "pending"
        ),
        startedAt: "2026-01-14T09:12:00Z",
      }),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T09:10:00Z",
    updatedAt: "2026-01-14T09:12:30Z",
  },
  {
    id: "task-006",
    organisationId: "ORG-002",
    companyId: "COMP-006",
    leId: "LE-006",
    certificate: null,
    specialCase: true,
    submitted: false,
    status: "processing",
    statusDescription: "Downloading payroll data from LSTA...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "pending", {
        statusDescription: "Authenticating with LSTA system...",
        startedAt: "2026-01-14T09:15:00Z",
      }),
      createStep("data-extraction", "pending"),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T09:15:00Z",
    updatedAt: "2026-01-14T09:15:15Z",
  },
  {
    id: "task-007",
    organisationId: "ORG-001",
    companyId: "COMP-007",
    leId: "LE-007",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "failed",
    statusDescription: "Tax submission failed after 3 attempts",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_jan_2026.csv", recordsProcessed: 112 },
        validationChecks: createPayrollDownloadChecks(
          "LE-007",
          "January 2026",
          "payroll_jan_2026.csv"
        ),
        startedAt: "2026-01-14T06:00:00Z",
        endedAt: "2026-01-14T06:02:00Z",
      }),
      createStep("data-extraction", "completed", {
        data: {
          extractedFields: ["wages", "tax", "deductions"],
          recordsProcessed: 112,
        },
        validationChecks: createDataExtractionChecks("Zeta Manufacturing AG"),
        startedAt: "2026-01-14T06:02:00Z",
        endedAt: "2026-01-14T06:04:00Z",
      }),
      createStep("tax-submission", "failed", {
        errorReasons: [
          "ELSTER portal returned error code 503",
          "Service temporarily unavailable",
          "Retry limit exceeded",
        ],
        validationChecks: [
          {
            key: "full-name",
            title: "Full Name",
            value: "Zeta Manufacturing AG",
            expected: null,
            actual: null,
            description: "Legal entity full name for ELSTER submission",
            downloadLink: null,
            status: "passed",
          },
          {
            key: "tax-id-consistent",
            title: "Tax ID",
            value: "****7890",
            expected: null,
            actual: null,
            description: "Tax identification number matches records",
            downloadLink: null,
            status: "passed",
          },
          {
            key: "le-number-consistent",
            title: "LE Number",
            value: "LE-007",
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
            expected: "€38,420.00",
            actual: "€38,419.50",
            description: "Total wage sum does not match calculated amount",
            downloadLink: null,
            status: "failed",
          },
          {
            key: "downloaded-pdf",
            title: "Certificate PDF",
            value: null,
            expected: "Certificate generated",
            actual: "ELSTER service unavailable",
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
        ],
        startedAt: "2026-01-14T06:04:00Z",
        endedAt: "2026-01-14T06:15:00Z",
      }),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T06:00:00Z",
    updatedAt: "2026-01-14T06:15:00Z",
  },
  {
    id: "task-008",
    organisationId: "ORG-002",
    companyId: "COMP-008",
    leId: "LE-008",
    certificate: null,
    specialCase: true,
    submitted: false,
    status: "failed",
    statusDescription: "Data extraction failed - invalid format",
    batch: { id: "batch-002", name: "Q4 2025 Quarterly" },
    steps: [
      createStep("payroll-download", "completed", {
        data: { downloadedFile: "payroll_q4_2025.csv", recordsProcessed: 345 },
        validationChecks: createPayrollDownloadChecks(
          "LE-008",
          "Q4 2025",
          "payroll_q4_2025.csv"
        ),
        startedAt: "2026-01-13T14:00:00Z",
        endedAt: "2026-01-13T14:03:00Z",
      }),
      createStep("data-extraction", "failed", {
        errorReasons: [
          "Legal entity name doesn't match records",
          "Missing required field: socialSecurityNumber",
          "Data validation failed for 12 records",
        ],
        validationChecks: [
          {
            key: "le-name-consistent",
            title: "LE Name",
            value: null,
            expected: "Eta Partners GmbH & Co. KG",
            actual: "Eta Partners GmbH",
            description:
              "Legal entity name mismatch - expected full company name",
            downloadLink: null,
            status: "failed",
          },
        ],
        startedAt: "2026-01-13T14:03:00Z",
        endedAt: "2026-01-13T14:05:00Z",
      }),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-13T14:00:00Z",
    updatedAt: "2026-01-13T14:05:00Z",
  },
  {
    id: "task-009",
    organisationId: "ORG-001",
    companyId: "COMP-009",
    leId: "LE-009",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "pending",
    statusDescription: null,
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "pending"),
      createStep("data-extraction", "pending"),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T10:00:00Z",
    updatedAt: "2026-01-14T10:00:00Z",
  },
  {
    id: "task-010",
    organisationId: "ORG-002",
    companyId: "COMP-010",
    leId: "LE-010",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "pending",
    statusDescription: null,
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "pending"),
      createStep("data-extraction", "pending"),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T10:05:00Z",
    updatedAt: "2026-01-14T10:05:00Z",
  },
  {
    id: "task-011",
    organisationId: "ORG-001",
    companyId: "COMP-011",
    leId: "LE-011",
    certificate: "Monthly Wage Tax Certificate",
    specialCase: false,
    submitted: false,
    status: "retrying",
    statusDescription: "Retrying tax submission (attempt 2 of 3)...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "completed", {
        validationChecks: createPayrollDownloadChecks(
          "LE-011",
          "January 2026",
          "payroll_jan_2026.csv"
        ),
        startedAt: "2026-01-14T05:00:00Z",
        endedAt: "2026-01-14T05:02:00Z",
      }),
      createStep("data-extraction", "completed", {
        validationChecks: createDataExtractionChecks("Kappa Logistics GmbH"),
        startedAt: "2026-01-14T05:02:00Z",
        endedAt: "2026-01-14T05:04:00Z",
      }),
      createStep("tax-submission", "failed", {
        errorReasons: ["ELSTER connection timeout", "Retry scheduled"],
        validationChecks: [
          {
            key: "full-name",
            title: "Full Name",
            value: "Kappa Logistics GmbH",
            expected: null,
            actual: null,
            description: "Legal entity full name for ELSTER submission",
            downloadLink: null,
            status: "passed",
          },
          {
            key: "tax-id-consistent",
            title: "Tax ID",
            value: "****2468",
            expected: null,
            actual: null,
            description: "Tax identification number matches records",
            downloadLink: null,
            status: "passed",
          },
          {
            key: "le-number-consistent",
            title: "LE Number",
            value: "LE-011",
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
            expected: "€24,680.00",
            actual: "Connection timed out",
            description: "Unable to verify sum — ELSTER connection failed",
            downloadLink: null,
            status: "failed",
          },
          {
            key: "downloaded-pdf",
            title: "Certificate PDF",
            value: null,
            expected: "Certificate generated",
            actual: "ELSTER timeout",
            description: "Failed to retrieve certificate from ELSTER",
            downloadLink: null,
            status: "failed",
          },
        ],
        startedAt: "2026-01-14T05:04:00Z",
        endedAt: "2026-01-14T05:10:00Z",
      }),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T05:00:00Z",
    updatedAt: "2026-01-14T05:20:00Z",
  },
  {
    id: "task-012",
    organisationId: "ORG-002",
    companyId: "COMP-012",
    leId: "LE-012",
    certificate: null,
    specialCase: true,
    submitted: false,
    status: "retrying",
    statusDescription: "Retrying data extraction with corrected mapping...",
    batch: { id: "batch-002", name: "Q4 2025 Quarterly" },
    steps: [
      createStep("payroll-download", "completed", {
        validationChecks: createPayrollDownloadChecks(
          "LE-012",
          "Q4 2025",
          "payroll_q4_2025.csv"
        ),
        startedAt: "2026-01-13T16:00:00Z",
        endedAt: "2026-01-13T16:03:00Z",
      }),
      createStep("data-extraction", "failed", {
        errorReasons: ["Field mapping mismatch", "Retry with corrected config"],
        validationChecks: [
          {
            key: "le-name-consistent",
            title: "LE Name",
            value: null,
            expected: "Lambda Analytics KG",
            actual: "Lambda Analytics",
            description: "Legal entity name mismatch — missing suffix",
            downloadLink: null,
            status: "failed",
          },
        ],
        startedAt: "2026-01-13T16:03:00Z",
        endedAt: "2026-01-13T16:05:00Z",
      }),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-13T16:00:00Z",
    updatedAt: "2026-01-13T18:05:00Z",
  },
  {
    id: "task-013",
    organisationId: "ORG-001",
    companyId: "COMP-013",
    leId: "LE-013",
    certificate: null,
    specialCase: false,
    submitted: false,
    status: "not-ready",
    statusDescription: "Waiting for source data...",
    batch: { id: "batch-001", name: "January 2026 Monthly" },
    steps: [
      createStep("payroll-download", "not-ready", {
        statusDescription: "Waiting for source system",
        validationChecks: createNotReadyPayrollChecks(
          "LE-013",
          "January 2026",
          "pending-review"
        ),
        startedAt: "2026-01-14T08:30:00Z",
        endedAt: "2026-01-14T08:30:05Z",
      }),
      createStep("data-extraction", "pending"),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-14T08:30:00Z",
    updatedAt: "2026-01-14T08:30:05Z",
  },
  {
    id: "task-014",
    organisationId: "ORG-002",
    companyId: "COMP-014",
    leId: "LE-014",
    certificate: null,
    specialCase: true,
    submitted: false,
    status: "not-ready",
    statusDescription: "Waiting for source data...",
    batch: { id: "batch-002", name: "Q4 2025 Quarterly" },
    steps: [
      createStep("payroll-download", "not-ready", {
        statusDescription: "LSTA file pending generation",
        validationChecks: createNotReadyPayrollChecks(
          "LE-014",
          "Q4 2025",
          "file-unavailable"
        ),
        startedAt: "2026-01-13T20:00:00Z",
        endedAt: "2026-01-13T20:00:10Z",
      }),
      createStep("data-extraction", "pending"),
      createStep("tax-submission", "pending"),
      createStep("document-upload", "pending"),
    ],
    createdAt: "2026-01-13T20:00:00Z",
    updatedAt: "2026-01-13T20:00:10Z",
  },
];

export const computeCountByStatus = (tasks: LstaTask[]): CountByStatus => {
  return tasks.reduce(
    (acc, task) => {
      if (task.status === "not-ready") {
        acc.notReady++;
      } else {
        acc[task.status]++;
      }
      return acc;
    },
    { pending: 0, completed: 0, processing: 0, failed: 0, retrying: 0, notReady: 0 }
  );
};
