"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import * as authApi from "../api/authApi";
import type { LoginPayload, RegisterPayload } from "../../../domain/auth/authDomains";

/**
 * Auth custom hook.
 * Tüm auth işlemlerini (login, register, logout) ve state'i tek bir yerden sağlar.
 * Component'ler bu hook üzerinden auth state'e ve aksiyonlara erişir.
 */
export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, setLoading } =
    useAuthStore();

  const handleLogin = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      try {
        const response = await authApi.login(payload);
        setAuth(response.user, response.accessToken);
        router.push("/translations");
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [setAuth, setLoading, router]
  );

  const handleRegister = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        const response = await authApi.register(payload);
        setAuth(response.user, response.accessToken);
        router.push("/translations");
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [setAuth, setLoading, router]
  );

  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout API failure should not block client-side cleanup
    } finally {
      clearAuth();
      router.push("/login");
    }
  }, [clearAuth, router]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  } as const;
}
