type Broker = {
  name: string;
  tag: string;
  pitch: string;
  cta: string;
  href: string;
  accent: "copper" | "ok";
};

const BROKERS: Broker[] = [
  {
    name: "Trade Republic",
    tag: "PEA · ETF · 0 €/ordre",
    pitch: "Ouvrez un PEA dédié à votre poche ETF pour défiscaliser vos gains après 5 ans. Plan d'épargne automatisé dès 1 €, zéro frais de courtage.",
    cta: "Ouvrir un PEA",
    href: "#",
    accent: "copper",
  },
  {
    name: "Bitpanda",
    tag: "Crypto · Régulé UE · MiCA",
    pitch: "Isolez votre crypto dans un compte régulé UE, séparé de votre broker ETF. Reporting fiscal français intégré, achat programmé BTC, ETH et indices.",
    cta: "Ouvrir un compte crypto",
    href: "#",
    accent: "ok",
  },
  {
    name: "Shares",
    tag: "Actions · Social · 0 €",
    pitch: "Complétez votre DCA ETF avec des convictions fortes sur actions individuelles (LVMH, Apple, NVIDIA). Fractions dès 1 €, commissions 0 €.",
    cta: "Tester Shares",
    href: "#",
    accent: "copper",
  },
];

export function AffiliateCard() {
  return (
    <div className="affiliate-card">
      <div className="affiliate-head">
        <div>
          <h3>
            Passer à <em>l&apos;action</em>.
          </h3>
          <p>
            Vous avez déjà un broker ? Ces trois-là sont choisis pour compléter votre setup, pas le
            remplacer : diversification fiscale, séparation crypto / ETF, convictions sur actions
            individuelles.
          </p>
        </div>
        <span className="aff-note">Partenariats rémunérés, sélection éditoriale.</span>
      </div>
      <div className="affiliate-grid">
        {BROKERS.map((b) => (
          <a key={b.name} href={b.href} className={`aff-item aff-${b.accent}`}>
            <div className="aff-item-top">
              <span className="aff-name">{b.name}</span>
              <span className="aff-tag">{b.tag}</span>
            </div>
            <p className="aff-pitch">{b.pitch}</p>
            <span className="aff-cta">{b.cta} →</span>
          </a>
        ))}
      </div>
    </div>
  );
}
