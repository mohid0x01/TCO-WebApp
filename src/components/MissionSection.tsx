import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import badge from "@/assets/teamcyberops-badge.jpeg";
import skullBack from "@/assets/skull-back.png";
import { useSiteContent } from "@/hooks/use-cms";

const FlipLogo = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-64 md:w-80 h-64 md:h-80 cursor-pointer mx-auto"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Front — Badge */}
        <div className="absolute inset-0 backface-hidden">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-75" />
          <img
            src={badge}
            alt="TeamCyberOps Badge"
            className="relative w-full h-full rounded-full ring-2 ring-primary/20 shadow-2xl shadow-primary/10 object-cover"
          />
        </div>
        {/* Back — Skull */}
        <div className="absolute inset-0 backface-hidden" style={{ transform: "rotateY(180deg)" }}>
          <div className="absolute inset-0 rounded-full bg-neon-red/20 blur-3xl scale-75" />
          <img
            src={skullBack}
            alt="Skull"
            className="relative w-full h-full rounded-full ring-2 ring-neon-red/30 shadow-2xl shadow-neon-red/20 object-cover"
          />
        </div>
      </motion.div>
      <p className="font-mono-terminal text-[10px] text-muted-foreground/50 text-center mt-4 absolute -bottom-8 left-0 right-0">
        {isFlipped ? "👁️ The Other Side" : "Hover/Click to flip"}
      </p>
    </div>
  );
};

const MissionSection = () => {
  const { data: content } = useSiteContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const infoItems = [
    { label: "Founded", value: content?.mission_founded || "2024" },
    { label: "Location", value: content?.mission_location || "Pakistan 🇵🇰" },
    { label: "Focus", value: content?.mission_focus || "Offensive Security" },
    { label: "Certifications", value: content?.mission_certs || "CEH, CSSP, eJPT" },
  ];

  return (
    <section id="mission" ref={ref} className="relative py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="font-mono-terminal text-sm text-primary tracking-widest uppercase">{content?.mission_label || "// Our Mission"}</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-2">{content?.mission_title || "Who We Are"}</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div style={{ y: y1 }} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex justify-center">
            <FlipLogo />
          </motion.div>

          <motion.div style={{ y: y2 }} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="glass-card rounded-xl p-8 gradient-border space-y-5">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono-terminal text-xs text-neon-green tracking-widest">{content?.mission_status || "STATUS: ACTIVE"}</span>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-foreground/90 leading-relaxed text-lg">
                {content?.mission_description_1 || "TeamCyberOps is a cybersecurity and ethical hacking organization dedicated to building cutting-edge, open-source security tools."}
              </motion.p>

              <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="text-muted-foreground leading-relaxed">
                {content?.mission_description_2 || "Our mission is simple: Monitor and Protect."}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  {infoItems.map((item, i) => (
                    <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.1 }}>
                      <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
                      <p className="text-sm text-foreground mt-0.5">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
