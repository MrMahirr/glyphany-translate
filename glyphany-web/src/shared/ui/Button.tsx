"use client";

import React from "react";
import { cn } from "../../shared/lib/cn";
import { Icon } from "./Icon";

/* ─── Types ─── */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

/* ─── Variant Styles ─── */

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-container text-on-primary hover:bg-primary shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-lg",
  secondary:
    "bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container hover:border-outline",
  ghost:
    "bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
  danger:
    "bg-error text-on-error hover:bg-error/90 shadow-[0_4px_14px_rgba(186,26,26,0.2)]",
};

/* ─── Size Styles ─── */

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-label-md gap-1.5 rounded-lg",
  md: "h-11 px-4 text-label-lg gap-2 rounded-xl",
  lg: "h-12 px-5 text-label-lg gap-2 rounded-xl",
};

/**
 * Global reusable Button component.
 * Supports variant, size, loading, icon, and fullWidth props.
 * Open/Closed: New variants can be added to the maps without modifying render logic.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "right",
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && "w-full",
        className
      )}
      disabled={isDisabled}
      {...rest}
    >
      {loading && (
        <span className="animate-spin">
          <Icon name="progress_activity" size={size === "sm" ? 16 : 18} />
        </span>
      )}
      {!loading && icon && iconPosition === "left" && (
        <Icon name={icon} size={size === "sm" ? 16 : 18} />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <Icon name={icon} size={size === "sm" ? 16 : 18} />
      )}
    </button>
  );
}
