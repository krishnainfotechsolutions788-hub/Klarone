import Header from "@/components/Header";
import HeroSection from "@/components/sections/HeroSection";
import ScrollIntroSection from "@/components/sections/ScrollIntroSection";
import TopSoldSection from "@/components/sections/TopSoldSection";
import StatsSection from "@/components/sections/StatsSection";
import PricingSection from "@/components/sections/PricingSection";
import FaqSection from "@/components/sections/FaqSection";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#000000] text-foreground overflow-hidden">
      <main className="flex-1">
        <HeroSection />
        <ScrollIntroSection />
        <TopSoldSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

