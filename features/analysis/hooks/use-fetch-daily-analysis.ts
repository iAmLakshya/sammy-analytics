import { useQuery } from "@tanstack/react-query"

import type { DailyAnalysisResponse } from "../types"

const fetchDailyAnalysis = async (): Promise<DailyAnalysisResponse> => {
  const response = await fetch("/api/analysis/daily")
  if (!response.ok) {
    throw new Error("Failed to fetch daily analysis data")
  }
  return response.json()
}

export const useFetchDailyAnalysis = () => {
  return useQuery({
    queryKey: ["analysis", "daily"],
    queryFn: fetchDailyAnalysis,
    staleTime: 60 * 1000,
  })
}
