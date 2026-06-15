"use client";

import { useAnimatedNumber } from "@/lib/landing-hooks";
import { useLiveSignal } from "@/lib/live-signal";

function comma(n: number, digits = 1): string {
  return n.toFixed(digits).replace(".", ",");
}

function shortVerdict(mult: number): string {
  if (mult >= 1.15) return "Accumulation renforcée recommandée";
  if (mult <= 0.9) return "Allègement conseillé";
  return "Pondération neutre";
}

export function SignalCard() {
  const live = useLiveSignal();
  const target = live ? live.multiplier : 1.0;
  const mult = useAnimatedNumber(target, 1500, 1);
  const pct = ((mult - 0.5) / 1.5) * 100;
  const display = mult.toFixed(1).replace(".", ",");

  return (
    <div className="signal-card" data-reveal>
      <div className="signal-head">
        <span className="live">EN DIRECT</span>
        <span>
          {live ? `SEMAINE ${live.week} · ${live.year}` : "SIGNAL HEBDO"}
        </span>
      </div>

      <div className="signal-big">
        {display}
        <span className="x">×</span>
      </div>
      <span className="signal-verdict">{shortVerdict(mult)}</span>

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
          <span className="v">
            {live ? `${Math.round(live.fearGreed)} / 100` : "— / 100"}
          </span>
        </div>
        <div className="row">
          <span className="k">DRAWDOWN MSCI</span>
          <span className="v">
            {live ? `${comma(live.msciDrawdown * 100)} %` : "— %"}
          </span>
        </div>
        <div className="row">
          <span className="k">SOURCES</span>
          <span className="v">F&amp;G · MSCI WORLD</span>
        </div>
        <div className="row">
          <span className="k">MAJ</span>
          <span className="v">DIMANCHE 20:00</span>
        </div>
      </div>

      <div className="signal-foot">SOURCES · ALTERNATIVE.ME · YAHOO FINANCE · NASDAQ</div>
    </div>
  );
}
