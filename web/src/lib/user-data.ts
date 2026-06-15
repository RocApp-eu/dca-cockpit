import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";

/* ── TYPES ─────────────────────────────────────── */

export type DcaSettings = {
  usualAmount: number;
  frequency: "weekly" | "monthly";
  allocation: string;
  broker: string;
  multiplierCap: number;
};

export type UserProfile = {
  email: string | null;
  displayName: string | null;
  plan: "free" | "premium";
  settings: DcaSettings;
};

export type HoldingType = "etf" | "action" | "crypto";

export type Holding = {
  id: string;
  type: HoldingType;
  name: string;
  code: string;
  isin: string;
  quantity: number;
  value: number;
};

export type NewHolding = Omit<Holding, "id">;

/* ── DEFAULTS ──────────────────────────────────── */

export const DEFAULT_SETTINGS: DcaSettings = {
  usualAmount: 50,
  frequency: "weekly",
  allocation: "70 % ETF · 30 % crypto",
  broker: "Trade Republic",
  multiplierCap: 2.0,
};

export const TYPE_LABEL: Record<HoldingType, string> = {
  etf: "ETF",
  action: "Action",
  crypto: "Crypto",
};

/* ── PROFIL ────────────────────────────────────── */

/** Crée le document users/{uid} au premier login s'il n'existe pas encore. */
export async function ensureUserProfile(user: User): Promise<void> {
  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        plan: "free",
        settings: DEFAULT_SETTINGS,
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.error("ensureUserProfile a échoué", err);
  }
}

/** Abonnement temps réel au profil utilisateur. */
export function subscribeUserProfile(
  uid: string,
  cb: (profile: UserProfile | null) => void,
): Unsubscribe {
  const ref = doc(db, "users", uid);
  return onSnapshot(
    ref,
    (snap) => {
      if (!snap.exists()) {
        cb(null);
        return;
      }
      const data = snap.data();
      cb({
        email: data.email ?? null,
        displayName: data.displayName ?? null,
        plan: data.plan === "premium" ? "premium" : "free",
        settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) },
      });
    },
    (err) => {
      console.error("subscribeUserProfile a échoué", err);
      cb(null);
    },
  );
}

/** Met à jour les réglages DCA de l'utilisateur. */
export async function updateUserSettings(
  uid: string,
  settings: Partial<DcaSettings>,
): Promise<void> {
  const ref = doc(db, "users", uid);
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(settings)) {
    patch[`settings.${k}`] = v;
  }
  await updateDoc(ref, patch);
}

/* ── PORTEFEUILLE (HOLDINGS) ───────────────────── */

/** Abonnement temps réel aux lignes du portefeuille. */
export function subscribeHoldings(
  uid: string,
  cb: (holdings: Holding[]) => void,
): Unsubscribe {
  const col = collection(db, "users", uid, "holdings");
  const q = query(col, orderBy("value", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list: Holding[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          type: (data.type as HoldingType) ?? "etf",
          name: data.name ?? "",
          code: data.code ?? "",
          isin: data.isin ?? "",
          quantity: Number(data.quantity ?? 0),
          value: Number(data.value ?? 0),
        };
      });
      cb(list);
    },
    (err) => {
      console.error("subscribeHoldings a échoué", err);
      cb([]);
    },
  );
}

export async function addHolding(
  uid: string,
  holding: NewHolding,
): Promise<void> {
  const col = collection(db, "users", uid, "holdings");
  await addDoc(col, { ...holding, updatedAt: serverTimestamp() });
}

export async function updateHolding(
  uid: string,
  id: string,
  patch: Partial<NewHolding>,
): Promise<void> {
  const ref = doc(db, "users", uid, "holdings", id);
  await updateDoc(ref, { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteHolding(uid: string, id: string): Promise<void> {
  const ref = doc(db, "users", uid, "holdings", id);
  await deleteDoc(ref);
}

/* ── VERSEMENTS (DEPOSITS) ─────────────────────── */

export type Deposit = {
  id: string;
  amount: number;
  multiplier: number;
  weekId: string;
  weekLabel: string;
  note: string;
  createdAt: number;
};

export type NewDeposit = {
  amount: number;
  multiplier: number;
  weekId: string;
  weekLabel: string;
  note: string;
};

/** Abonnement temps réel à l'historique des versements (du plus récent au plus ancien). */
export function subscribeDeposits(
  uid: string,
  cb: (deposits: Deposit[]) => void,
): Unsubscribe {
  const col = collection(db, "users", uid, "deposits");
  const q = query(col, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list: Deposit[] = snap.docs.map((d) => {
        const data = d.data();
        const ts = data.createdAt;
        return {
          id: d.id,
          amount: Number(data.amount ?? 0),
          multiplier: Number(data.multiplier ?? 1),
          weekId: data.weekId ?? "",
          weekLabel: data.weekLabel ?? "",
          note: data.note ?? "",
          createdAt:
            ts && typeof ts.toMillis === "function" ? ts.toMillis() : 0,
        };
      });
      cb(list);
    },
    (err) => {
      console.error("subscribeDeposits a échoué", err);
      cb([]);
    },
  );
}

export async function addDeposit(
  uid: string,
  deposit: NewDeposit,
): Promise<void> {
  const col = collection(db, "users", uid, "deposits");
  await addDoc(col, { ...deposit, createdAt: serverTimestamp() });
}
