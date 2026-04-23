const SIGNAL_HISTORY = [
  { month: "Avr 26", mult: "×1,6", tone: "up" as const },
  { month: "Mar 26", mult: "×1,2", tone: "up" as const },
  { month: "Fév 26", mult: "×1,0", tone: "neutral" as const },
  { month: "Jan 26", mult: "×0,8", tone: "down" as const },
  { month: "Déc 25", mult: "×0,6", tone: "down" as const },
  { month: "Nov 25", mult: "×1,0", tone: "neutral" as const },
  { month: "Oct 25", mult: "×1,4", tone: "up" as const },
  { month: "Sep 25", mult: "×1,8", tone: "up" as const },
];

export function TrustDataCard() {
  return (
    <div className="trust-card">
      <div className="trust-head">
        <h3>
          Pourquoi faire <em>confiance</em> au signal.
        </h3>
        <p>
          Pas de promesses, que de la donnée publique et une règle de calcul transparente. Le signal
          n&apos;est pas un conseil en investissement, c&apos;est une formule que vous pouvez auditer.
        </p>
      </div>

      <div className="trust-grid">
        {/* Backtest */}
        <div className="trust-panel">
          <div className="trust-kicker">Backtest 10 ans · MSCI World</div>
          <div className="trust-chart">
            <svg viewBox="0 0 280 110" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bt-a" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="currentColor" stopOpacity="0.22" />
                  <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* DCA fixe */}
              <path
                d="M10 90 L50 85 L90 82 L130 75 L170 68 L210 55 L250 42 L270 38"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="1.4"
                strokeDasharray="4 3"
              />
              {/* Multiplicateur DCA */}
              <path
                d="M10 95 L50 88 L90 80 L130 65 L170 50 L210 32 L250 18 L270 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "var(--copper)" }}
              />
              <path
                d="M10 95 L50 88 L90 80 L130 65 L170 50 L210 32 L250 18 L270 12 L270 110 L10 110 Z"
                fill="url(#bt-a)"
                style={{ color: "var(--copper)" }}
              />
            </svg>
          </div>
          <div className="trust-rows">
            <div>
              <span className="trust-label">DCA fixe 200 €/mois</span>
              <span className="trust-value">54 200 €</span>
            </div>
            <div>
              <span className="trust-label trust-label-accent">Multiplicateur DCA</span>
              <span className="trust-value trust-value-accent">67 400 €</span>
            </div>
            <div className="trust-delta">
              <span className="trust-label">Surperformance</span>
              <span className="trust-value trust-value-ok">+24,4%</span>
            </div>
          </div>
        </div>

        {/* Méthode */}
        <div className="trust-panel">
          <div className="trust-kicker">Méthode · formule publique</div>
          <div className="trust-formula">
            <div className="formula-line">
              <span className="formula-k">Entrée A</span>
              <span className="formula-v">Fear &amp; Greed crypto (Alternative.me)</span>
            </div>
            <div className="formula-line">
              <span className="formula-k">Entrée B</span>
              <span className="formula-v">Drawdown MSCI World 52 sem.</span>
            </div>
            <div className="formula-op">= signal mensuel ×0,6 à ×2,0</div>
            <div className="formula-note">
              Les deux sources sont publiques et consultables. Le calcul est déterministe, pas un
              modèle IA opaque.
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="trust-panel">
          <div className="trust-kicker">Historique · 8 derniers signaux</div>
          <div className="trust-history">
            {SIGNAL_HISTORY.map((s) => (
              <div key={s.month} className={`sig-row sig-${s.tone}`}>
                <span className="sig-month">{s.month}</span>
                <span className="sig-bar">
                  <span className="sig-bar-fill" />
                </span>
                <span className="sig-mult">{s.mult}</span>
              </div>
            ))}
          </div>
          <div className="trust-note">
            Chaque signal passé est archivé, auditable, et ne change jamais rétroactivement.
          </div>
        </div>
      </div>
    </div>
  );
}
