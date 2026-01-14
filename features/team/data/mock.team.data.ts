import type {
  DailyReviewActivity,
  DocumentActivity,
  Reviewer,
  TeamOverview,
  UserCorrectionsSummary,
  WeekdayActivity,
} from "../types";

// From 24_most_active_reviewers.jsonc
export const reviewers: Reviewer[] = [
  {
    user_id: "a8f2c4d1-1a2b-4c5d-8e9f-1234567890ab",
    reviews_completed: 1842,
    accepted: 1156,
    rejected: 686,
    corrections_provided: 89,
    first_review: "2025-12-15 09:24:12.291+00",
    latest_review: "2026-01-12 16:42:18.626+00",
    avg_review_time_hours: 6.45,
  },
  {
    user_id: "b9e3d5f2-2b3c-5d6e-9f0a-2345678901bc",
    reviews_completed: 1567,
    accepted: 982,
    rejected: 585,
    corrections_provided: 76,
    first_review: "2025-12-18 11:15:22.458+00",
    latest_review: "2026-01-12 15:28:45.234+00",
    avg_review_time_hours: 8.12,
  },
  {
    user_id: "c0f4e6a3-3c4d-6e7f-0a1b-3456789012cd",
    reviews_completed: 1423,
    accepted: 889,
    rejected: 534,
    corrections_provided: 71,
    first_review: "2025-12-20 14:32:18.789+00",
    latest_review: "2026-01-12 14:15:32.567+00",
    avg_review_time_hours: 9.78,
  },
  {
    user_id: "d1a5f7b4-4d5e-7f8a-1b2c-4567890123de",
    reviews_completed: 1289,
    accepted: 805,
    rejected: 484,
    corrections_provided: 62,
    first_review: "2025-12-22 08:45:33.123+00",
    latest_review: "2026-01-12 13:42:21.891+00",
    avg_review_time_hours: 7.34,
  },
  {
    user_id: "e2b6f8c5-5e6f-8a9b-2c3d-5678901234ef",
    reviews_completed: 1156,
    accepted: 723,
    rejected: 433,
    corrections_provided: 54,
    first_review: "2025-12-23 10:22:45.456+00",
    latest_review: "2026-01-12 12:18:54.123+00",
    avg_review_time_hours: 11.23,
  },
  {
    user_id: "6b5f1e41-ca0d-42f6-a9be-d9db07a4169f",
    reviews_completed: 934,
    accepted: 584,
    rejected: 350,
    corrections_provided: 43,
    first_review: "2025-12-26 13:18:22.678+00",
    latest_review: "2026-01-12 11:05:12.345+00",
    avg_review_time_hours: 10.56,
  },
  {
    user_id: "f3c7f9d6-6f7a-9b0c-3d4e-6789012345fa",
    reviews_completed: 789,
    accepted: 493,
    rejected: 296,
    corrections_provided: 36,
    first_review: "2025-12-28 15:42:11.234+00",
    latest_review: "2026-01-12 10:22:33.789+00",
    avg_review_time_hours: 13.67,
  },
  {
    user_id: "g4d8h0e7-7a8b-0c1d-4e5f-7890123456gb",
    reviews_completed: 625,
    accepted: 390,
    rejected: 235,
    corrections_provided: 28,
    first_review: "2025-12-30 09:15:44.567+00",
    latest_review: "2026-01-12 09:45:18.456+00",
    avg_review_time_hours: 15.42,
  },
];

// From 25_review_by_day_of_week.jsonc
export const weekdayActivity: WeekdayActivity[] = [
  {
    day_of_week: "Monday",
    day_number: 1,
    reviews_completed: 1456,
    unique_reviewers: 8,
    avg_review_time_hours: 8.67,
  },
  {
    day_of_week: "Tuesday",
    day_number: 2,
    reviews_completed: 1678,
    unique_reviewers: 8,
    avg_review_time_hours: 7.92,
  },
  {
    day_of_week: "Wednesday",
    day_number: 3,
    reviews_completed: 1842,
    unique_reviewers: 8,
    avg_review_time_hours: 9.15,
  },
  {
    day_of_week: "Thursday",
    day_number: 4,
    reviews_completed: 1723,
    unique_reviewers: 8,
    avg_review_time_hours: 8.34,
  },
  {
    day_of_week: "Friday",
    day_number: 5,
    reviews_completed: 1534,
    unique_reviewers: 7,
    avg_review_time_hours: 10.23,
  },
  {
    day_of_week: "Saturday",
    day_number: 6,
    reviews_completed: 289,
    unique_reviewers: 3,
    avg_review_time_hours: 15.67,
  },
  {
    day_of_week: "Sunday",
    day_number: 0,
    reviews_completed: 228,
    unique_reviewers: 2,
    avg_review_time_hours: 18.45,
  },
];

// From 11_conflict_review_activity.jsonc
export const dailyReviewActivity: DailyReviewActivity[] = [
  {
    date: "2026-01-12",
    reviews_completed: 165,
    accepted: 135,
    rejected: 30,
    unique_reviewers: 6,
  },
  {
    date: "2026-01-11",
    reviews_completed: 89,
    accepted: 72,
    rejected: 17,
    unique_reviewers: 5,
  },
  {
    date: "2026-01-10",
    reviews_completed: 197,
    accepted: 159,
    rejected: 38,
    unique_reviewers: 7,
  },
  {
    date: "2026-01-09",
    reviews_completed: 170,
    accepted: 138,
    rejected: 32,
    unique_reviewers: 6,
  },
  {
    date: "2026-01-08",
    reviews_completed: 234,
    accepted: 186,
    rejected: 48,
    unique_reviewers: 8,
  },
  {
    date: "2026-01-07",
    reviews_completed: 220,
    accepted: 174,
    rejected: 46,
    unique_reviewers: 7,
  },
  {
    date: "2026-01-06",
    reviews_completed: 211,
    accepted: 168,
    rejected: 43,
    unique_reviewers: 7,
  },
  {
    date: "2026-01-05",
    reviews_completed: 114,
    accepted: 92,
    rejected: 22,
    unique_reviewers: 4,
  },
  {
    date: "2026-01-04",
    reviews_completed: 96,
    accepted: 78,
    rejected: 18,
    unique_reviewers: 4,
  },
];

// From 27_documents_most_updates.jsonc (top 10 for display)
export const documentsNeedingAttention: DocumentActivity[] = [
  {
    flow_id: "f2852d86-6c28-47dd-8474-fa0c24aaeb3b",
    document_title: "End of year: Important dates and EOY guidance",
    analysis_runs: 378,
    total_conflicts: 921,
    pending_conflicts: 356,
    accepted_conflicts: 423,
    rejected_conflicts: 142,
    latest_analysis: "2026-01-12 01:31:08.748034+00",
  },
  {
    flow_id: "85a0c2df-5701-4390-abba-05ddfcf55174",
    document_title: "Check your company's Secretary of State status",
    analysis_runs: 102,
    total_conflicts: 618,
    pending_conflicts: 234,
    accepted_conflicts: 289,
    rejected_conflicts: 95,
    latest_analysis: "2026-01-12 00:55:51.466303+00",
  },
  {
    flow_id: "92307e50-9446-4d46-b9c9-168270ef6d20",
    document_title: "Dismiss and rehire US employees (for admins)",
    analysis_runs: 182,
    total_conflicts: 540,
    pending_conflicts: 198,
    accepted_conflicts: 256,
    rejected_conflicts: 86,
    latest_analysis: "2026-01-01 00:07:53.539386+00",
  },
  {
    flow_id: "79a00de6-ca2c-4d03-a09b-c288c614e649",
    document_title: "Dismiss and rehire employees",
    analysis_runs: 122,
    total_conflicts: 400,
    pending_conflicts: 145,
    accepted_conflicts: 189,
    rejected_conflicts: 66,
    latest_analysis: "2026-01-11 01:44:53.687488+00",
  },
  {
    flow_id: "06cdf8ce-6aea-40c8-955b-40a81d54418f",
    document_title: "Run a dismissal payroll",
    analysis_runs: 112,
    total_conflicts: 384,
    pending_conflicts: 142,
    accepted_conflicts: 178,
    rejected_conflicts: 64,
    latest_analysis: "2026-01-11 01:44:53.687488+00",
  },
  {
    flow_id: "1065525c-55d0-4d50-8910-d3366c350f60",
    document_title: "Run a dismissal payroll (for admins)",
    analysis_runs: 154,
    total_conflicts: 206,
    pending_conflicts: 76,
    accepted_conflicts: 98,
    rejected_conflicts: 32,
    latest_analysis: "2026-01-11 01:44:53.687488+00",
  },
  {
    flow_id: "76adcb8f-f95a-4e5d-b3d2-6c34d237a2fa",
    document_title: "State unemployment insurance (SUI) tax (for admins)",
    analysis_runs: 96,
    total_conflicts: 131,
    pending_conflicts: 48,
    accepted_conflicts: 62,
    rejected_conflicts: 21,
    latest_analysis: "2026-01-01 00:33:26.213034+00",
  },
  {
    flow_id: "76efaacd-c371-4876-94b3-19f31a0a18d5",
    document_title: "Set up and manage tax exemptions",
    analysis_runs: 72,
    total_conflicts: 111,
    pending_conflicts: 42,
    accepted_conflicts: 51,
    rejected_conflicts: 18,
    latest_analysis: "2025-12-29 08:32:19.399453+00",
  },
  {
    flow_id: "def6c278-b986-48cc-9e7b-dfa726c04bd1",
    document_title: "Federal Form W-4 information",
    analysis_runs: 85,
    total_conflicts: 109,
    pending_conflicts: 39,
    accepted_conflicts: 52,
    rejected_conflicts: 18,
    latest_analysis: "2026-01-11 01:26:38.729494+00",
  },
  {
    flow_id: "d186ab4c-ebe0-46b5-bd20-5338779f336a",
    document_title: "TaxOps: IRS 940",
    analysis_runs: 62,
    total_conflicts: 103,
    pending_conflicts: 37,
    accepted_conflicts: 49,
    rejected_conflicts: 17,
    latest_analysis: "2025-12-29 08:08:39.255793+00",
  },
];

// From 13_user_corrections.jsonc
export const userCorrections: UserCorrectionsSummary = {
  total_user_corrections: 412,
  unique_correctors: 7,
  correction_rate_percentage: "4.45",
};

// Calculated team overview
export const teamOverview: TeamOverview = {
  activeReviewers: reviewers.length,
  totalReviews: reviewers.reduce((acc, r) => acc + r.reviews_completed, 0),
  avgReviewsPerDay: Math.round(
    reviewers.reduce((acc, r) => acc + r.reviews_completed, 0) / 30
  ),
  avgReviewTimeHours:
    Math.round(
      (reviewers.reduce((acc, r) => acc + r.avg_review_time_hours, 0) /
        reviewers.length) *
        10
    ) / 10,
  correctionRate: userCorrections.correction_rate_percentage,
};
