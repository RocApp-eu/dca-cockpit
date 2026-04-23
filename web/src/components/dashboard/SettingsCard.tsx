const ROWS = [
  { k: "Montant habituel", v: "200 €" },
  { k: "Fréquence", v: "Mensuelle, 5 du mois" },
  { k: "Allocation cible", v: "70 % ETF · 30 % crypto" },
  { k: "Courtier principal", v: "Trade Republic" },
  { k: "Plafond du multiplicateur", v: "2,0 ×" },
];

export function SettingsCard() {
  return (
    <div className="card">
      <div className="card-head">
        <span className="card-title">Paramètres DCA</span>
        <a href="#" className="link-soft">
          Modifier →
        </a>
      </div>
      {ROWS.map((row) => (
        <div className="setting-row" key={row.k}>
          <span className="k">{row.k}</span>
          <span className="v">{row.v}</span>
        </div>
      ))}
    </div>
  );
}
