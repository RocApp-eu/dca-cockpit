"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/** Protège une sous-arborescence : redirige vers /login si pas de session. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner" aria-label="Chargement" />
      </div>
    );
  }

  return <>{children}</>;
}
