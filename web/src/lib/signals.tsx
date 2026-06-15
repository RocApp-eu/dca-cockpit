"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

/* ── TYPES ─────────────────────────────────────── */

export type SignalTrend = "up" | "down" | "flat";

export type SignalDoc = {
  weekId: string; // "2026-W17"
  year: number;
  week: number; // numéro de semaine ISO
  sortKey: number; // year*100 + week, pour le tri
  multiplier: number; // valeur lissée publiée
  rawMultiplier: number;
  previousMultiplier: number | null;
  fearGreed: number; // 0 à 100
  msciDrawdown: number; // ex: -0.082
  verdict: string;
  avgMonth: number | null; // moyenne du mois courant
  trend: SignalTrend;
  deltaPrev: number | null; // variation vs semaine précédente
  publishedAtLabel: string; // ex: "DIMANCHE 19/04 · 20:00"
};

function parseSignal(id: string, data: Record<string, unknown>): SignalDoc {
  const trend = data.trend;
  return {
    weekId: typeof data.weekId === "string" ? data.weekId : id,
    year: Number(data.year ?? 0),
    week: Number(data.week ?? 0),
    sortKey: Number(data.sortKey ?? 0),
    multiplier: Number(data.multiplier ?? 1),
    rawMultiplier: Number(data.rawMultiplier ?? data.multiplier ?? 1),
    previousMultiplier:
      data.previousMultiplier == null ? null : Number(data.previousMultiplier),
    fearGreed: Number(data.fearGreed ?? 50),
    msciDrawdown: Number(data.msciDrawdown ?? 0),
    verdict: typeof data.verdict === "string" ? data.verdict : "",
    avgMonth: data.avgMonth == null ? null : Number(data.avgMonth),
    trend: trend === "up" || trend === "down" ? trend : "flat",
    deltaPrev: data.deltaPrev == null ? null : Number(data.deltaPrev),
    publishedAtLabel:
      typeof data.publishedAtLabel === "string" ? data.publishedAtLabel : "",
  };
}

/* ── CONTEXT ───────────────────────────────────── */

type SignalContextValue = {
  latest: SignalDoc | null;
  history: SignalDoc[]; // du plus récent au plus ancien, latest inclus
  loading: boolean;
};

const SignalContext = createContext<SignalContextValue | undefined>(undefined);

const HISTORY_LENGTH = 8;

export function SignalProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<SignalDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const col = collection(db, "signals");
    const q = query(col, orderBy("sortKey", "desc"), limit(HISTORY_LENGTH));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setHistory(snap.docs.map((d) => parseSignal(d.id, d.data())));
        setLoading(false);
      },
      (err) => {
        console.error("subscribe signals a échoué", err);
        setHistory([]);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  const value: SignalContextValue = {
    latest: history[0] ?? null,
    history,
    loading,
  };

  return (
    <SignalContext.Provider value={value}>{children}</SignalContext.Provider>
  );
}

export function useSignal(): SignalContextValue {
  const ctx = useContext(SignalContext);
  if (!ctx) {
    throw new Error("useSignal doit être utilisé dans <SignalProvider>");
  }
  return ctx;
}
