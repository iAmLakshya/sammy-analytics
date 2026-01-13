import { useQuery } from "@tanstack/react-query"

import type { WebSourcesOverviewResponse } from "../types"

const fetchWebSourcesOverview = async (): Promise<WebSourcesOverviewResponse> => {
  const response = await fetch("/api/web-sources/overview")
  if (!response.ok) {
    throw new Error("Failed to fetch web sources overview")
  }
  return response.json()
}

export const useFetchWebSourcesOverview = () => {
  return useQuery({
    queryKey: ["web-sources", "overview"],
    queryFn: fetchWebSourcesOverview,
    staleTime: 60 * 1000,
  })
}
