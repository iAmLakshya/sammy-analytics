import { useQuery } from "@tanstack/react-query"

import type { ConflictsOverviewResponse } from "../types"

const fetchConflictsOverview = async (): Promise<ConflictsOverviewResponse> => {
  const response = await fetch("/api/conflicts/overview")
  if (!response.ok) {
    throw new Error("Failed to fetch conflicts overview")
  }
  return response.json()
}

export const useFetchConflictsOverview = () => {
  return useQuery({
    queryKey: ["conflicts", "overview"],
    queryFn: fetchConflictsOverview,
    staleTime: 60 * 1000,
  })
}
