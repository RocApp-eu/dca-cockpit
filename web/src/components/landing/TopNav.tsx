import Link from "next/link";

export function TopNav() {
  return (
    <nav className="top">
      <Link href="/" className="logo">
        <span className="logo-mark">
          <svg>
            <use href="#mark" />
          </svg>
        </span>
        DCA Cockpit
      </Link>
      <div className="links">
        <a href="#calc">Calculateur</a>
        <a href="#method">Méthode</a>
        <a href="#archive">Archives</a>
        <Link href="/dashboard" className="nav-cta">
          Tableau de bord →
        </Link>
        <Link href="/dashboard" className="btn">
          Accéder
        </Link>
      </div>
    </nav>
  );
}
