import Header from "@/components/Header";
import HeroSection from "@/components/sections/HeroSection";
import RecommendationWizard from "@/components/sections/RecommendationWizard";
import RecommendationExamplesSection from "@/components/sections/RecommendationExamplesSection";
import StepsSection from "@/components/sections/StepsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import TopSoldSection from "@/components/sections/TopSoldSection";
import FaqSection from "@/components/sections/FaqSection";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white text-black overflow-hidden">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <section className="py-24 bg-[#F8FAFC]" id="find-my-laptop">
          <div className="container mx-auto px-4">
            {/* <RecommendationWizard /> */}
          </div>
        </section>
        <StepsSection />
        {/* <RecommendationExamplesSection /> */}
        <ServicesSection />
        <TopSoldSection />
        <FeaturesSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
