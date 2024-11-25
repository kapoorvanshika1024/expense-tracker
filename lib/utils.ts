import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type ClassValue = string | undefined | null | boolean;

/**
 * Combines Tailwind classes with conditional logic.
 *
 * @param inputs - A list of class names or conditions to evaluate.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
