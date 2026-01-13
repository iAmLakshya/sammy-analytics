import { useQuery } from "@tanstack/react-query"

import type { DailySyncsResponse } from "../types"

const fetchDailySyncs = async (): Promise<DailySyncsResponse> => {
  const response = await fetch("/api/web-sources/daily")
  if (!response.ok) {
    throw new Error("Failed to fetch daily syncs")
  }
  return response.json()
}

export const useFetchDailySyncs = () => {
  return useQuery({
    queryKey: ["web-sources", "daily"],
    queryFn: fetchDailySyncs,
    staleTime: 60 * 1000,
  })
}
