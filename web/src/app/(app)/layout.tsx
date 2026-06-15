import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";

// Le groupe (app) porte l'AuthProvider. La landing (route /) reste hors de ce
// groupe et n'embarque donc pas Firebase dans son bundle.
export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
