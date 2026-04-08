import { motion } from "framer-motion";
import owlLogo from "@/assets/owl-logo.png";
import ParticleBackground from "./ParticleBackground";
import GlitchText from "./GlitchText";
import TypingText from "./TypingText";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <img
            src={owlLogo}
            alt="TeamCyberOps Owl Logo"
            width={512}
            height={512}
            className="w-32 h-32 md:w-44 md:h-44 mx-auto animate-float drop-shadow-[0_0_30px_rgba(0,200,255,0.4)]"
          />
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-wider text-glow-blue text-primary mb-6"
        >
          <GlitchText text="TeamCyberOps" />
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-lg md:text-2xl text-foreground/80 mb-10"
        >
          <TypingText text="Monitor and Protect" speed={100} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="https://github.com/mohidqx"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-sm tracking-widest uppercase px-8 py-3 border border-primary/50 text-primary hover:bg-primary/10 hover:box-glow-blue transition-all duration-300 rounded"
          >
            View Arsenal →
          </a>
          <a
            href="#projects"
            className="font-display text-sm tracking-widest uppercase px-8 py-3 border border-neon-red/50 text-neon-red hover:bg-neon-red/10 hover:box-glow-red transition-all duration-300 rounded"
          >
            Explore Projects
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1.5 h-3 bg-primary/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
