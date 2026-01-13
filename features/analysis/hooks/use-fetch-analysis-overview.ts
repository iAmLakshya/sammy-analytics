import { useQuery } from "@tanstack/react-query"

import type { AnalysisOverviewResponse } from "../types"

const fetchAnalysisOverview = async (): Promise<AnalysisOverviewResponse> => {
  const response = await fetch("/api/analysis/overview")
  if (!response.ok) {
    throw new Error("Failed to fetch analysis overview")
  }
  return response.json()
}

export const useFetchAnalysisOverview = () => {
  return useQuery({
    queryKey: ["analysis", "overview"],
    queryFn: fetchAnalysisOverview,
    staleTime: 60 * 1000,
  })
}
