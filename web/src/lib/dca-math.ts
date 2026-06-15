/**
 * DCA mensuel — capitalisation d'un versement mensuel C sur N années à taux annuel r.
 * FV = C × ((1 + r/12)^N − 1) / (r/12)
 */
export function fvDCA(monthly: number, years: number, annualRate: number): number {
  const n = years * 12;
  const m = annualRate / 12;
  if (m === 0) return monthly * n;
  return monthly * ((Math.pow(1 + m, n) - 1) / m);
}

/**
 * DCA hebdomadaire — capitalisation d'un versement hebdo C sur N années à taux annuel r.
 * FV = C × ((1 + r/52)^N×52 − 1) / (r/52)
 */
export function fvWeeklyDCA(weekly: number, years: number, annualRate: number): number {
  const n = years * 52;
  const w = annualRate / 52;
  if (w === 0) return weekly * n;
  return weekly * ((Math.pow(1 + w, n) - 1) / w);
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
 * Band 5 % (r=3 %) → 12 % (r=10 %). Seul le flux périodique bénéficie du signal,
 * le capital initial déjà investi n'est pas "timable".
 */
export function fvWithSignalDCA(monthly: number, years: number, annualRate: number): number {
  const base = fvDCA(monthly, years, annualRate);
  const uplift = 0.05 + Math.min(0.07, Math.max(0, (annualRate - 0.03) * 1.4));
  return base * (1 + uplift);
}

/**
 * Variante hebdomadaire de fvWithSignalDCA.
 */
export function fvWithSignalWeeklyDCA(
  weekly: number,
  years: number,
  annualRate: number,
): number {
  const base = fvWeeklyDCA(weekly, years, annualRate);
  const uplift = 0.05 + Math.min(0.07, Math.max(0, (annualRate - 0.03) * 1.4));
  return base * (1 + uplift);
}

/* ── SIGNAL HEBDOMADAIRE ─────────────────────────── */

const MULT_MIN = 0.6;
const MULT_MAX = 2.0;
const SMOOTH_CURRENT = 0.6;
const SMOOTH_PREVIOUS = 0.4;
const DEAD_BAND = 0.1;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Calcule le multiplicateur DCA brut pour une semaine donnée à partir des deux
 * entrées publiques. Les deux entrées sont normalisées entre 0,6 et 2,0.
 *
 * @param fearGreed - Indice Fear & Greed crypto, 7-day moving average, 0 à 100.
 *                    Plus la valeur est basse (panique), plus le multiplicateur monte.
 * @param msciDrawdown - Drawdown MSCI World 52 sem., en pourcentage négatif (ex : −0,082 pour −8,2 %).
 *                       Plus le drawdown est profond, plus le multiplicateur monte.
 */
export function computeRawWeeklyMultiplier(
  fearGreed: number,
  msciDrawdown: number,
): number {
  const fgClamped = clamp(fearGreed, 0, 100);
  const ddClamped = clamp(msciDrawdown, -0.5, 0);

  // Fear & Greed à 50 = neutre, écart maximum ±0,5
  const fearGreedAdjustment = ((50 - fgClamped) / 50) * 0.5;
  // Drawdown −10 % donne +0,4, drawdown 0 donne 0
  const drawdownAdjustment = -ddClamped * 4;

  const raw = 1 + fearGreedAdjustment + drawdownAdjustment;
  return clamp(raw, MULT_MIN, MULT_MAX);
}

/**
 * Lisse le multiplicateur brut à l'aide de la valeur de la semaine précédente,
 * avec une bande morte pour éviter le whipsaw.
 *
 * Formule : multi = 0,6 × calcul + 0,4 × semaine_précédente.
 * Si la variation absolue est inférieure à la bande morte (0,1), on conserve
 * la valeur de la semaine précédente.
 */
export function smoothWeeklyMultiplier(
  rawCurrent: number,
  previousSmoothed: number | null,
): number {
  if (previousSmoothed === null) {
    return clamp(rawCurrent, MULT_MIN, MULT_MAX);
  }

  const smoothed =
    SMOOTH_CURRENT * rawCurrent + SMOOTH_PREVIOUS * previousSmoothed;
  const clamped = clamp(smoothed, MULT_MIN, MULT_MAX);

  if (Math.abs(clamped - previousSmoothed) < DEAD_BAND) {
    return previousSmoothed;
  }

  return clamped;
}

/**
 * Pipeline complet : entrées publiques → multiplicateur lissé.
 */
export function computeWeeklyMultiplier(
  fearGreed: number,
  msciDrawdown: number,
  previousSmoothed: number | null,
): number {
  const raw = computeRawWeeklyMultiplier(fearGreed, msciDrawdown);
  return smoothWeeklyMultiplier(raw, previousSmoothed);
}

/**
 * Moyenne arithmétique d'une série de multiplicateurs hebdomadaires.
 * Pratique pour exposer la "moyenne du mois" aux users qui DCA mensuel.
 */
export function averageMultipliers(multipliers: number[]): number {
  if (multipliers.length === 0) return 1;
  const sum = multipliers.reduce((acc, m) => acc + m, 0);
  return sum / multipliers.length;
}

/**
 * Tendance qualitative sur les N derniers signaux : up, down, flat.
 * Compare la moyenne des N/2 plus récents à la moyenne des N/2 plus anciens.
 */
export function multiplierTrend(
  recentMultipliers: number[],
): "up" | "down" | "flat" {
  if (recentMultipliers.length < 4) return "flat";
  const half = Math.floor(recentMultipliers.length / 2);
  const recent = averageMultipliers(recentMultipliers.slice(0, half));
  const older = averageMultipliers(recentMultipliers.slice(half));
  const delta = recent - older;
  if (delta > DEAD_BAND) return "up";
  if (delta < -DEAD_BAND) return "down";
  return "flat";
}

/**
 * Numéro de semaine ISO 8601 (1 à 53) pour une date donnée.
 * Usage : route SEO `/signal/semaine-XX-AAAA`, archive du cockpit, etc.
 */
export function isoWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);
  return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
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

/** Formatage multiplicateur "×1,6" en locale fr-FR. */
export function fmtMultiplier(m: number): string {
  const rounded = Math.round(m * 10) / 10;
  return `×${rounded.toFixed(1).replace(".", ",")}`;
}
