import Link from "next/link";

export function SiteFooter() {
  return (
    <>
      <footer>
        <div className="col brand">
          <Link href="/" className="logo">
            <span className="logo-mark">
              <svg>
                <use href="#mark" />
              </svg>
            </span>
            DCA Cockpit
          </Link>
          <p>
            Un signal mensuel d&apos;investissement en DCA, fondé sur des indicateurs de marché
            publics. Édité par Hubert Rochereau, Paris.
          </p>
        </div>
        <div className="col">
          <h4>Produit</h4>
          <a href="#">Signal du jour</a>
          <a href="#calc">Calculateur</a>
          <Link href="/dashboard">Tableau de bord</Link>
          <a href="#">Application iOS</a>
        </div>
        <div className="col">
          <h4>Apprendre</h4>
          <a href="#">Méthode DCA</a>
          <a href="#">Indice Fear &amp; Greed</a>
          <a href="#">MSCI World</a>
          <a href="#">Intérêts composés</a>
        </div>
        <div className="col">
          <h4>Société</h4>
          <a href="#">Qui édite ce site</a>
          <a href="#">Mentions légales</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Contact</a>
        </div>
      </footer>
      <div className="disclaimer">
        Les contenus publiés sur DCA Cockpit sont à caractère informatif et pédagogique. Ils ne
        constituent ni un conseil en investissement, ni une recommandation personnalisée. Tout
        investissement comporte un risque de perte en capital. Les performances passées ne préjugent
        pas des performances futures.
      </div>
    </>
  );
}
