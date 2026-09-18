import { create } from "zustand";
import type { UserProfile } from "../../../domain/auth/authDomains";

/* ─── State Shape ─── */

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* ─── Actions ─── */

interface AuthActions {
  setAuth: (user: UserProfile, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  hydrateFromStorage: () => void;
}

type AuthStore = AuthState & AuthActions;

/* ─── Storage Keys ─── */

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * Zustand auth store.
 * Single source of truth for authentication state.
 * Token ve user bilgisi localStorage ile persist edilir.
 */
export const useAuthStore = create<AuthStore>((set) => ({
  /* ── Initial State ── */
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  /* ── Actions ── */
  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  hydrateFromStorage: () => {
    if (typeof window === "undefined") {
      set({ isLoading: false });
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as UserProfile;
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
