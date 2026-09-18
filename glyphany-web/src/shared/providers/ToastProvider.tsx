"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#ffffff",
          color: "#1e1e1e",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          fontFamily: "var(--font-plus-jakarta), sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          border: "1px solid rgba(0,0,0,0.05)",
        },
        success: {
          iconTheme: {
            primary: "#10b981", // Emerald 500
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // Red 500
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
