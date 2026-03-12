import { apiRequest } from "./client";
import { tokenStorage } from "@/auth/tokenStorage";
// import type { LoginFormValues, RegisterFormValues, ResetPasswordValues } from "@/schemas/auth";

export interface AuthTokens {
  type: string;
  token: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  name: string;
  avatar: string;
}

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  profile: UserProfile;
}

// export async function loginApi(values: LoginFormValues): Promise<AuthTokens> {
//   const data = await apiRequest<AuthTokens>("/auth/login", {
//     method: "POST",
//     body: JSON.stringify(values),
//   });
//   tokenStorage.setTokens(data.token, data.refreshToken);
//   return data;
// }

// export async function registerApi(values: RegisterFormValues): Promise<{ message: string }> {
//   return apiRequest<{ message: string }>("/auth/register", {
//     method: "POST",
//     body: JSON.stringify(values),
//   });
// }

// export async function verifyRegistrationApi(token: string): Promise<void> {
//   await apiRequest<void>(`/auth/verify-registration?token=${encodeURIComponent(token)}`, {
//     method: "GET",
//   });
// }

// export async function sendPasswordResetApi(email: string): Promise<void> {
//   await apiRequest<void>("/auth/password-reset", {
//     method: "POST",
//     body: JSON.stringify({ email }),
//   });
// }

// export async function resetPasswordApi(values: ResetPasswordValues & { token: string }): Promise<void> {
//   await apiRequest<void>("/auth/reset-password", {
//     method: "PATCH",
//     body: JSON.stringify(values),
//   });
// }

export async function logoutApi(): Promise<void> {
  try {
    await apiRequest<void>("/auth/logout", { method: "DELETE" });
  } finally {
    tokenStorage.clearTokens();
  }
}

export async function getMeApi(): Promise<User> {
  return apiRequest<User>("/me");
}

export function getOAuthUrl(provider: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";
  return `${baseUrl}/auth/${provider}`;
}

export async function oauthCallbackApi(
  provider: string,
  code: string,
  state: string,
): Promise<AuthTokens> {
  const data = await apiRequest<AuthTokens>(
    `/auth/${provider}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
  );
  tokenStorage.setTokens(data.token, data.refreshToken);
  return data;
}
