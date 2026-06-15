"use client";

import { useEffect, useState } from "react";

// Lecture publique du dernier signal via l'API REST Firestore (la collection
// `signals` est en lecture libre). Aucun SDK Firebase : la landing reste légère.

export type LiveSignal = {
  multiplier: number;
  fearGreed: number;
  msciDrawdown: number;
  verdict: string;
  week: number;
  year: number;
};

const PROJECT = "dca-cockpit-web";
const KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

type RestValue = {
  doubleValue?: number | string;
  integerValue?: number | string;
  stringValue?: string;
};

function num(v: RestValue | undefined): number {
  if (!v) return NaN;
  if (v.doubleValue !== undefined) return Number(v.doubleValue);
  if (v.integerValue !== undefined) return Number(v.integerValue);
  return NaN;
}

export function useLiveSignal(): LiveSignal | null {
  const [signal, setSignal] = useState<LiveSignal | null>(null);

  useEffect(() => {
    let cancelled = false;
    // orderBy=sortKey desc : le signal le plus récent est toujours en tête, même
    // quand la collection dépasse pageSize (sinon le list REST trie par __name__
    // croissant et renverrait les plus anciens).
    const url =
      `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/signals?pageSize=8&orderBy=sortKey%20desc` +
      (KEY ? `&key=${KEY}` : "");

    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled || !json || !Array.isArray(json.documents)) return;
        const docs = json.documents
          .map((d: { fields?: Record<string, RestValue> }) => d.fields ?? {})
          .map((f: Record<string, RestValue>) => ({
            sortKey: num(f.sortKey),
            multiplier: num(f.multiplier),
            fearGreed: num(f.fearGreed),
            msciDrawdown: num(f.msciDrawdown),
            verdict: f.verdict?.stringValue ?? "",
            week: num(f.week),
            year: num(f.year),
          }))
          .filter((s: { multiplier: number }) => Number.isFinite(s.multiplier))
          .sort(
            (a: { sortKey: number }, b: { sortKey: number }) =>
              b.sortKey - a.sortKey,
          );
        if (docs.length) {
          const s = docs[0];
          setSignal({
            multiplier: s.multiplier,
            fearGreed: s.fearGreed,
            msciDrawdown: s.msciDrawdown,
            verdict: s.verdict,
            week: s.week,
            year: s.year,
          });
        }
      })
      .catch(() => {
        /* la landing reste affichée avec ses valeurs par défaut */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return signal;
}
