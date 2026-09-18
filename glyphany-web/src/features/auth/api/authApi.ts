import { apiClient } from "../../../lib/http";
import { AuthApiMethod } from "../../../constant/MethodNames";
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  UserProfile,
} from "../../../domain/auth/authDomains";

/**
 * Auth API fonksiyonları.
 * Her fonksiyon standalone async function olarak export edilir.
 * TanStack Query hook'ları bu fonksiyonları queryFn/mutationFn olarak consume eder.
 */

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    AuthApiMethod.LOGIN,
    payload
  );
  return response.data;
}

export async function register(
  payload: RegisterPayload
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(
    AuthApiMethod.REGISTER,
    payload
  );
  return response.data;
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(AuthApiMethod.REFRESH, {
    refreshToken: token,
  });
  return response.data;
}

export async function getMe(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>(AuthApiMethod.ME);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post(AuthApiMethod.LOGOUT);
}
