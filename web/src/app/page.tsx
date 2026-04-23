import "./landing.css";
import { LogoMarkSymbol } from "@/components/landing/LogoMarkSymbol";
import { TopNav } from "@/components/landing/TopNav";
import { NavWrap } from "@/components/landing/NavWrap";
import { Hero } from "@/components/landing/Hero";
import { ReadingSection } from "@/components/landing/ReadingSection";
import { CalcSection } from "@/components/landing/CalcSection";
import { HowSection } from "@/components/landing/HowSection";
import { HistorySection } from "@/components/landing/HistorySection";
import { AppBar } from "@/components/landing/AppBar";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { RevealScope } from "@/components/landing/RevealScope";

export default function Home() {
  return (
    <div className="landing-root">
      <LogoMarkSymbol />
      <RevealScope />
      <NavWrap>
        <TopNav />
      </NavWrap>
      <Hero />
      <ReadingSection />
      <CalcSection />
      <HowSection />
      <HistorySection />
      <AppBar />
      <SiteFooter />
    </div>
  );
}
