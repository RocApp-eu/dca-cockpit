import { SectionRuler } from "@/components/dashboard/SectionRuler";
import { SignalHero } from "@/components/dashboard/SignalHero";
import { SideStats } from "@/components/dashboard/SideStats";
import { PortfolioCard } from "@/components/dashboard/PortfolioCard";
import { AiDiagnosis } from "@/components/dashboard/AiDiagnosis";
import { CapitalChart } from "@/components/dashboard/CapitalChart";
import { SettingsCard } from "@/components/dashboard/SettingsCard";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { IosBanner } from "@/components/dashboard/IosBanner";
import { AdSlot } from "@/components/dashboard/AdSlot";
import { AffiliateCard } from "@/components/dashboard/AffiliateCard";
import { TrustDataCard } from "@/components/dashboard/TrustDataCard";

export default function DashboardPage() {
  return (
    <>
      <SectionRuler num="I" title="LECTURE MENSUELLE" subtitle="AVRIL 2026" />

      <div className="page-title">
        <h1>
          Avril, <em>investissez davantage.</em>
        </h1>
        <div className="page-meta">
          <span className="dot" />
          SIGNAL ACTIF · MAJ 22.04.2026 06:12
        </div>
      </div>

      <div className="grid-layout">
        <SignalHero />
        <SideStats />
      </div>

      <SectionRuler num="II" title="PREUVE PAR LA DATA" subtitle="BACKTEST · MÉTHODE · HISTORIQUE" />
      <TrustDataCard />

      <SectionRuler num="III" title="PASSER À L'ACTION" subtitle="COMPLÉTER VOTRE SETUP" />
      <AffiliateCard />

      <SectionRuler num="IV" title="MES SUPPORTS" subtitle="PORTEFEUILLE DÉCLARÉ" />
      <PortfolioCard />

      <SectionRuler
        num="V"
        title="DIAGNOSTIC DE PORTEFEUILLE"
        subtitle="ASSISTÉ PAR L'IA"
      />
      <AiDiagnosis />

      <SectionRuler num="VI" title="ÉVOLUTION DE VOTRE CAPITAL" subtitle="36 MOIS" />
      <CapitalChart />

      <div className="grid-layout" style={{ gridTemplateColumns: "1fr 1.2fr" }}>
        <SettingsCard />
        <ActivityCard />
      </div>

      <AdSlot />

      <IosBanner />
    </>
  );
}
