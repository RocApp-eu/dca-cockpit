/**
 * DCA — capitalisation d'un versement mensuel C sur N années à taux annuel r.
 * FV = C × ((1 + r/12)^N − 1) / (r/12)
 */
export function fvDCA(monthly: number, years: number, annualRate: number): number {
  const n = years * 12;
  const m = annualRate / 12;
  if (m === 0) return monthly * n;
  return monthly * ((Math.pow(1 + m, n) - 1) / m);
}

/**
 * Capital initial composé annuellement sur N années.
 * FV = K × (1 + r)^N
 */
export function fvInitial(initial: number, years: number, annualRate: number): number {
  return initial * Math.pow(1 + annualRate, years);
}

/**
 * Uplift empirique du DCA piloté par signal vs DCA plat.
 * Band 5 % (r=3 %) → 12 % (r=10 %). Seul le flux mensuel bénéficie du signal,
 * le capital initial déjà investi n'est pas "timable".
 */
export function fvWithSignalDCA(monthly: number, years: number, annualRate: number): number {
  const base = fvDCA(monthly, years, annualRate);
  const uplift = 0.05 + Math.min(0.07, Math.max(0, (annualRate - 0.03) * 1.4));
  return base * (1 + uplift);
}

/** Formatage EUR, locale fr-FR, sans décimales. */
export function fmtEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Formatage entier, locale fr-FR. */
export function fmtInt(n: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n);
}
