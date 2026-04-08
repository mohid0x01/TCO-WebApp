import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import ArsenalSection from "@/components/ArsenalSection";
import StatsSection from "@/components/StatsSection";
import CrewSection from "@/components/CrewSection";
import ContactSection from "@/components/ContactSection";
import FooterSection, { SocialBar } from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <SocialBar />
      <HeroSection />
      <MissionSection />
      <ArsenalSection />
      <StatsSection />
      <CrewSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
