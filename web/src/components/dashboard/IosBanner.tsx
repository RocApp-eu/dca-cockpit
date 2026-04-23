export function IosBanner() {
  return (
    <div className="ios-banner">
      <div className="ios-icon">
        <svg viewBox="0 0 24 24">
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
          Application iOS native, notification matinale dès publication du multiplicateur, widget
          écran d&apos;accueil, lecture hors ligne.
        </p>
      </div>
      <a href="#" className="btn">
        Télécharger DCA Cockpit →
      </a>
    </div>
  );
}
