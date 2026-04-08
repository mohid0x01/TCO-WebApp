import HeroSection from "@/components/HeroSection";
import ArsenalSection from "@/components/ArsenalSection";
import CrewSection from "@/components/CrewSection";
import StatsSection from "@/components/StatsSection";
import FooterSection, { SocialBar } from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SocialBar />
      <HeroSection />
      <ArsenalSection />
      <StatsSection />
      <CrewSection />
      <FooterSection />
    </div>
  );
};

export default Index;
