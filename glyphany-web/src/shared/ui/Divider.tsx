import React from "react";
import { cn } from "../../shared/lib/cn";

export interface DividerProps {
  /** Optional text to display in the center of the divider */
  text?: string;
  className?: string;
}

/**
 * Horizontal divider with optional centered text.
 * Used for "or authenticate with" style separators.
 */
export function Divider({ text, className }: DividerProps) {
  if (!text) {
    return (
      <div
        className={cn("w-full h-px bg-surface-container-high", className)}
      />
    );
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-surface-container-high" />
      </div>
      <span className="relative px-3 bg-surface-container-lowest text-label-caps text-on-surface-variant uppercase tracking-wider">
        {text}
      </span>
    </div>
  );
}
