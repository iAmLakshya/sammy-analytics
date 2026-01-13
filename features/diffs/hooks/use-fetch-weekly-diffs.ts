import { useQuery } from "@tanstack/react-query"

import type { WeeklyDiffsResponse } from "../types"

const fetchWeeklyDiffs = async (): Promise<WeeklyDiffsResponse> => {
  const response = await fetch("/api/diffs/weekly")
  if (!response.ok) {
    throw new Error("Failed to fetch weekly diffs")
  }
  return response.json()
}

export const useFetchWeeklyDiffs = () => {
  return useQuery({
    queryKey: ["diffs", "weekly"],
    queryFn: fetchWeeklyDiffs,
    staleTime: 60 * 1000,
  })
}
