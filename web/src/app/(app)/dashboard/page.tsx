import { SectionRuler } from "@/components/dashboard/SectionRuler";
import { LectureHeader } from "@/components/dashboard/LectureHeader";
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
      <LectureHeader />

      <div className="grid-layout">
        <SignalHero />
        <SideStats />
      </div>

      <SectionRuler
        num="II"
        title="PREUVE PAR LA DATA"
        subtitle="BACKTEST · MÉTHODE · HISTORIQUE"
        id="historique"
      />
      <TrustDataCard />

      <SectionRuler num="III" title="PASSER À L'ACTION" subtitle="COMPLÉTER VOTRE SETUP" />
      <AffiliateCard />

      <SectionRuler
        num="IV"
        title="MES SUPPORTS"
        subtitle="PORTEFEUILLE DÉCLARÉ"
        id="supports"
      />
      <PortfolioCard />

      <SectionRuler
        num="V"
        title="DIAGNOSTIC DE PORTEFEUILLE"
        subtitle="ASSISTÉ PAR L'IA"
        id="diagnostic"
      />
      <AiDiagnosis />

      <SectionRuler
        num="VI"
        title="ÉVOLUTION DE VOTRE CAPITAL"
        subtitle="36 MOIS"
        id="projection"
      />
      <CapitalChart />

      <div
        className="grid-layout"
        id="versements"
        style={{ gridTemplateColumns: "1fr 1.2fr", scrollMarginTop: 90 }}
      >
        <SettingsCard />
        <ActivityCard />
      </div>

      <AdSlot />

      <IosBanner />
    </>
  );
}
