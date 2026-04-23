"use client";

const HISTORY = [0.9, 0.8, 1.0, 1.1, 1.3, 1.2, 0.9, 0.7, 0.8, 1.0, 1.2, 1.5];
const LABELS = ["Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.", "Jan.", "Fév.", "Mars", "Avr."];

const W = 1000;
const H = 240;
const PAD_X = 48;
const PAD_Y = 34;
const MIN_V = 0.5;
const MAX_V = 2.0;

function x(i: number, n: number) {
  return PAD_X + (i / (n - 1)) * (W - PAD_X * 2);
}
function y(v: number) {
  return PAD_Y + (1 - (v - MIN_V) / (MAX_V - MIN_V)) * (H - PAD_Y * 2);
}

export function HistorySection() {
  const min = Math.min(...HISTORY);
  const max = Math.max(...HISTORY);
  const current = HISTORY[HISTORY.length - 1];
  const median = 1.0;
  const barW = ((W - PAD_X * 2) / HISTORY.length) * 0.55;

  return (
    <section className="history" id="archive" data-reveal>
      <div className="wrap">
        <div className="section-label">
          <span className="num">IV</span>
          <span>ARCHIVES · DOUZE DERNIERS MOIS</span>
          <span className="line" />
        </div>

        <div className="section-head">
          <h2 className="section-title">
            Ni euphorie,
            <br />
            ni <em>panique.</em>
          </h2>
          <p className="section-lede">
            Le multiplicateur oscille autour de sa moyenne de long terme, 1,0×. Il accélère les
            versements dans les creux, les tempère dans les euphories. Rien de plus.
          </p>
        </div>

        <div className="spark-card">
          <div className="spark-stats">
            <div>
              <div className="sk">min</div>
              <div className="sv">{min.toFixed(1).replace(".", ",")}×</div>
            </div>
            <div>
              <div className="sk">max</div>
              <div className="sv">{max.toFixed(1).replace(".", ",")}×</div>
            </div>
            <div>
              <div className="sk">médiane</div>
              <div className="sv">1,0×</div>
            </div>
            <div>
              <div className="sk">courant</div>
              <div className="sv current">{current.toFixed(1).replace(".", ",")}×</div>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="spark-svg">
            {/* Grid lines */}
            {[0.5, 1.0, 1.5, 2.0].map((v) => (
              <g key={v}>
                <line
                  x1={PAD_X}
                  x2={W - PAD_X}
                  y1={y(v)}
                  y2={y(v)}
                  stroke="var(--line)"
                  strokeDasharray={v === 1.0 ? "0" : "2,3"}
                  strokeWidth={v === 1.0 ? 1 : 0.8}
                />
                <text
                  x={PAD_X - 10}
                  y={y(v) + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--muted)"
                  fontFamily="var(--font-jetbrains-mono)"
                >
                  {v.toFixed(1).replace(".", ",")}×
                </text>
              </g>
            ))}

            {/* Bars centered on 1.0× */}
            {HISTORY.map((v, i) => {
              const isUp = v >= median;
              const top = isUp ? y(v) : y(median);
              const height = Math.abs(y(v) - y(median));
              const isLast = i === HISTORY.length - 1;
              const fill = isLast
                ? "var(--copper)"
                : isUp
                ? "var(--ink)"
                : "var(--muted)";
              const opacity = isLast ? 1 : isUp ? 0.85 : 0.5;

              return (
                <g key={i}>
                  <rect
                    x={x(i, HISTORY.length) - barW / 2}
                    y={top}
                    width={barW}
                    height={Math.max(2, height)}
                    fill={fill}
                    opacity={opacity}
                    rx={1}
                  />
                  <text
                    x={x(i, HISTORY.length)}
                    y={H - 10}
                    textAnchor="middle"
                    fontSize="10.5"
                    fill="var(--muted)"
                    fontFamily="var(--font-geist)"
                  >
                    {LABELS[i]}
                  </text>
                  {isLast && (
                    <text
                      x={x(i, HISTORY.length)}
                      y={y(v) - 10}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="var(--copper)"
                      fontFamily="var(--font-jetbrains-mono)"
                    >
                      {v.toFixed(1).replace(".", ",")}×
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="spark-legend">
            <span>
              <span className="dot up" /> Au-dessus de la moyenne, accumulation renforcée.
            </span>
            <span>
              <span className="dot dn" /> En-dessous de la moyenne, contribution allégée.
            </span>
            <span>
              <span className="dot cur" /> Mois en cours.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
