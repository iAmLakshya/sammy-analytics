import type {
  AnalysisPerformance,
  DailyAnalysisRuns,
  PerformanceBucket,
} from "../types";

// Daily analysis runs data - from 22_analysis_runs_per_day.jsonc
export const dailyAnalysisRuns: DailyAnalysisRuns[] = [
  {
    date: "2026-01-12",
    total_runs: 412,
    runs_with_conflicts: 298,
    conflicts_detected: 289,
    avg_conflicts_per_run: 0.97,
  },
  {
    date: "2026-01-11",
    total_runs: 234,
    runs_with_conflicts: 167,
    conflicts_detected: 156,
    avg_conflicts_per_run: 0.93,
  },
  {
    date: "2026-01-10",
    total_runs: 478,
    runs_with_conflicts: 356,
    conflicts_detected: 342,
    avg_conflicts_per_run: 0.96,
  },
  {
    date: "2026-01-09",
    total_runs: 423,
    runs_with_conflicts: 312,
    conflicts_detected: 298,
    avg_conflicts_per_run: 0.95,
  },
  {
    date: "2026-01-08",
    total_runs: 567,
    runs_with_conflicts: 428,
    conflicts_detected: 412,
    avg_conflicts_per_run: 0.96,
  },
  {
    date: "2026-01-07",
    total_runs: 542,
    runs_with_conflicts: 401,
    conflicts_detected: 385,
    avg_conflicts_per_run: 0.96,
  },
  {
    date: "2026-01-06",
    total_runs: 512,
    runs_with_conflicts: 382,
    conflicts_detected: 367,
    avg_conflicts_per_run: 0.96,
  },
  {
    date: "2026-01-05",
    total_runs: 289,
    runs_with_conflicts: 211,
    conflicts_detected: 198,
    avg_conflicts_per_run: 0.94,
  },
  {
    date: "2026-01-04",
    total_runs: 245,
    runs_with_conflicts: 178,
    conflicts_detected: 167,
    avg_conflicts_per_run: 0.94,
  },
];

// Analysis performance metrics - from 23_analysis_performance.jsonc
export const analysisPerformance: AnalysisPerformance = {
  completed_runs: 3702,
  avg_duration_seconds: 487.35,
  median_duration_seconds: 412.18,
  min_duration_seconds: 52.34,
  max_duration_seconds: 1842.67,
};

// Simulated performance distribution for histogram
// Based on typical right-skewed distribution with median around 412s
export const performanceDistribution: PerformanceBucket[] = [
  { range: "0-2m", count: 312, percentage: 8.4 },
  { range: "2-5m", count: 892, percentage: 24.1 },
  { range: "5-8m", count: 1423, percentage: 38.4 },
  { range: "8-12m", count: 687, percentage: 18.6 },
  { range: "12-20m", count: 298, percentage: 8.1 },
  { range: "20m+", count: 90, percentage: 2.4 },
];
