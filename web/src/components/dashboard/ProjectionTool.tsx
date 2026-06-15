"use client";

import { useMemo, useState, useEffect, type CSSProperties } from "react";
import {
  fmtEUR,
  fvDCA,
  fvInitial,
  fvWithSignalDCA,
} from "@/lib/dca-math";
import { useUserData } from "@/lib/user-context";

type Scenario = { r: number; label: string; sub: string };

// Calibrés sur l'historique du MSCI World dividendes réinvestis, alignés sur le
// calculateur de la landing (central réaliste ~7 %).
const SCENARIOS: Scenario[] = [
  { r: 0.03, label: "Pessimiste", sub: "3 % / an" },
  { r: 0.07, label: "Réaliste", sub: "7 % / an" },
  { r: 0.1, label: "Optimiste", sub: "10 % / an" },
];

export function ProjectionTool() {
  const { profile } = useUserData();

  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [years, setYears] = useState(20);
  const [scenario, setScenario] = useState(1);
  const [withSignal, setWithSignal] = useState(true);

  // Pré-remplit le versement mensuel à partir des réglages DCA de l'utilisateur.
  useEffect(() => {
    if (!profile) return;
    const amt = profile.settings.usualAmount;
    const monthlyEquiv =
      profile.settings.frequency === "weekly" ? Math.round((amt * 52) / 12) : amt;
    if (monthlyEquiv > 0) setMonthly(monthlyEquiv);
  }, [profile]);

  const r = SCENARIOS[scenario].r;

  const finalValue = useMemo(() => {
    const lump = fvInitial(initial, years, r);
    const flux = withSignal
      ? fvWithSignalDCA(monthly, years, r)
      : fvDCA(monthly, years, r);
    return lump + flux;
  }, [initial, monthly, years, r, withSignal]);

  const invested = initial + monthly * years * 12;
  const gains = finalValue - invested;

  // Points annuels pour le graphe.
  const chart = useMemo(() => {
    const pts: { t: number; value: number; paid: number }[] = [];
    for (let t = 0; t <= years; t++) {
      const lump = fvInitial(initial, t, r);
      const flux = withSignal
        ? fvWithSignalDCA(monthly, t, r)
        : fvDCA(monthly, t, r);
      pts.push({ t, value: lump + flux, paid: initial + monthly * t * 12 });
    }
    const yMax = Math.max(...pts.map((p) => p.value), 1) * 1.05;
    return { pts, yMax };
  }, [initial, monthly, years, r, withSignal]);

  const W = 760;
  const H = 240;
  const PAD_L = 58;
  const PAD_R = 18;
  const PAD_T = 18;
  const PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const xOf = (t: number) => PAD_L + (years === 0 ? 0 : (t / years) * innerW);
  const yOf = (v: number) => PAD_T + (1 - v / chart.yMax) * innerH;

  const valuePath = chart.pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)},${yOf(p.value).toFixed(1)}`)
    .join(" ");
  const area = `${valuePath} L${xOf(years).toFixed(1)},${yOf(0).toFixed(1)} L${xOf(0).toFixed(1)},${yOf(0).toFixed(1)} Z`;
  const paidPath = chart.pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)},${yOf(p.paid).toFixed(1)}`)
    .join(" ");

  const yTicks = Array.from({ length: 4 }).map((_, i) => (chart.yMax * (i + 1)) / 4);
  const xStep = years <= 10 ? 2 : years <= 25 ? 5 : 10;
  const xTicks: number[] = [];
  for (let t = 0; t <= years; t += xStep) xTicks.push(t);

  return (
    <div className="proj-tool">
      <div className="proj-controls">
        <label className="proj-field">
          <span className="proj-k">Capital de départ</span>
          <div className="proj-input-wrap">
            <input
              type="number"
              min={0}
              step={500}
              value={initial}
              onChange={(e) => setInitial(Math.max(0, +e.target.value))}
            />
            <span className="proj-unit">€</span>
          </div>
        </label>

        <label className="proj-field">
          <span className="proj-k">Versement / mois</span>
          <div className="proj-input-wrap">
            <input
              type="number"
              min={0}
              step={10}
              value={monthly}
              onChange={(e) => setMonthly(Math.max(0, +e.target.value))}
            />
            <span className="proj-unit">€</span>
          </div>
        </label>

        <label className="proj-field proj-field-range">
          <span className="proj-k">
            Durée <strong>{years} ans</strong>
          </span>
          <input
            type="range"
            className="proj-slider"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            style={{ "--pct": `${((years - 1) / 39) * 100}%` } as CSSProperties}
          />
        </label>
      </div>

      <div className="proj-options">
        <div className="proj-scenarios">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.r}
              type="button"
              className={`proj-scen ${i === scenario ? "active" : ""}`.trim()}
              onClick={() => setScenario(i)}
            >
              <span className="proj-scen-label">{s.label}</span>
              <span className="proj-scen-sub">{s.sub}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`proj-signal ${withSignal ? "on" : ""}`.trim()}
          onClick={() => setWithSignal((v) => !v)}
          aria-pressed={withSignal}
        >
          <span className="proj-signal-dot" />
          Signal DCA {withSignal ? "activé" : "désactivé"}
        </button>
      </div>

      <div className="proj-result">
        <div className="proj-result-main">
          <span className="proj-result-k">
            Capital estimé après {years} ans
          </span>
          <span className="proj-result-big">{fmtEUR(finalValue)}</span>
        </div>
        <div className="proj-result-split">
          <div>
            <span className="proj-split-k">Versé</span>
            <span className="proj-split-v">{fmtEUR(invested)}</span>
          </div>
          <div>
            <span className="proj-split-k">Intérêts &amp; signal</span>
            <span className="proj-split-v gain">+ {fmtEUR(gains)}</span>
          </div>
        </div>
      </div>

      <div className="proj-graph">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="proj-graph-svg">
          <defs>
            <linearGradient id="projArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--copper)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--copper)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={PAD_L} x2={W - PAD_R} y1={yOf(v)} y2={yOf(v)} stroke="var(--line)" strokeWidth="1" />
              <text x={PAD_L - 8} y={yOf(v) + 3} textAnchor="end" fontSize="9.5" fill="var(--muted)" fontFamily="var(--font-jetbrains-mono)">
                {Math.round(v / 1000)}k€
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <text key={t} x={xOf(t)} y={H - PAD_B + 16} textAnchor="middle" fontSize="9.5" fill="var(--muted)" fontFamily="var(--font-jetbrains-mono)">
              {t}a
            </text>
          ))}
          <path d={area} fill="url(#projArea)" />
          <path d={paidPath} fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeDasharray="4 3" />
          <path d={valuePath} fill="none" stroke="var(--copper)" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx={xOf(years)} cy={yOf(finalValue)} r="4" fill="var(--copper)" />
        </svg>
        <div className="proj-legend">
          <span><span className="proj-dot value" /> Capital projeté</span>
          <span><span className="proj-dot paid" /> Versé cumulé</span>
        </div>
      </div>

      <p className="proj-note">
        Projection par intérêts composés, dividendes inclus. Le « signal DCA »
        applique l&apos;effet de la pondération hebdomadaire observé en backtest.
        Estimation, pas une promesse. L&apos;inflation n&apos;est pas déduite.
      </p>
    </div>
  );
}
