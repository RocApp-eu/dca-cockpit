"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { LogoMark } from "@/components/dashboard/LogoMark";

type Mode = "signin" | "signup";

function friendlyError(err: unknown): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code: unknown }).code)
      : "";
  switch (code) {
    case "auth/invalid-email":
      return "Adresse email invalide.";
    case "auth/missing-password":
      return "Merci de renseigner un mot de passe.";
    case "auth/weak-password":
      return "Mot de passe trop court (6 caractères minimum).";
    case "auth/email-already-in-use":
      return "Un compte existe déjà avec cette adresse.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email ou mot de passe incorrect.";
    case "auth/popup-closed-by-user":
      return "Connexion Google annulée.";
    case "auth/too-many-requests":
      return "Trop de tentatives. Réessayez dans quelques minutes.";
    case "auth/operation-not-allowed":
      return "Cette méthode de connexion n'est pas activée. Vérifiez la console Firebase.";
    default:
      return "Une erreur est survenue. Réessayez.";
  }
}

export default function LoginPage() {
  const { user, loading, signInEmail, signUpEmail, signInGoogle } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password, name.trim() || undefined);
      }
      router.replace("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      await signInGoogle();
      router.replace("/dashboard");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <LogoMark />
          DCA Cockpit
        </Link>

        <h1 className="auth-title">
          {mode === "signin" ? (
            <>
              Bon retour, <em>au cockpit.</em>
            </>
          ) : (
            <>
              Créez votre <em>cockpit.</em>
            </>
          )}
        </h1>
        <p className="auth-sub">
          {mode === "signin"
            ? "Connectez-vous pour retrouver votre signal et votre portefeuille."
            : "Quelques secondes suffisent. Plan gratuit, sans carte bancaire."}
        </p>

        <button
          type="button"
          className="auth-google"
          onClick={handleGoogle}
          disabled={busy}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.87l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
            />
          </svg>
          Continuer avec Google
        </button>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="auth-field">
              <span>Prénom</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Hubert"
                autoComplete="given-name"
              />
            </label>
          )}
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-field">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy
              ? "Un instant…"
              : mode === "signin"
                ? "Se connecter"
                : "Créer mon compte"}
          </button>
        </form>

        <p className="auth-toggle">
          {mode === "signin" ? (
            <>
              Pas encore de compte ?{" "}
              <button type="button" onClick={() => setMode("signup")}>
                Créer un compte
              </button>
            </>
          ) : (
            <>
              Déjà inscrit ?{" "}
              <button type="button" onClick={() => setMode("signin")}>
                Se connecter
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
