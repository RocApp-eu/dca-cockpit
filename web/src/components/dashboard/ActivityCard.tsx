const ROWS = [
  {
    date: "05 AVR 2026",
    ev: "Versement, signal supérieur à la moyenne",
    mul: "1,5 ×",
    amt: "300 €",
  },
  {
    date: "05 MAR 2026",
    ev: "Versement, signal neutre",
    mul: "1,0 ×",
    amt: "200 €",
  },
  {
    date: "05 FÉV 2026",
    ev: "Versement, signal inférieur à la moyenne",
    mul: "0,8 ×",
    amt: "160 €",
  },
  {
    date: "05 JAN 2026",
    ev: "Versement, signal de marché euphorique",
    mul: "0,5 ×",
    amt: "100 €",
  },
  {
    date: "05 DÉC 2025",
    ev: "Versement, signal légèrement accru",
    mul: "1,2 ×",
    amt: "240 €",
  },
];

export function ActivityCard() {
  return (
    <div className="card activity">
      <div className="card-head">
        <span className="card-title">Derniers versements enregistrés</span>
        <a href="#" className="link-soft">
          Historique complet →
        </a>
      </div>
      {ROWS.map((r) => (
        <div className="row" key={r.date}>
          <span className="d">{r.date}</span>
          <span className="ev">{r.ev}</span>
          <span className="mul">{r.mul}</span>
          <span className="amt">{r.amt}</span>
        </div>
      ))}
    </div>
  );
}
