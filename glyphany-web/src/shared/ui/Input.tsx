"use client";

import React, { useState, useId } from "react";
import { cn } from "../../shared/lib/cn";
import { Icon } from "./Icon";

/* ─── Types ─── */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  labelRight?: React.ReactNode;
  leftIcon?: string;
  rightAction?: React.ReactNode;
  error?: string;
  inputSize?: "md" | "lg";
}

/**
 * Global reusable Input component.
 * Supports left icon, right action slot, label, error state, and password toggle.
 * Single Responsibility: Input rendering + visual states only; no form logic.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      labelRight,
      leftIcon,
      rightAction,
      error,
      inputSize = "md",
      className,
      id: externalId,
      ...rest
    },
    ref
  ) {
    const generatedId = useId();
    const inputId = externalId || generatedId;

    const heightClass = inputSize === "lg" ? "h-12" : "h-11";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-lg text-on-surface flex items-center justify-between"
          >
            <span>{label}</span>
            {labelRight}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 pointer-events-none">
              <Icon
                name={leftIcon}
                size={20}
                className="text-on-surface-variant"
              />
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg bg-surface-container-low text-on-surface",
              "placeholder:text-on-surface-variant",
              "text-body-md",
              "focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#4f46e5]",
              "transition duration-200",
              heightClass,
              leftIcon ? "pl-10" : "pl-3",
              rightAction ? "pr-10" : "pr-3",
              error &&
                "shadow-[0_0_0_2px_theme(colors.error)] focus:shadow-[0_0_0_2px_theme(colors.error)]",
              className
            )}
            {...rest}
          />

          {rightAction && (
            <div className="absolute right-3 flex items-center">
              {rightAction}
            </div>
          )}
        </div>

        {error && (
          <span className="text-label-md text-error flex items-center gap-1">
            <Icon name="error" size={14} className="text-error" />
            {error}
          </span>
        )}
      </div>
    );
  }
);
