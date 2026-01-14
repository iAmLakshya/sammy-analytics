import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { fetchApi } from "./api-client";
import type { ApiEndpoint, ApiEndpointMap } from "./api-endpoints";

type QueryKeyFromEndpoint<T extends string> = T extends `/${infer Rest}`
  ? Rest extends `api/${infer Path}`
    ? Path extends `${infer First}/${infer Second}`
      ? [First, Second]
      : [Path]
    : [Rest]
  : [T];

export function useApiQuery<E extends ApiEndpoint>(
  endpoint: E,
  options?: Omit<UseQueryOptions<ApiEndpointMap[E]>, "queryKey" | "queryFn">
) {
  const queryKey = endpoint
    .replace("/api/", "")
    .split("/") as QueryKeyFromEndpoint<E>;

  return useQuery<ApiEndpointMap[E]>({
    queryKey,
    queryFn: () => fetchApi<ApiEndpointMap[E]>(endpoint),
    staleTime: 60 * 1000,
    ...options,
  });
}
