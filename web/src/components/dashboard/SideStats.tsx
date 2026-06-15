"use client";

import { useSignal } from "@/lib/signals";
import { useUserData } from "@/lib/user-context";
import { fmtInt } from "@/lib/dca-math";

function comma(n: number, digits = 1): string {
  return n.toFixed(digits).replace(".", ",");
}

export function SideStats() {
  const { latest } = useSignal();
  const { deposits, holdings } = useUserData();

  const verseCumul = deposits.reduce((s, d) => s + d.amount, 0);
  const count = deposits.length;
  const thisWeek = latest
    ? deposits
        .filter((d) => d.weekId === latest.weekId)
        .reduce((s, d) => s + d.amount, 0)
    : 0;

  const portfolioValue = holdings.reduce((s, h) => s + h.value, 0);
  const plusValue = portfolioValue - verseCumul;
  const plusPct = verseCumul > 0 ? (plusValue / verseCumul) * 100 : 0;
  const gain = plusValue >= 0;

  return (
    <div className="stack">
      <div className="stat-card warm">
        <div className="card-title">Capital versé, cumul</div>
        <div className="stat-big">
          {fmtInt(verseCumul)}
          <span className="u">€</span>
        </div>
        {thisWeek > 0 ? (
          <span className="delta">↑ +{fmtInt(thisWeek)} €, cette semaine</span>
        ) : (
          <span className="delta" style={{ color: "var(--muted)" }}>
            Aucun versement cette semaine
          </span>
        )}
        <p className="sub">
          {count > 0
            ? `${count} versement${count > 1 ? "s" : ""} enregistré${count > 1 ? "s" : ""} depuis votre inscription.`
            : "Aucun versement enregistré. Confirmez votre premier versement depuis le signal."}
        </p>
      </div>

      <div className="stat-card olive-card">
        <div className="card-title">Valeur du portefeuille</div>
        <div className="stat-big">
          {fmtInt(portfolioValue)}
          <span className="u warm">€</span>
        </div>
        {holdings.length > 0 && verseCumul > 0 ? (
          <span className="delta">
            {gain ? "+" : ""}
            {fmtInt(plusValue)} € ({gain ? "+" : ""}
            {comma(plusPct)} %) vs capital versé
          </span>
        ) : (
          <span className="delta" style={{ color: "var(--muted)" }}>
            En attente de données
          </span>
        )}
        <p className="sub">
          {holdings.length > 0
            ? "Somme des valeurs déclarées de vos supports. La plus-value compare cette valeur au capital effectivement versé."
            : "Déclarez vos supports plus bas pour suivre la valeur de votre portefeuille."}
        </p>
      </div>
    </div>
  );
}
