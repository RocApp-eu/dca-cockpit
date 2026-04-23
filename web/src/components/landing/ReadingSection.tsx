export function ReadingSection() {
  // Fear & Greed à 25/100 → cursor à 25% (bande "Peur")
  const fgPct = 25;
  // Drawdown MSCI à -8,2% sur échelle 0 à -40% → 20,5% de l'échelle
  const ddSeries = [
    -2, -3, -5, -4, -3, -5, -7, -6, -8, -10, -9, -7,
    -6, -4, -3, -5, -7, -9, -11, -10, -9, -8, -8.5, -8.2,
  ];
  const ddMin = -14;
  const ddMax = 0;
  const w = 320;
  const h = 70;
  const step = w / (ddSeries.length - 1);
  const yOf = (v: number) => h - ((v - ddMin) / (ddMax - ddMin)) * h;
  const pathD = ddSeries
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${yOf(v).toFixed(1)}`)
    .join(" ");
  const areaD = `${pathD} L${w},${h} L0,${h} Z`;

  return (
    <section className="reading" id="method" data-reveal>
      <div className="wrap">
        <div className="section-label">
          <span className="num">I</span>
          <span>LECTURE DU MARCHÉ</span>
          <span className="line" />
        </div>

        <div className="section-head">
          <h2 className="section-title">
            Deux indicateurs,
            <br />
            un <em>multiplicateur</em>.
          </h2>
          <p className="section-lede">
            Le signal ne prétend pas anticiper le marché. Il traduit, en un coefficient, ce que
            deux chiffres publics indiquent aujourd&apos;hui, l&apos;humeur des investisseurs
            crypto, et la distance des actions mondiales à leur dernier sommet.
          </p>
        </div>

        <div className="pedago-cards">
          <div className="p-card">
            <div className="card-head">
              <span>FEAR &amp; GREED · ALTERNATIVE.ME</span>
              <span className="card-idx">i.</span>
            </div>
            <div className="card-num">
              25<span className="unit">/100</span>
            </div>
            <div className="card-label">Panique sur les marchés crypto.</div>
            <p className="card-body">
              L&apos;indice mesure l&apos;émotion du marché entre 0 (panique) et 100 (euphorie).
              Les creux historiques ont souvent correspondu à des points d&apos;entrée favorables
              pour un investisseur de long terme.
            </p>

            <div className="ind-bands">
              <div className="ind-band b1">
                <span className="ind-cursor" style={{ left: `${(fgPct / 20) * 100}%` }} />
              </div>
              <div className="ind-band b2" />
              <div className="ind-band b3" />
              <div className="ind-band b4" />
              <div className="ind-band b5" />
            </div>
            <div className="ind-bands-labels">
              <span>Peur ext.</span>
              <span>Peur</span>
              <span>Neutre</span>
              <span>Cupidité</span>
              <span>Euphorie</span>
            </div>

            <div className="card-foot">
              <span>0 · PANIQUE</span>
              <span>100 · EUPHORIE</span>
            </div>
          </div>

          <div className="p-card">
            <div className="card-head">
              <span>DRAWDOWN MSCI WORLD · 24 MOIS</span>
              <span className="card-idx">ii.</span>
            </div>
            <div className="card-num">
              −8,2<span className="unit">%</span>
            </div>
            <div className="card-label">Repli par rapport au dernier sommet.</div>
            <p className="card-body">
              Le drawdown mesure l&apos;écart, en pourcentage, entre le cours actuel et le plus
              haut observé sur deux ans. Plus l&apos;écart est négatif, plus les prix sont
              reculés, et plus le multiplicateur augmente.
            </p>

            <svg className="dd-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--copper)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--copper)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1={yOf(0)} x2={w} y2={yOf(0)} stroke="var(--line)" strokeWidth="1" strokeDasharray="2 2" />
              <path d={areaD} fill="url(#ddGrad)" />
              <path d={pathD} fill="none" stroke="var(--copper)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={w} cy={yOf(ddSeries[ddSeries.length - 1])} r="3" fill="var(--copper)" />
            </svg>

            <div className="card-foot">
              <span>0 %</span>
              <span>−14 %</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
