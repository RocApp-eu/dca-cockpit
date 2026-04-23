export function AiDiagnosis() {
  return (
    <div className="ai-card">
      <div className="ai-head">
        <div className="ai-title">
          <h3>
            Votre allocation, <em>relue</em>.
          </h3>
          <span className="ai-badge">Claude · Haiku</span>
        </div>
        <span className="ai-meta">Mise à jour mensuelle · Dernière analyse, 15.04.2026</span>
      </div>

      <p className="ai-intro">
        Votre portefeuille actuel concentre <strong>84 %</strong> de votre exposition actions sur
        les États-Unis, principalement via la superposition de trois ETF répliquant le MSCI World.
        Deux pistes méritent d&apos;être examinées.
      </p>

      <div className="ai-findings">
        <div className="finding">
          <span className="finding-k">Observation · 01</span>
          <div className="finding-v">
            Redondance détectée, <em>trois ETF MSCI World</em>, 92 % de lignes communes.
          </div>
          <p className="finding-desc">
            Amundi CW8, iShares SWDA et Lyxor WLD capitalisent tous les mêmes 1 500 valeurs. La
            diversification apparente ne réduit pas le risque de concentration.
          </p>
        </div>
        <div className="finding">
          <span className="finding-k">Observation · 02</span>
          <div className="finding-v">
            Concentration US, <span className="neg">68 %</span>, supérieure à une allocation
            équilibrée.
          </div>
          <p className="finding-desc">
            Une bascule partielle vers un MSCI All Country World ou l&apos;ajout d&apos;un ETF
            Marchés Émergents ramènerait la part US autour de 54 %, à risque global maîtrisé.
          </p>
        </div>
      </div>

      <div className="ai-cta">
        <p>
          Ces pistes sont informatives. Elles ne constituent pas un conseil en investissement.
        </p>
        <a href="#">Voir l&apos;analyse détaillée →</a>
      </div>
    </div>
  );
}
