export function HowSection() {
  return (
    <section className="how" data-reveal>
      <div className="wrap">
        <div className="section-label">
          <span className="num">III</span>
          <span>LA MÉTHODE</span>
          <span className="line" />
        </div>

        <div className="section-head">
          <h2 className="section-title">
            Un calcul,
            <br />
            en <em>trois temps</em>.
          </h2>
          <p className="section-lede">
            Aucune boîte noire. Le multiplicateur se dérive de deux mesures, par une règle pondérée
            et bornée. Publique, reproductible, auditable.
          </p>
        </div>

        <div className="how-panel">
          <div className="steps">
            <div className="step">
              <span className="roman">I.</span>
              <div className="step-n">LECTURE DU SENTIMENT</div>
              <h3>L&apos;indice Fear &amp; Greed ramené sur [0,5×, 2,0×].</h3>
              <p>
                Un indice à 0 correspond à 2,0×. Un indice à 100 correspond à 0,5×. La fonction
                est linéaire, sans seuil discrétionnaire.
              </p>
            </div>
            <div className="step">
              <span className="roman">II.</span>
              <div className="step-n">LECTURE DE LA VALORISATION</div>
              <h3>Le drawdown du MSCI World subit la même transformation.</h3>
              <p>
                Un drawdown supérieur à 35 % sature à 2,0×. Un marché au plus haut sature à 0,5×.
                Le plafond évite la sur-exposition émotionnelle.
              </p>
            </div>
            <div className="step">
              <span className="roman">III.</span>
              <div className="step-n">PONDÉRATION</div>
              <h3>Deux coefficients pondérés, 60 % F&amp;G, 40 % MSCI.</h3>
              <p>
                Le résultat est arrondi au dixième supérieur, puis affiché. La pondération reflète
                la sensibilité empirique de chaque signal.
              </p>
            </div>
          </div>

          <div className="formula-inline">
            Multiplicateur <span className="op">=</span> clamp( 0,60 <span className="op">·</span>{" "}
            f(F&amp;G) + 0,40 <span className="op">·</span> g(Drawdown) , 0,5× , 2,0× )
          </div>
        </div>
      </div>
    </section>
  );
}
