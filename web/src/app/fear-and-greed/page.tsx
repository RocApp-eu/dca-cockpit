import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Fear & Greed Index — DCA Cockpit",
  description:
    "Ce que mesure l'indice Fear & Greed crypto et comment il alimente le multiplicateur DCA hebdomadaire.",
};

export default function FearAndGreedPage() {
  return (
    <ComingSoon
      kicker="Apprendre · Fear & Greed"
      title="L'indice Fear & Greed, bientôt décrypté."
      description="Cette page expliquera l'indice de peur et d'avidité crypto, sa moyenne sur 7 jours et son rôle dans le signal. Page de contenu en préparation."
    />
  );
}
