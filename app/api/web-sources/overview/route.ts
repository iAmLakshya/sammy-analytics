import { NextResponse } from "next/server"

import {
  webWatchOverview,
  webPageSyncOverview,
  syncCoverage,
  priorityBreakdown,
} from "@/features/web-sources/data/mock.web-sources.data"
import type { WebSourcesOverviewResponse } from "@/features/web-sources/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 200))

  const response: WebSourcesOverviewResponse = {
    webWatch: webWatchOverview,
    syncOverview: webPageSyncOverview,
    syncCoverage,
    priorityBreakdown,
  }

  return NextResponse.json(response)
}
