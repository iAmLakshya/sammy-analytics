import { NextResponse } from "next/server"

import {
  analysisPerformance,
  performanceDistribution,
} from "@/features/analysis/data/mock.analysis.data"
import type { AnalysisOverviewResponse } from "@/features/analysis/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 200))

  const response: AnalysisOverviewResponse = {
    performance: analysisPerformance,
    performanceDistribution,
  }

  return NextResponse.json(response)
}
