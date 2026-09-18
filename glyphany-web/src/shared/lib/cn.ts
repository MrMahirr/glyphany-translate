import { clsx, type ClassValue } from "clsx";

/**
 * Conditional className birleştirme utility.
 * clsx ile className'leri birleştirir.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
