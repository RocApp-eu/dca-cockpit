export function SideStats() {
  return (
    <div className="stack">
      <div className="stat-card warm">
        <div className="card-title">Capital versé, cumul</div>
        <div className="stat-big">
          8 450<span className="u">€</span>
        </div>
        <span className="delta">↑ +300 €, ce mois</span>
        <p className="sub">34 versements mensuels enregistrés depuis juin 2023.</p>
      </div>
      <div className="stat-card olive-card">
        <div className="card-title">Performance vs DCA à montant fixe</div>
        <div className="stat-big">
          + 12,4<span className="u warm">%</span>
        </div>
        <span className="delta">+ 1 048 € de surperformance</span>
        <p className="sub">
          Effet de la pondération, renforcée lors des creux, allégée lors des sommets.
        </p>
      </div>
    </div>
  );
}
