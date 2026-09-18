/**
 * Auth Domain Types.
 * Login, Register, ve User profile için tüm request/response tipleri.
 */

/* ─── Request Payloads ─── */

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  acceptTerms: boolean;
}

/* ─── Response Types ─── */

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  organization?: string;
  role: UserRole;
  createdAt: string;
}

/* ─── Enums ─── */

export type UserRole = "user" | "admin" | "enterprise";

export type AuthProvider = "credentials" | "google" | "github" | "sso";
