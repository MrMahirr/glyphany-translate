import React from "react";
import { cn } from "../../shared/lib/cn";

export interface IconProps {
  /** Material Symbols Outlined icon name (e.g. "login", "person_add") */
  name: string;
  /** Pixel size — maps to font-size */
  size?: number;
  /** Fill variation: 0 (outlined) or 1 (filled) */
  fill?: 0 | 1;
  /** Weight variation: 100–700 */
  weight?: number;
  className?: string;
}

/**
 * Material Symbols Outlined icon wrapper.
 * Single Responsibility: Only renders a Material icon with configurable optical properties.
 */
export function Icon({
  name,
  size = 20,
  fill = 0,
  weight,
  className,
}: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${fill}${weight ? `, 'wght' ${weight}` : ""}`,
      }}
    >
      {name}
    </span>
  );
}
