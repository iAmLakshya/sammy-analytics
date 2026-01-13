import { NextResponse } from "next/server"

import { dailyAnalysisRuns } from "@/features/analysis/data/mock.analysis.data"
import type { DailyAnalysisResponse } from "@/features/analysis/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 150))

  const response: DailyAnalysisResponse = {
    data: dailyAnalysisRuns,
  }

  return NextResponse.json(response)
}
