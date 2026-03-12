import { tokenStorage } from "@/auth/tokenStorage";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

export interface ApiResponse<T = unknown> {
  data?: T;
  errors?: Array<{ detail: string; code: string }>;
  pagination?: {
    totalData: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class ApiError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = "ApiError";
  }
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshTokens(): Promise<void> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clearTokens();
    throw new ApiError("No refresh token", 401);
  }

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const json: ApiResponse<{ token: string; refreshToken: string }> =
    await res.json();

  if (!res.ok || json.errors?.length) {
    tokenStorage.clearTokens();
    throw new ApiError(json.errors?.[0]?.detail || "Token refresh failed", 401);
  }

  if (json.data) {
    tokenStorage.setTokens(json.data.token, json.data.refreshToken);
  }
}

async function handleTokenRefresh(): Promise<void> {
  if (isRefreshing) {
    return refreshPromise!;
  }
  isRefreshing = true;
  refreshPromise = refreshTokens().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const makeRequest = async (): Promise<T> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = tokenStorage.getAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (res.status === 204) {
      return undefined as T;
    }

    const json: ApiResponse<T> = await res.json();

    if (json.errors?.length) {
      throw new ApiError(
        json.errors[0].detail ||
          "Unexpected error occurred, please try again later",
        res.status,
      );
    }

    if (!res.ok) {
      throw new ApiError("Request failed", res.status);
    }

    return json.data as T;
  };

  try {
    return await makeRequest();
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.code === 401 &&
      tokenStorage.getRefreshToken()
    ) {
      try {
        await handleTokenRefresh();
        return await makeRequest();
      } catch {
        tokenStorage.clearTokens();
        globalThis.location.href = "/login";
        throw error;
      }
    }
    throw error;
  }
}
