export function Topbar() {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        Accueil <span style={{ margin: "0 10px", color: "var(--line)" }}>/</span>
        <strong>Signal du mois</strong>
      </div>
      <div className="top-actions">
        <div className="search">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          Rechercher
          <span className="kbd">⌘K</span>
        </div>
        <button type="button" className="icon-btn" title="Notifications">
          <svg viewBox="0 0 24 24">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </button>
        <button type="button" className="icon-btn" title="Thème">
          <svg viewBox="0 0 24 24">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
