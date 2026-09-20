"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrateFromStorage = useAuthStore((state) => state.hydrateFromStorage);

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  return <>{children}</>;
}
