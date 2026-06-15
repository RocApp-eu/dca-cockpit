"use client";

import { useSignal } from "@/lib/signals";
import { SectionRuler } from "./SectionRuler";

export function LectureHeader() {
  const { latest } = useSignal();

  const subtitle = latest
    ? `SEMAINE ${latest.week} · ${latest.year}`
    : "EN ATTENTE";

  const mult = latest?.multiplier ?? 1;
  const headline =
    !latest
      ? "Votre premier signal arrive bientôt."
      : mult >= 1.15
        ? "Cette semaine, investissez davantage."
        : mult <= 0.9
          ? "Cette semaine, allégez la cadence."
          : "Cette semaine, maintenez le cap.";

  const meta = latest
    ? `SIGNAL ACTIF · ${latest.publishedAtLabel || "MAJ DIMANCHE · 20:00"}`
    : "EN ATTENTE DE PUBLICATION";

  return (
    <>
      <SectionRuler num="I" title="LECTURE HEBDOMADAIRE" subtitle={subtitle} />
      <div className="page-title">
        <h1>
          {headline.split(", ").length > 1 ? (
            <>
              {headline.split(", ")[0]},{" "}
              <em>{headline.split(", ").slice(1).join(", ")}</em>
            </>
          ) : (
            headline
          )}
        </h1>
        <div className="page-meta">
          <span className="dot" />
          {meta}
        </div>
      </div>
    </>
  );
}
