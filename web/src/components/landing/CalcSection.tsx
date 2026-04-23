"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { fmtEUR, fmtInt, fvDCA, fvInitial, fvWithSignalDCA } from "@/lib/dca-math";

type Scenario = {
  r: number;
  label: string;
  sub: string;
};

const SCENARIOS: Scenario[] = [
  { r: 0.03, label: "Défensif", sub: "3,0 % / an" },
  { r: 0.07, label: "Central", sub: "7,0 % / an" },
  { r: 0.1, label: "Favorable", sub: "10,0 % / an" },
];

// Horizon fixe de projection (indépendant du curseur) — montre la puissance du temps long.
const PROJECT_YEARS = 40;

export function CalcSection() {
  const [monthly, setMonthly] = useState(300);
  const [initial, setInitial] = useState(0);
  const [years, setYears] = useState(20);
  const [selected, setSelected] = useState(1);

  const monthlyPct = ((monthly - 50) / (5000 - 50)) * 100;
  const initialPct = (initial / 500000) * 100;
  const yearsPct = ((years - 1) / (40 - 1)) * 100;

  const totalInvested = initial + monthly * years * 12;

  const rows = useMemo(
    () =>
      SCENARIOS.map((s) => {
        const lump = fvInitial(initial, years, s.r);
        const flat = lump + fvDCA(monthly, years, s.r);
        const signal = lump + fvWithSignalDCA(monthly, years, s.r);
        return { ...s, flat, signal, gain: signal - flat };
      }),
    [monthly, initial, years]
  );

  const maxSignal = Math.max(...rows.map((r) => r.signal));

  // Projection annuelle pour le scénario sélectionné — horizon fixe PROJECT_YEARS pour montrer l'effet long terme
  const chart = useMemo(() => {
    const s = SCENARIOS[selected];
    const pts: { t: number; flat: number; signal: number }[] = [];
    for (let t = 0; t <= PROJECT_YEARS; t++) {
      const lump = fvInitial(initial, t, s.r);
      pts.push({
        t,
        flat: lump + fvDCA(monthly, t, s.r),
        signal: lump + fvWithSignalDCA(monthly, t, s.r),
      });
    }
    const yMax = Math.max(...pts.map((p) => p.signal)) * 1.05;
    return { pts, yMax, scenario: s };
  }, [selected, monthly, initial]);

  // Dimensions chart
  const W = 820;
  const H = 260;
  const PAD_L = 64;
  const PAD_R = 24;
  const PAD_T = 24;
  const PAD_B = 34;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xOf = (t: number) => PAD_L + (t / PROJECT_YEARS) * innerW;
  const yOf = (v: number) => PAD_T + (1 - v / chart.yMax) * innerH;

  const flatPath = chart.pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)},${yOf(p.flat).toFixed(1)}`)
    .join(" ");
  const signalPath = chart.pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)},${yOf(p.signal).toFixed(1)}`)
    .join(" ");
  const gapArea = `M${xOf(0)},${yOf(chart.pts[0].flat)} ${chart.pts
    .map((p) => `L${xOf(p.t).toFixed(1)},${yOf(p.signal).toFixed(1)}`)
    .join(" ")} ${chart.pts
    .slice()
    .reverse()
    .map((p) => `L${xOf(p.t).toFixed(1)},${yOf(p.flat).toFixed(1)}`)
    .join(" ")} Z`;

  // Graduations Y (4 lignes)
  const yTicks = Array.from({ length: 5 }).map((_, i) => (chart.yMax * i) / 4);
  // Graduations X — pas de 5 ans sur les 40 ans
  const xTicks: number[] = [];
  for (let t = 0; t <= PROJECT_YEARS; t += 5) xTicks.push(t);

  const lastPt = chart.pts[chart.pts.length - 1];
  const horizonPt = chart.pts[Math.min(years, PROJECT_YEARS)];

  return (
    <section className="calc" id="calc" data-reveal>
      <div className="wrap">
        <div className="section-label">
          <span className="num">II</span>
          <span>CALCULATEUR DE CAPITAL</span>
          <span className="line" />
        </div>

        <div className="section-head">
          <h2 className="section-title">
            Trois scénarios,
            <br />
            une même <em>discipline</em>.
          </h2>
          <p className="section-lede">
            Projection par capitalisation à intérêts composés. Trois rendements annuels, calibrés
            sur l&apos;historique du MSCI World dividendes réinvestis. Aucune prédiction, toutes
            plausibles.
          </p>
        </div>

        <div className="calc-panel">
          <div className="calc-controls">
            <div className="ctrl-card">
              <div className="control-label">
                <span className="k">Versement mensuel</span>
                <span className="v">
                  {fmtInt(monthly)}
                  <span className="u">€</span>
                </span>
              </div>
              <input
                type="range"
                className="slider"
                min={50}
                max={5000}
                step={50}
                value={monthly}
                onChange={(e) => setMonthly(+e.target.value)}
                style={{ "--pct": `${monthlyPct}%` } as CSSProperties}
              />
              <div className="slider-axis">
                <span>50 €</span>
                <span>5 000 €</span>
              </div>
            </div>

            <div className="ctrl-card">
              <div className="control-label">
                <span className="k">Capital initial</span>
                <span className="v">
                  {initial === 0 ? "—" : fmtInt(initial)}
                  {initial > 0 && <span className="u">€</span>}
                </span>
              </div>
              <input
                type="range"
                className="slider"
                min={0}
                max={500000}
                step={1000}
                value={initial}
                onChange={(e) => setInitial(+e.target.value)}
                style={{ "--pct": `${initialPct}%` } as CSSProperties}
              />
              <div className="slider-axis">
                <span>0 €</span>
                <span>500 000 €</span>
              </div>
            </div>

            <div className="ctrl-card">
              <div className="control-label">
                <span className="k">Horizon</span>
                <span className="v">
                  {years}
                  <span className="u">ans</span>
                </span>
              </div>
              <input
                type="range"
                className="slider"
                min={1}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(+e.target.value)}
                style={{ "--pct": `${yearsPct}%` } as CSSProperties}
              />
              <div className="slider-axis">
                <span>1 an</span>
                <span>40 ans</span>
              </div>
            </div>

            <div className="calc-summary">
              <span className="k">Capital investi total</span>
              <span className="v">{fmtEUR(totalInvested)}</span>
              <span className="sub">
                {initial > 0 ? `${fmtEUR(initial)} initial + ` : ""}
                {years * 12} mensualités
              </span>
            </div>
          </div>

          <div className="scen-table">
            <div className="scen-head">
              <span>Scénario · cliquez pour projeter</span>
              <span className="num">DCA plat</span>
              <span className="num">Avec DCA Cockpit</span>
              <span className="num col-gain">Gain</span>
              <span className="col-bar">Comparaison</span>
            </div>
            {rows.map((s, i) => {
              const flatW = (s.flat / maxSignal) * 100;
              const signalW = (s.signal / maxSignal) * 100;
              const isSel = i === selected;
              return (
                <button
                  type="button"
                  key={s.r}
                  onClick={() => setSelected(i)}
                  className={`scen-row ${isSel ? "selected" : ""}`.trim()}
                  aria-pressed={isSel}
                >
                  <div className="s-name">
                    <span className="nm">{s.label}</span>
                    <span className="rate">{s.sub}</span>
                  </div>
                  <span className="s-flat">{fmtEUR(s.flat)}</span>
                  <span className="s-signal">{fmtEUR(s.signal)}</span>
                  <span className="s-gain-val">+ {fmtEUR(s.gain)}</span>
                  <div className="s-bar">
                    <span className="signal" style={{ width: `${signalW}%` }} />
                    <span className="flat" style={{ width: `${flatW}%` }} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="proj-chart">
            <div className="proj-head">
              <div>
                <div className="proj-k">
                  PROJECTION SUR {PROJECT_YEARS} ANS · SCÉNARIO {chart.scenario.label.toUpperCase()}
                </div>
                <div className="proj-t">
                  Sur {PROJECT_YEARS} ans, {fmtEUR(lastPt.flat)} deviennent{" "}
                  <strong>{fmtEUR(lastPt.signal)}</strong> avec DCA Cockpit. La puissance du temps,
                  au travail.
                </div>
              </div>
              <div className="proj-legend">
                <span>
                  <span className="dot flat" />
                  DCA plat
                </span>
                <span>
                  <span className="dot signal" />
                  Avec DCA Cockpit
                </span>
              </div>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="proj-svg">
              <defs>
                <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--copper)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--copper)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Y */}
              {yTicks.map((v) => (
                <g key={v}>
                  <line
                    x1={PAD_L}
                    x2={W - PAD_R}
                    y1={yOf(v)}
                    y2={yOf(v)}
                    stroke="var(--line-soft)"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD_L - 10}
                    y={yOf(v) + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--muted)"
                    fontFamily="var(--font-jetbrains-mono)"
                  >
                    {v === 0 ? "0" : fmtEUR(v).replace(/\s?€\s?/, " €")}
                  </text>
                </g>
              ))}

              {/* Grid X */}
              {xTicks.map((t) => (
                <g key={t}>
                  <line
                    x1={xOf(t)}
                    x2={xOf(t)}
                    y1={PAD_T}
                    y2={H - PAD_B}
                    stroke="var(--line-soft)"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={xOf(t)}
                    y={H - PAD_B + 16}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--muted)"
                    fontFamily="var(--font-jetbrains-mono)"
                  >
                    {t === 0 ? "0" : `${t} ans`}
                  </text>
                </g>
              ))}

              {/* Zone d'écart */}
              <path d={gapArea} fill="url(#gapGrad)" />

              {/* Courbe flat */}
              <path
                d={flatPath}
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray="4 3"
              />

              {/* Courbe signal */}
              <path
                d={signalPath}
                fill="none"
                stroke="var(--copper)"
                strokeWidth="2.2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Marqueur vertical horizon sélectionné */}
              {years < PROJECT_YEARS && (
                <g>
                  <line
                    x1={xOf(horizonPt.t)}
                    x2={xOf(horizonPt.t)}
                    y1={PAD_T}
                    y2={H - PAD_B}
                    stroke="var(--ink)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    opacity="0.35"
                  />
                  <text
                    x={xOf(horizonPt.t)}
                    y={PAD_T - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--ink)"
                    fontFamily="var(--font-jetbrains-mono)"
                    opacity="0.6"
                  >
                    VOTRE HORIZON · {years} ANS
                  </text>
                  <circle
                    cx={xOf(horizonPt.t)}
                    cy={yOf(horizonPt.signal)}
                    r="3"
                    fill="var(--copper)"
                    opacity="0.6"
                  />
                  <text
                    x={xOf(horizonPt.t) + 8}
                    y={yOf(horizonPt.signal) - 8}
                    textAnchor="start"
                    fontSize="11"
                    fontWeight="600"
                    fill="var(--copper)"
                    fontFamily="var(--font-geist)"
                    opacity="0.85"
                  >
                    {fmtEUR(horizonPt.signal)}
                  </text>
                </g>
              )}

              {/* Points finaux */}
              <circle cx={xOf(lastPt.t)} cy={yOf(lastPt.flat)} r="3.5" fill="var(--muted)" />
              <circle cx={xOf(lastPt.t)} cy={yOf(lastPt.signal)} r="4.5" fill="var(--copper)" />

              {/* Étiquettes valeur finale 40 ans */}
              <text
                x={xOf(lastPt.t) - 8}
                y={yOf(lastPt.signal) - 10}
                textAnchor="end"
                fontSize="13"
                fontWeight="700"
                fill="var(--copper)"
                fontFamily="var(--font-geist)"
              >
                {fmtEUR(lastPt.signal)}
              </text>
              <text
                x={xOf(lastPt.t) - 8}
                y={yOf(lastPt.flat) + 14}
                textAnchor="end"
                fontSize="11"
                fill="var(--muted)"
                fontFamily="var(--font-geist)"
              >
                {fmtEUR(lastPt.flat)}
              </text>
            </svg>
          </div>

          <div className="calc-tip">
            Les <em>dividendes</em>{" "}sont inclus dans les rendements. L&apos;inflation, non.
            Pour estimer ce que ça vaudra en euros d&apos;aujourd&apos;hui, retirez environ 2 %
            par an.
          </div>
        </div>
      </div>
    </section>
  );
}
