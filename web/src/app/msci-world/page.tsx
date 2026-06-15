import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "MSCI World — DCA Cockpit",
  description:
    "Ce qu'est l'indice MSCI World, son drawdown 52 semaines et comment il pondère le multiplicateur DCA.",
};

export default function MsciWorldPage() {
  return (
    <ComingSoon
      kicker="Apprendre · MSCI World"
      title="Le MSCI World, bientôt expliqué."
      description="Cette page présentera l'indice actions mondiales, la notion de drawdown 52 semaines et son poids dans le signal. Page de contenu en préparation."
    />
  );
}
