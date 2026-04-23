import Link from "next/link";
import { LogoMark } from "./LogoMark";

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
};

function NavItem({ href, label, icon, active, badge }: NavItemProps) {
  return (
    <Link href={href} className={`nav-item ${active ? "active" : ""}`.trim()}>
      {icon}
      {label}
      {badge && <span className="badge">{badge}</span>}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link href="/" className="logo">
        <LogoMark />
        DCA Cockpit
      </Link>

      <div className="nav-group">
        <div className="nav-label">Mensuel</div>
        <NavItem
          href="/dashboard"
          label="Signal du mois"
          active
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v9l5 3" />
            </svg>
          }
        />
        <NavItem
          href="/dashboard/projection"
          label="Projection"
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M3 3v18h18" />
              <path d="M7 14l4-4 4 3 5-6" />
            </svg>
          }
        />
        <NavItem
          href="/dashboard/versements"
          label="Mes versements"
          icon={
            <svg viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
              <path d="M8 15h4" />
            </svg>
          }
        />
        <NavItem
          href="/dashboard/historique"
          label="Historique du signal"
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 1 1-9-9" />
              <path d="M21 3v6h-6" />
            </svg>
          }
        />

        <div className="nav-label">Portefeuille</div>
        <NavItem
          href="/dashboard/supports"
          label="Mes supports"
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M3 7h18M3 12h18M3 17h18" />
              <circle cx="6" cy="7" r="1.2" fill="currentColor" />
              <circle cx="6" cy="12" r="1.2" fill="currentColor" />
              <circle cx="6" cy="17" r="1.2" fill="currentColor" />
            </svg>
          }
        />
        <NavItem
          href="/dashboard/diagnostic"
          label="Diagnostic IA"
          badge="IA"
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M12 2L3 7v6c0 5 4 9 9 9s9-4 9-9V7l-9-5z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          }
        />
        <NavItem
          href="/dashboard/diversification"
          label="Diversification"
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />

        <div className="nav-label">Apprendre</div>
        <NavItem
          href="/methode"
          label="Méthode DCA"
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M4 19.5V5a2 2 0 0 1 2-2h14v18H6a2 2 0 0 0-2 2" />
              <path d="M20 3v18" />
            </svg>
          }
        />
        <NavItem
          href="/fear-and-greed"
          label="Fear & Greed"
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 9h.01M15 9h.01M9 15c1 1 5 1 6 0" />
            </svg>
          }
        />
        <NavItem
          href="/msci-world"
          label="MSCI World"
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>
          }
        />

        <div className="nav-label">Réglages</div>
        <NavItem
          href="/dashboard/parametres"
          label="Paramètres"
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
            </svg>
          }
        />
      </div>

      <div className="sidebar-foot">
        <Link href="/dashboard/premium" className="upgrade-chip">
          <div className="upgrade-k">Débloquer le signal complet</div>
          <div className="upgrade-v">
            Multi-portefeuilles, alertes push et export fiscal. <strong>À partir de 1,99 €/mois</strong>
            <span className="upgrade-early">Offre early adopters</span>
          </div>
        </Link>
        <button type="button" className="user-chip">
          <div className="user-avatar">HR</div>
          <div>
            <div className="u-name">Hubert Rochereau</div>
            <div className="u-plan">Plan gratuit</div>
          </div>
        </button>
      </div>
    </aside>
  );
}
