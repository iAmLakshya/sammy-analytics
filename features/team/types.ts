// Reviewer data - from 24_most_active_reviewers.jsonc
export interface Reviewer {
  user_id: string;
  reviews_completed: number;
  accepted: number;
  rejected: number;
  corrections_provided: number;
  first_review: string;
  latest_review: string;
  avg_review_time_hours: number;
}

// Day of week activity - from 25_review_by_day_of_week.jsonc
export interface WeekdayActivity {
  day_of_week: string;
  day_number: number;
  reviews_completed: number;
  unique_reviewers: number;
  avg_review_time_hours: number;
}

// Review activity over time - from 11_conflict_review_activity.jsonc
export interface DailyReviewActivity {
  date: string;
  reviews_completed: number;
  accepted: number;
  rejected: number;
  unique_reviewers: number;
}

// Documents with most updates - from 27_documents_most_updates.jsonc
export interface DocumentActivity {
  flow_id: string;
  document_title: string;
  analysis_runs: number;
  total_conflicts: number;
  pending_conflicts: number;
  accepted_conflicts: number;
  rejected_conflicts: number;
  latest_analysis: string;
}

// User corrections summary - from 13_user_corrections.jsonc
export interface UserCorrectionsSummary {
  total_user_corrections: number;
  unique_correctors: number;
  correction_rate_percentage: string;
}

// Team overview aggregate metrics
export interface TeamOverview {
  activeReviewers: number;
  totalReviews: number;
  avgReviewsPerDay: number;
  avgReviewTimeHours: number;
  correctionRate: string;
}

// API response types
export interface TeamOverviewResponse {
  overview: TeamOverview;
  reviewers: Reviewer[];
  weekdayActivity: WeekdayActivity[];
  corrections: UserCorrectionsSummary;
  documentsNeedingAttention: DocumentActivity[];
}

export interface ReviewActivityResponse {
  data: DailyReviewActivity[];
}
