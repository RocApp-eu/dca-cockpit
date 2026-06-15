// Logique du signal hebdomadaire, en JS pur (aucune dépendance).
// Miroir de web/src/lib/dca-math.ts : la même formule doit régner des deux côtés.

const MULT_MIN = 0.6;
const MULT_MAX = 2.0;
const SMOOTH_CURRENT = 0.6;
const SMOOTH_PREVIOUS = 0.4;
const DEAD_BAND = 0.1;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Multiplicateur brut à partir des deux entrées publiques.
 * @param {number} fearGreed Indice Fear & Greed crypto, moyenne 7 j., 0 à 100.
 * @param {number} msciDrawdown Drawdown MSCI World 52 sem., négatif (ex: -0.082).
 */
export function computeRawWeeklyMultiplier(fearGreed, msciDrawdown) {
  const fgClamped = clamp(fearGreed, 0, 100);
  const ddClamped = clamp(msciDrawdown, -0.5, 0);
  const fearGreedAdjustment = ((50 - fgClamped) / 50) * 0.5;
  const drawdownAdjustment = -ddClamped * 4;
  const raw = 1 + fearGreedAdjustment + drawdownAdjustment;
  return clamp(raw, MULT_MIN, MULT_MAX);
}

/** Lissage anti-whipsaw : 0,6 × calcul + 0,4 × semaine n−1, bande morte 0,1. */
export function smoothWeeklyMultiplier(rawCurrent, previousSmoothed) {
  if (previousSmoothed === null || previousSmoothed === undefined) {
    return clamp(rawCurrent, MULT_MIN, MULT_MAX);
  }
  const smoothed = SMOOTH_CURRENT * rawCurrent + SMOOTH_PREVIOUS * previousSmoothed;
  const clamped = clamp(smoothed, MULT_MIN, MULT_MAX);
  if (Math.abs(clamped - previousSmoothed) < DEAD_BAND) {
    return previousSmoothed;
  }
  return clamped;
}

export function averageMultipliers(multipliers) {
  if (multipliers.length === 0) return 1;
  return multipliers.reduce((a, m) => a + m, 0) / multipliers.length;
}

/** Tendance qualitative sur les N derniers signaux. */
export function multiplierTrend(recentMultipliers) {
  if (recentMultipliers.length < 4) return "flat";
  const half = Math.floor(recentMultipliers.length / 2);
  const recent = averageMultipliers(recentMultipliers.slice(0, half));
  const older = averageMultipliers(recentMultipliers.slice(half));
  const delta = recent - older;
  if (delta > DEAD_BAND) return "up";
  if (delta < -DEAD_BAND) return "down";
  return "flat";
}

/** Numéro de semaine ISO 8601 (1 à 53). */
export function isoWeekNumber(date) {
  const target = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayNumber = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNumber = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNumber + 3);
  return (
    1 +
    Math.round(
      (target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000),
    )
  );
}

/** Année ISO associée au numéro de semaine ISO (gère le chevauchement de fin d'année). */
export function isoWeekYear(date) {
  const target = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const dayNumber = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  return target.getUTCFullYear();
}

function comma(n, digits = 1) {
  return n.toFixed(digits).replace(".", ",");
}

/** Verdict humain court, généré à partir des entrées. */
export function buildVerdict(fearGreed, msciDrawdown, multiplier) {
  const ddPct = comma(Math.abs(msciDrawdown * 100));
  if (multiplier >= 1.15) {
    return `Panique relative sur les marchés (Fear & Greed ${Math.round(
      fearGreed,
    )}) et repli des indices mondiaux (${ddPct} %). Contexte favorable à une pondération renforcée cette semaine.`;
  }
  if (multiplier <= 0.9) {
    return `Marché serein voire avide (Fear & Greed ${Math.round(
      fearGreed,
    )}) et indices proches de leurs sommets. Allégez légèrement votre versement cette semaine.`;
  }
  return `Sentiment équilibré (Fear & Greed ${Math.round(
    fearGreed,
  )}), repli mesuré des indices (${ddPct} %). Maintenez votre versement habituel cette semaine.`;
}

/**
 * Construit le document de signal complet à publier dans Firestore.
 * @param {object} p
 * @param {number} p.fearGreed
 * @param {number} p.msciDrawdown
 * @param {number|null} p.previousMultiplier
 * @param {number[]} p.recentMultipliers  semaines précédentes, plus récent en premier
 * @param {number[]} p.monthMultipliers   multiplicateurs du mois courant déjà publiés
 * @param {Date} p.now
 */
export function buildSignalDoc({
  fearGreed,
  msciDrawdown,
  previousMultiplier,
  recentMultipliers,
  monthMultipliers,
  now,
}) {
  const week = isoWeekNumber(now);
  const year = isoWeekYear(now);
  const raw = computeRawWeeklyMultiplier(fearGreed, msciDrawdown);
  const multiplier = smoothWeeklyMultiplier(raw, previousMultiplier ?? null);

  const allForTrend = [multiplier, ...recentMultipliers].slice(0, 4);
  const trend = multiplierTrend(allForTrend);

  const avgMonthValues = [multiplier, ...monthMultipliers];
  const avgMonth = averageMultipliers(avgMonthValues);

  const deltaPrev =
    previousMultiplier == null
      ? null
      : Math.round((multiplier - previousMultiplier) * 100) / 100;

  return {
    weekId: `${year}-W${String(week).padStart(2, "0")}`,
    year,
    week,
    month: now.getUTCMonth() + 1,
    sortKey: year * 100 + week,
    multiplier: Math.round(multiplier * 100) / 100,
    rawMultiplier: Math.round(raw * 100) / 100,
    previousMultiplier: previousMultiplier ?? null,
    fearGreed: Math.round(fearGreed * 10) / 10,
    msciDrawdown: Math.round(msciDrawdown * 10000) / 10000,
    verdict: buildVerdict(fearGreed, msciDrawdown, multiplier),
    avgMonth: Math.round(avgMonth * 100) / 100,
    trend,
    deltaPrev,
    publishedAtLabel: "MAJ DIMANCHE · 20:00",
  };
}
