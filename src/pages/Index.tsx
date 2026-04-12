import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import ArsenalSection from "@/components/ArsenalSection";
import StatsSection from "@/components/StatsSection";
import CrewSection from "@/components/CrewSection";
import BlogSection from "@/components/BlogSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import FooterSection, { SocialBar } from "@/components/FooterSection";
import CyberBackground3D from "@/components/CyberBackground3D";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />
      <SocialBar />
      <HeroSection />
      <MissionSection />
      <ArsenalSection />
      <StatsSection />
      <ServicesSection />
      <CrewSection />
      <BlogSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
