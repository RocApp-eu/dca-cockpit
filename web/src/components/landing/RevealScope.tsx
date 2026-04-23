"use client";

import { useRevealOnScroll } from "@/lib/landing-hooks";

/**
 * Active le fade-in au scroll pour tous les éléments `[data-reveal]`
 * de la page. À monter une seule fois au niveau de la landing.
 */
export function RevealScope() {
  useRevealOnScroll();
  return null;
}
