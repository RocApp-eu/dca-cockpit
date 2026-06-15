"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useUserData } from "@/lib/user-context";

function initials(name: string | null, email: string | null): string {
  const base = (name ?? email ?? "").trim();
  if (!base) return "··";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return base.slice(0, 2).toUpperCase();
}

export function UserChip() {
  const { user, signOutUser } = useAuth();
  const router = useRouter();
  const { profile } = useUserData();

  if (!user) return null;

  const displayName =
    profile?.displayName ?? user.displayName ?? user.email ?? "Mon compte";
  const planLabel =
    profile?.plan === "premium" ? "Plan premium" : "Plan gratuit";

  async function handleSignOut() {
    await signOutUser();
    router.replace("/login");
  }

  return (
    <div className="user-chip">
      <div className="user-avatar">{initials(displayName, user.email)}</div>
      <div className="user-chip-meta">
        <div className="u-name">{displayName}</div>
        <div className="u-plan">{planLabel}</div>
      </div>
      <button
        type="button"
        className="user-signout"
        onClick={handleSignOut}
        title="Se déconnecter"
        aria-label="Se déconnecter"
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5M21 12H9" />
        </svg>
      </button>
    </div>
  );
}
