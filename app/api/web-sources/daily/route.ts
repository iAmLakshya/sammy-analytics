import { NextResponse } from "next/server"

import { dailySyncs } from "@/features/web-sources/data/mock.web-sources.data"
import type { DailySyncsResponse } from "@/features/web-sources/types"

export async function GET() {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 150))

  const response: DailySyncsResponse = {
    data: dailySyncs,
  }

  return NextResponse.json(response)
}
