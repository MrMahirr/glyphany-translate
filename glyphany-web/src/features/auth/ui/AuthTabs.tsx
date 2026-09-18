"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/Icon";

type AuthTab = "login" | "signup";

interface AuthTabsProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

/**
 * Login/Signup tab switcher component.
 * Matches the design: pill-shaped tab bar with active indicator animation.
 */
export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl mb-6">
      <button
        type="button"
        onClick={() => onTabChange("login")}
        className={cn(
          "py-2.5 text-label-lg rounded-lg transition-all duration-200",
          "flex items-center justify-center gap-1.5 cursor-pointer",
          activeTab === "login"
            ? "bg-surface-container-lowest text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        )}
      >
        <Icon name="login" size={18} />
        <span>Log in</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("signup")}
        className={cn(
          "py-2.5 text-label-lg rounded-lg transition-all duration-200",
          "flex items-center justify-center gap-1.5 cursor-pointer",
          activeTab === "signup"
            ? "bg-surface-container-lowest text-primary shadow-sm"
            : "text-on-surface-variant hover:text-on-surface"
        )}
      >
        <Icon name="person_add" size={18} />
        <span>Sign up</span>
      </button>
    </div>
  );
}
