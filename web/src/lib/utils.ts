import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusion intelligente de classes Tailwind, style shadcn.
 * Permet de composer et override des classes sans conflit.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
