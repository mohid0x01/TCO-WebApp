import { motion, useReducedMotion } from "framer-motion";
import skullBack from "@/assets/skull-back.png";
import ParticleBackground from "./ParticleBackground";
import GlitchText from "./GlitchText";
import TypingText from "./TypingText";
import { useSiteContent } from "@/hooks/use-cms";
import { useGitHubAvatar } from "@/hooks/use-github-avatar";
import { useState } from "react";

const HeroSection = () => {
  const { data: content } = useSiteContent();
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = useReducedMotion();
  const rawTitle = content?.hero_title || "TeamCyberØps";
  const heroTitle = rawTitle.replace(/teamcyberops/i, "TeamCyberØps");
  const avatarUrl = useGitHubAvatar();

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
          initial={{ scale: 0.82, opacity: 0, rotateY: reduceMotion ? 0 : 120 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 sm:mb-10"
        >
          <div className="hero-logo-shell relative inline-block h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 lg:h-48 lg:w-48" style={{ perspective: "1400px" }} onMouseEnter={() => !reduceMotion && setFlipped(true)} onMouseLeave={() => setFlipped(false)} onClick={() => setFlipped((v) => !v)} aria-label="Flip TeamCyberØps logo">
            <div className="absolute -inset-5 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
            <div className="hero-logo-orbit absolute -inset-4 rounded-full border border-primary/25 scanline" />
            <div className="absolute inset-0 rounded-full border border-neon-red/15" />
            <div
              className="hero-logo-card relative h-full w-full cursor-pointer rounded-full"
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease",
                transform: `rotateY(${reduceMotion ? 0 : flipped ? 180 : 0}deg) rotateZ(${flipped ? -1.5 : 0}deg)`,
                filter: flipped
                  ? "drop-shadow(0 0 30px hsl(var(--neon-red) / 0.58))"
                  : "drop-shadow(0 0 30px hsl(var(--primary) / 0.58))",
              }}
            >
              {/* Front face — GitHub auto-updated avatar */}
              <div
                className="absolute inset-0 rounded-full ring-2 ring-primary/50 overflow-hidden"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                <img src={avatarUrl} alt="TeamCyberØps logo" width={512} height={512} className="h-full w-full object-cover" />
              </div>
              {/* Back face — skull */}
              <div
                className="absolute inset-0 rounded-full ring-2 ring-neon-red/50 overflow-hidden"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <img src={skullBack} alt="TeamCyberØps skull mark" width={512} height={512} className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-2 top-1/2 h-px bg-primary/70 opacity-0 shadow-[0_0_18px_hsl(var(--primary)/0.95)] transition-opacity duration-300 hero-logo-slice" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="font-display text-[clamp(2.65rem,11vw,7rem)] leading-[0.88] tracking-normal text-glow-blue text-primary mb-4 break-words max-w-full"
        >
          <GlitchText text={heroTitle} />
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

          {/* CTF button */}
          <a
            href="https://ctfcyberops.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative font-display text-sm tracking-[0.2em] uppercase px-8 py-3 rounded-lg overflow-hidden border border-neon-green/40 text-neon-green transition-all duration-300 hover:shadow-[0_0_24px_hsl(var(--neon-green)/0.35),inset_0_0_24px_hsl(var(--neon-green)/0.08)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/15 to-neon-green/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-2">🏴 CTF</span>
          </a>

          {/* WebRecox button */}
          <a
            href="https://webrecox.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative font-display text-sm tracking-[0.2em] uppercase px-8 py-3 rounded-lg overflow-hidden border border-[hsl(280,80%,55%)]/40 text-[hsl(280,80%,65%)] transition-all duration-300 hover:shadow-[0_0_24px_hsl(280_80%_55%/0.35),inset_0_0_24px_hsl(280_80%_55%/0.08)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[hsl(280,80%,55%)]/0 via-[hsl(280,80%,55%)]/15 to-[hsl(280,80%,55%)]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-2">🔍 WebRecox</span>
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
