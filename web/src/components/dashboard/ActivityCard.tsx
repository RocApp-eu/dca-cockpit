"use client";

import { useUserData } from "@/lib/user-context";
import { fmtInt } from "@/lib/dca-math";

function fmtDate(ms: number): string {
  if (!ms) return "—";
  return new Date(ms)
    .toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase()
    .replace(".", "");
}

export function ActivityCard() {
  const { deposits } = useUserData();
  const rows = deposits.slice(0, 6);

  return (
    <div className="card activity">
      <div className="card-head">
        <span className="card-title">Derniers versements enregistrés</span>
        <a href="/dashboard/versements" className="link-soft">
          Historique complet →
        </a>
      </div>
      {rows.length === 0 ? (
        <p className="sub" style={{ padding: "8px 0" }}>
          Aucun versement enregistré pour le moment. Confirmez votre versement
          de la semaine depuis le signal en haut de page.
        </p>
      ) : (
        rows.map((r) => (
          <div className="row" key={r.id}>
            <span className="d">{fmtDate(r.createdAt)}</span>
            <span className="ev">{r.note || "Versement"}</span>
            <span className="mul">{r.multiplier.toFixed(1).replace(".", ",")} ×</span>
            <span className="amt">{fmtInt(r.amount)} €</span>
          </div>
        ))
      )}
    </div>
  );
}
