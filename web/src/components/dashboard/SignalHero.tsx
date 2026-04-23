export function SignalHero() {
  return (
    <div className="signal-hero">
      <div className="signal-head">
        <span className="sig-live">EN DIRECT</span>
        <span>CYCLE N° 41</span>
      </div>

      <div className="signal-big">
        1,5<span className="x">×</span>
      </div>
      <p className="signal-verdict">
        Panique sur les marchés crypto, repli modéré des indices mondiaux. Contexte favorable à une
        pondération supérieure à la moyenne.
      </p>

      <div className="signal-action">
        <div>
          <div className="label">Versement recommandé ce mois</div>
          <div className="value">
            300 €<span className="from">versement habituel, 200 €</span>
          </div>
        </div>
        <div />
        <button type="button" className="btn">
          Confirmer le versement
        </button>
      </div>

      <div className="signal-factors">
        <div className="factor">
          <div className="factor-head">
            <span className="factor-k">Indice Fear & Greed</span>
            <span className="factor-v warn">25 / 100</span>
          </div>
          <div className="factor-bar v25" />
          <p className="factor-desc">
            Panique sur les marchés crypto. Les investisseurs vendent sous l&apos;effet de
            l&apos;émotion.
          </p>
        </div>
        <div className="factor">
          <div className="factor-head">
            <span className="factor-k">Drawdown MSCI World</span>
            <span className="factor-v ok">−8,2 %</span>
          </div>
          <div className="factor-bar v82" />
          <p className="factor-desc">
            Les actions mondiales reculent de 8,2 % par rapport au sommet du 12 février 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
