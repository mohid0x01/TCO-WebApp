import { motion } from "framer-motion";
import badge from "@/assets/teamcyberops-badge.jpeg";
import ParticleBackground from "./ParticleBackground";
import GlitchText from "./GlitchText";
import TypingText from "./TypingText";
import { useSiteContent } from "@/hooks/use-cms";

const HeroSection = () => {
  const { data: content } = useSiteContent();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background z-10" />

      <div className="absolute top-24 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/20 z-20 hidden lg:block" />
      <div className="absolute top-24 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/20 z-20 hidden lg:block" />
      <div className="absolute bottom-16 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/20 z-20 hidden lg:block" />
      <div className="absolute bottom-16 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/20 z-20 hidden lg:block" />

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-10"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-110" />
            <img
              src={badge}
              alt="TeamCyberOps Badge"
              width={512}
              height={512}
              className="relative w-36 h-36 md:w-48 md:h-48 mx-auto rounded-full ring-2 ring-primary/30 shadow-2xl shadow-primary/20 animate-float"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-display text-5xl sm:text-6xl md:text-8xl tracking-wider text-glow-blue text-primary mb-4"
        >
          <GlitchText text={content?.hero_title || "TEAMCYBEROPS"} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-mono-terminal text-xs text-muted-foreground tracking-[0.3em] uppercase mb-6"
        >
          {content?.hero_subtitle || "Cybersecurity & Ethical Hacking Organization"}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-xl md:text-2xl text-foreground/80 mb-12"
        >
          <TypingText text={content?.hero_motto || "Monitor and Protect"} speed={90} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#projects"
            onClick={(e) => { e.preventDefault(); document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" }); }}
            className="font-display text-sm tracking-[0.2em] uppercase px-8 py-3 bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:box-glow-blue transition-all duration-300 rounded-lg glass"
          >
            {content?.hero_cta_primary || "Explore Arsenal →"}
          </a>
          <a
            href="https://github.com/mohidqx"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm tracking-[0.2em] uppercase px-8 py-3 border border-neon-red/30 text-neon-red hover:bg-neon-red/10 hover:box-glow-red transition-all duration-300 rounded-lg"
          >
            {content?.hero_cta_secondary || "GitHub →"}
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/20 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-primary/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
