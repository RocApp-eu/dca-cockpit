export function CapitalChart() {
  return (
    <div className="chart-card">
      <div className="chart-head">
        <h3 className="chart-title">
          Capital, versement cumulé, <em>intérêts composés</em>.
        </h3>
        <div className="chart-legend">
          <span className="s1">Capital</span>
          <span className="s2">Versé cumulé</span>
        </div>
      </div>
      <div className="chart">
        <svg viewBox="0 0 900 260" preserveAspectRatio="none">
          <defs>
            <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#E07E47" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#E07E47" stopOpacity="0" />
            </linearGradient>
            <pattern id="grid" width="90" height="52" patternUnits="userSpaceOnUse">
              <path d="M 90 0 L 0 0 0 52" fill="none" stroke="#2B2B28" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="900" height="260" fill="url(#grid)" />

          {/* versé cumulé (muted en tirets) */}
          <path
            d="M0,225 L50,221 L100,217 L150,212 L200,205 L250,197 L300,188 L350,178 L400,166 L450,152 L500,138 L550,121 L600,103 L650,86 L700,68 L750,52 L800,36 L850,24 L900,16"
            fill="none"
            stroke="#8A8883"
            strokeWidth="1.4"
            strokeDasharray="3 4"
          />

          {/* capital (copper) */}
          <path
            d="M0,235 L50,231 L100,224 L150,212 L200,198 L250,189 L300,168 L350,156 L400,130 L450,116 L500,88 L550,72 L600,48 L650,42 L700,24 L750,18 L800,12 L850,8 L900,6"
            fill="none"
            stroke="#E07E47"
            strokeWidth="2.2"
          />
          <path
            d="M0,235 L50,231 L100,224 L150,212 L200,198 L250,189 L300,168 L350,156 L400,130 L450,116 L500,88 L550,72 L600,48 L650,42 L700,24 L750,18 L800,12 L850,8 L900,6 L900,260 L0,260 Z"
            fill="url(#area)"
          />

          {/* marqueur de fin */}
          <circle cx="900" cy="6" r="4" fill="#E07E47" />
          <circle cx="900" cy="6" r="9" fill="#E07E47" fillOpacity="0.24" />
        </svg>
        <div className="chart-tooltip">
          <div className="d">FÉVRIER 2025</div>
          <div className="a">Capital · 6 840 €</div>
          <div className="b">Versé · 5 400 €</div>
        </div>
      </div>
      <div className="chart-axis">
        <span>MAI 2023</span>
        <span>NOV 2023</span>
        <span>MAI 2024</span>
        <span>NOV 2024</span>
        <span>MAI 2025</span>
        <span>NOV 2025</span>
        <span>AVR 2026</span>
      </div>
    </div>
  );
}
