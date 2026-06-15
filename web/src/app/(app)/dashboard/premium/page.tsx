import { ComingSoon } from "@/components/ComingSoon";

export default function PremiumPage() {
  return (
    <ComingSoon
      kicker="Premium"
      title="Le signal complet arrive."
      description="Multi-portefeuilles, alertes push, backtest personnalisé et export fiscal. L'offre early adopters à 1,99 €/mois sera activée ici. Paiement à brancher (Stripe)."
      backHref="/dashboard"
      backLabel="Retour au cockpit"
    />
  );
}
