import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Méthode DCA — DCA Cockpit",
  description:
    "Comment le multiplicateur DCA hebdomadaire est calculé : Fear & Greed, drawdown MSCI World, lissage anti-whipsaw.",
};

export default function MethodePage() {
  return (
    <ComingSoon
      kicker="Apprendre · Méthode"
      title="La méthode DCA, bientôt en clair."
      description="Cette page détaillera la formule publique du signal : les deux entrées, le lissage 60/40 et les bornes ×0,6 à ×2,0. Page de contenu en préparation."
    />
  );
}
