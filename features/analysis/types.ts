// Daily analysis runs - from 22_analysis_runs_per_day.jsonc
export interface DailyAnalysisRuns {
  date: string
  total_runs: number
  runs_with_conflicts: number
  conflicts_detected: number
  avg_conflicts_per_run: number
}

// Analysis performance metrics - from 23_analysis_performance.jsonc
export interface AnalysisPerformance {
  completed_runs: number
  avg_duration_seconds: number
  median_duration_seconds: number
  min_duration_seconds: number
  max_duration_seconds: number
}

// Performance distribution bucket for histogram
export interface PerformanceBucket {
  range: string
  count: number
  percentage: number
}

// Combined API response for analysis overview
export interface AnalysisOverviewResponse {
  performance: AnalysisPerformance
  performanceDistribution: PerformanceBucket[]
}

// API response for daily analysis runs
export interface DailyAnalysisResponse {
  data: DailyAnalysisRuns[]
}
