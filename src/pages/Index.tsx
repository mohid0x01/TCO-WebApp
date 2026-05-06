import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import FloatingGitHubWidget from "@/components/FloatingGitHubWidget";

const Index = () => {
  const location = useLocation();

  // Scroll to hash on navigation (e.g. from /services CTA)
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);
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
      <FloatingGitHubWidget />
    </div>
  );
};

export default Index;
