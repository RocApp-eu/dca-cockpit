"use client";

import { useState, type CSSProperties } from "react";
import { useSignal } from "@/lib/signals";
import { useUserData } from "@/lib/user-context";
import { addDeposit } from "@/lib/user-data";

function comma(n: number, digits = 1): string {
  return n.toFixed(digits).replace(".", ",");
}

const TREND_LABEL: Record<string, { label: string; cls: string }> = {
  up: { label: "↑ Hausse", cls: "strip-up" },
  down: { label: "↓ Baisse", cls: "strip-down" },
  flat: { label: "→ Stable", cls: "" },
};

export function SignalHero() {
  const { latest, loading } = useSignal();
  const { uid, profile, deposits } = useUserData();
  const [busy, setBusy] = useState(false);
  // null = on suit le montant suggéré ; sinon la saisie brute (string, pour
  // autoriser un champ momentanément vide pendant la frappe).
  const [customRaw, setCustomRaw] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="signal-hero">
        <div className="signal-head">
          <span className="sig-live">EN DIRECT</span>
          <span>Chargement…</span>
        </div>
        <div className="signal-big" style={{ opacity: 0.25 }}>
          —<span className="x">×</span>
        </div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="signal-hero">
        <div className="signal-head">
          <span className="sig-live" style={{ background: "var(--muted)" }}>
            EN ATTENTE
          </span>
          <span>Aucun signal publié</span>
        </div>
        <div className="signal-big" style={{ opacity: 0.3 }}>
          —<span className="x">×</span>
        </div>
        <p className="signal-verdict">
          Le premier multiplicateur sera publié dimanche à 20h. Revenez en début
          de semaine pour connaître votre pondération.
        </p>
      </div>
    );
  }

  const mult = latest.multiplier;
  const cap = profile?.settings.multiplierCap ?? 2;
  const effMult = Math.min(mult, cap); // respecte le plafond personnel
  const usual = profile?.settings.usualAmount ?? 50;
  const suggested = Math.round(usual * effMult);
  const isCustom = customRaw !== null; // l'utilisateur a touché le champ
  const inputValue = customRaw ?? String(suggested);
  const amount =
    customRaw === null
      ? suggested
      : customRaw.trim() === "" || !Number.isFinite(Number(customRaw))
        ? 0
        : Math.max(0, Math.round(Number(customRaw)));
  const monthlyEq = Math.round((amount * 52) / 12);
  const capped = effMult < mult;

  const alreadyConfirmed = deposits.some((d) => d.weekId === latest.weekId);
  const canConfirm =
    Boolean(uid && profile) && !alreadyConfirmed && !busy && amount > 0;

  const fg = latest.fearGreed;
  const fgWarn = fg < 50;
  const ddPct = latest.msciDrawdown * 100; // négatif
  const ddBar = Math.min(100, (Math.abs(latest.msciDrawdown) / 0.2) * 100);

  const trend = TREND_LABEL[latest.trend] ?? TREND_LABEL.flat;

  async function handleConfirm() {
    if (!uid || !profile || !latest) return;
    setBusy(true);
    try {
      await addDeposit(uid, {
        amount,
        // Pour un montant personnalisé, le multiplicateur stocké reflète le
        // montant réel (amount/habituel), pour rester cohérent dans l'historique.
        multiplier:
          isCustom && usual > 0
            ? Math.round((amount / usual) * 100) / 100
            : effMult,
        weekId: latest.weekId,
        weekLabel: `S${latest.week} ${latest.year}`,
        note: isCustom
          ? "Versement saisi manuellement"
          : mult >= 1.05
            ? "Versement renforcé, signal supérieur à la moyenne"
            : mult <= 0.95
              ? "Versement allégé, marché tendu vers l'euphorie"
              : "Versement, signal neutre",
      });
    } catch (err) {
      console.error("addDeposit a échoué", err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="signal-hero">
      <div className="signal-head">
        <span className="sig-live">EN DIRECT</span>
        <span>
          SEMAINE {latest.week} · {latest.year}
        </span>
      </div>

      <div className="signal-big">
        {comma(mult)}
        <span className="x">×</span>
      </div>
      <p className="signal-verdict">
        {latest.verdict ||
          "Multiplicateur valide pour tout versement programmé cette semaine."}
      </p>

      <div className="signal-strip">
        <div className="strip-item">
          <span className="strip-label">Moyenne du mois</span>
          <span className="strip-value">
            {latest.avgMonth != null ? `${comma(latest.avgMonth)}×` : "—"}
          </span>
        </div>
        <div className="strip-divider" />
        <div className="strip-item">
          <span className="strip-label">Tendance 4 sem.</span>
          <span className={`strip-value ${trend.cls}`}>{trend.label}</span>
        </div>
        <div className="strip-divider" />
        <div className="strip-item">
          <span className="strip-label">
            Variation vs S{Math.max(0, latest.week - 1)}
          </span>
          <span
            className={`strip-value ${
              latest.deltaPrev != null && latest.deltaPrev > 0
                ? "strip-up"
                : latest.deltaPrev != null && latest.deltaPrev < 0
                  ? "strip-down"
                  : ""
            }`}
          >
            {latest.deltaPrev == null
              ? "—"
              : `${latest.deltaPrev > 0 ? "+" : ""}${comma(latest.deltaPrev)}`}
          </span>
        </div>
      </div>

      <div className="signal-action">
        <div>
          <div className="label">Versement cette semaine</div>
          <div className="value">
            <span className="signal-amount-field">
              <input
                type="number"
                min={0}
                step={5}
                value={inputValue}
                onChange={(e) => setCustomRaw(e.target.value)}
                disabled={alreadyConfirmed}
                aria-label="Montant du versement"
              />
              <span className="signal-amount-cur">€</span>
            </span>
            <span className="from">
              suggéré {suggested} € (habituel {usual} € × {comma(effMult)})
              {capped ? ` · plafonné à ×${comma(cap)}` : ""} · équivalent mensuel{" "}
              {monthlyEq} €
              {isCustom && !alreadyConfirmed ? (
                <button
                  type="button"
                  className="signal-amount-reset"
                  onClick={() => setCustomRaw(null)}
                >
                  réinitialiser
                </button>
              ) : null}
            </span>
          </div>
        </div>
        <div />
        <button
          type="button"
          className="btn"
          onClick={handleConfirm}
          disabled={!canConfirm}
        >
          {alreadyConfirmed
            ? "Versement confirmé ✓"
            : busy
              ? "Enregistrement…"
              : `Confirmer ${amount} €`}
        </button>
      </div>

      <div className="signal-factors">
        <div className="factor">
          <div className="factor-head">
            <span className="factor-k">Indice Fear &amp; Greed (7 j.)</span>
            <span className={`factor-v ${fgWarn ? "warn" : "ok"}`}>
              {Math.round(fg)} / 100
            </span>
          </div>
          <div
            className="factor-bar"
            style={
              {
                color: fgWarn ? "var(--copper)" : "var(--ok)",
                "--bar-w": `${Math.round(fg)}%`,
              } as CSSProperties
            }
          />
          <p className="factor-desc">
            {fg < 35
              ? "Panique sur les marchés crypto. Les investisseurs vendent sous l'effet de l'émotion."
              : fg < 50
                ? "Marché crypto prudent, légère aversion au risque."
                : fg < 65
                  ? "Sentiment équilibré sur les marchés crypto."
                  : "Avidité dominante. Le marché s'emballe, prudence sur la pondération."}
          </p>
        </div>
        <div className="factor">
          <div className="factor-head">
            <span className="factor-k">Drawdown MSCI World</span>
            <span className="factor-v ok">{comma(ddPct)} %</span>
          </div>
          <div
            className="factor-bar"
            style={
              { color: "var(--ok)", "--bar-w": `${Math.round(ddBar)}%` } as CSSProperties
            }
          />
          <p className="factor-desc">
            Les actions mondiales reculent de {comma(Math.abs(ddPct))} % par
            rapport à leur plus haut des 52 dernières semaines.
          </p>
        </div>
      </div>
    </div>
  );
}
