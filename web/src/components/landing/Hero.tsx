import Link from "next/link";
import { SignalCard } from "./SignalCard";

export function Hero() {
  return (
    <section className="hero wrap" data-reveal>
      <div className="hero-grid">
        <div>
          <div className="hero-eyebrow">
            Édition du 22 avril 2026 · 41
            <sup style={{ fontFeatureSettings: "'sups'" }}>e</sup> signal
          </div>
          <h1 className="display">
            Sachez quand<br />
            et combien<br />
            <em>investir</em> chaque mois.
          </h1>
          <p className="hero-sub">
            Chaque matin, un multiplicateur compris entre 0,5× et 2,0× vous indique la pondération à
            appliquer à votre versement habituel, calibré sur deux indicateurs de marché. Méthode
            transparente, données publiques, horizon long terme.
          </p>
          <div className="hero-cta">
            <Link href="/dashboard" className="btn copper">
              Créer mon compte
            </Link>
            <a href="#calc" className="btn ghost">
              Calculer mon capital
            </a>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="num">2 874</span>
              <span className="lbl">Comptes actifs</span>
            </div>
            <div className="hero-meta-item">
              <span className="num">41 mois</span>
              <span className="lbl">Profondeur d&apos;historique</span>
            </div>
            <div className="hero-meta-item">
              <span className="num">+12,4 %</span>
              <span className="lbl">Vs DCA à montant fixe</span>
            </div>
          </div>
        </div>
        <SignalCard />
      </div>
    </section>
  );
}
