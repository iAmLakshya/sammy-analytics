export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch ${endpoint}`,
      response.status,
      response.statusText
    );
  }

  return response.json();
}
