"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { ensureUserProfile } from "./user-data";

// Codes d'erreur où la popup Google échoue (Safari/ITP, popup bloquée, etc.) :
// on bascule alors sur une redirection plein écran, plus robuste.
const POPUP_FALLBACK_CODES = new Set([
  "auth/popup-blocked",
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/operation-not-supported-in-this-environment",
  "auth/web-storage-unsupported",
  "auth/internal-error",
]);

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Traite un éventuel retour de signInWithRedirect (Google sur Safari, etc.).
    getRedirectResult(auth).catch((err) => {
      console.error("getRedirectResult a échoué", err);
    });

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // Création du profil Firestore au premier login, sans bloquer l'UI.
        void ensureUserProfile(u);
      }
    });
    return unsub;
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    async signInEmail(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async signUpEmail(email, password, displayName) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      await ensureUserProfile(cred.user);
    },
    async signInGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (err) {
        const code =
          typeof err === "object" && err !== null && "code" in err
            ? String((err as { code: unknown }).code)
            : "";
        // Popup bloquée ou non supportée (Safari) : on redirige la page entière.
        if (POPUP_FALLBACK_CODES.has(code)) {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw err;
      }
    },
    async signOutUser() {
      await signOut(auth);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  }
  return ctx;
}
