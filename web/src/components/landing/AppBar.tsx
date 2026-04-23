export function AppBar() {
  return (
    <section className="app-bar-section">
      <div className="wrap">
        <div className="app-bar">
          <div className="app-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="6" y="2" width="12" height="20" rx="2.5" />
              <circle cx="12" cy="18" r="1" fill="currentColor" />
              <line x1="9" y1="5" x2="15" y2="5" />
            </svg>
          </div>
          <div>
            <h3>
              <em>DCA Cockpit</em> sur iPhone, le signal au réveil.
            </h3>
            <p>
              Application iOS native, notifications matinales dès publication du signal, widget
              écran d&apos;accueil, lecture hors ligne. Version Premium pour multi-portefeuilles,
              alertes, backtest et export fiscal.
            </p>
          </div>
          <a href="#" className="btn ghost">
            Télécharger DCA Cockpit →
          </a>
        </div>
      </div>
    </section>
  );
}
