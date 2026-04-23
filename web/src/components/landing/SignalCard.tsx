"use client";

import { useAnimatedNumber } from "@/lib/landing-hooks";

const TARGET_MULT = 1.5;

export function SignalCard() {
  const mult = useAnimatedNumber(TARGET_MULT, 1500, 2);
  const pct = ((mult - 0.5) / 1.5) * 100;
  const display = mult.toFixed(1).replace(".", ",");

  return (
    <div className="signal-card" data-reveal>
      <div className="signal-head">
        <span className="live">EN DIRECT</span>
        <span>22 · 04 · 2026</span>
      </div>

      <div className="signal-big">
        {display}
        <span className="x">×</span>
      </div>
      <span className="signal-verdict">Accumulation modérée recommandée</span>

      <div className="mtrack">
        <div className="mtrack-ruler">
          {Array.from({ length: 31 }).map((_, i) => (
            <span key={i} className={`mtrack-tick ${i % 10 === 0 ? "is-major" : ""}`} />
          ))}
        </div>
        <div className="mtrack-fill" style={{ width: `${pct}%` }} />
        <div className="mtrack-cursor" style={{ left: `${pct}%` }} />
        <div className="mtrack-lbls">
          <span>0,5×</span>
          <span>1,0×</span>
          <span>1,5×</span>
          <span>2,0×</span>
        </div>
      </div>

      <div className="signal-breakdown">
        <div className="row">
          <span className="k">FEAR &amp; GREED</span>
          <span className="v">25 / 100</span>
        </div>
        <div className="row">
          <span className="k">DRAWDOWN MSCI</span>
          <span className="v">−8,2 %</span>
        </div>
        <div className="row">
          <span className="k">BTC</span>
          <span className="v">58 210 €</span>
        </div>
        <div className="row">
          <span className="k">MAJ</span>
          <span className="v">06:12 GMT</span>
        </div>
      </div>

      <div className="signal-foot">SOURCES · ALTERNATIVE.ME · YAHOO FINANCE · COINGECKO</div>
    </div>
  );
}
