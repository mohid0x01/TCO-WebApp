import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Search, ClipboardList, AlertTriangle, Target, BookOpen, ChevronRight } from "lucide-react";
import { useServices } from "@/hooks/use-cms";
import { useRef, useState } from "react";
import type { ElementType } from "react";
import { Link } from "react-router-dom";

const iconMap: Record<string, ElementType> = {
  shield: Shield,
  search: Search,
  clipboard: ClipboardList,
  "alert-triangle": AlertTriangle,
  target: Target,
  "book-open": BookOpen,
};

const ServicesSection = () => {
  const { data: services } = useServices();
  const [expanded, setExpanded] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const orbY = useTransform(scrollYProgress, [0, 1], [-60, 90]);
  const deepY = useTransform(scrollYProgress, [0, 1], [130, -140]);

  return (
    <section id="services" ref={ref} className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <motion.div style={{ y }} className="absolute left-[8%] top-24 h-28 w-28 rotate-45 border border-primary/15 bg-primary/5 hidden md:block" />
      <motion.div style={{ y: orbY }} className="absolute right-[10%] bottom-28 h-20 w-20 rounded-full border border-neon-green/15 bg-neon-green/5 hidden md:block" />
      <motion.div style={{ y: deepY }} className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full border border-neon-red/10 bg-neon-red/5 blur-2xl hidden md:block" />
      <motion.div style={{ y: deepY }} className="absolute right-[18%] top-12 h-44 w-44 rotate-12 border border-primary/10 bg-[linear-gradient(135deg,hsl(var(--primary)/0.10),transparent)] hidden lg:block" />
      <motion.div style={{ y: orbY }} className="absolute left-[18%] bottom-8 h-40 w-40 border border-primary/10 bg-[repeating-linear-gradient(90deg,hsl(var(--primary)/0.08)_0_1px,transparent_1px_10px)] opacity-60 hidden lg:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono-terminal text-[10px] tracking-[0.4em] text-primary/70 uppercase">
            // Services & Capabilities
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-3">
            Our <span className="text-primary text-glow-blue">Arsenal</span> of Services
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Elite cybersecurity services tailored to protect your digital infrastructure against evolving threats.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services || []).map((service, i) => {
            const Icon = iconMap[service.icon] || Shield;
            const isExpanded = expanded === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, rotateX: 4, rotateY: i % 2 ? -2 : 2 }}
                className={`group relative glass-card rounded-2xl overflow-hidden gradient-border transition-all duration-500 hover:box-glow-blue ${service.is_featured ? "ring-1 ring-primary/30 box-glow-blue" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.22),transparent_45%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,hsl(var(--primary)/0.08)_45%,transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-4 border border-primary/10 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ transform: "translateZ(18px)" }} />
                <div className="absolute inset-8 border border-neon-red/10 transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" style={{ transform: "translateZ(34px)" }} />
                <div className="absolute inset-x-6 top-0 h-px bg-primary/60 shadow-[0_0_18px_hsl(var(--primary)/0.9)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-primary/20 bg-primary/10 transition-transform duration-500 group-hover:translate-x-2 group-hover:scale-125" />
                <div className="absolute -left-10 bottom-12 h-24 w-24 rotate-45 border border-neon-red/20 bg-neon-red/5 transition-transform duration-500 group-hover:-translate-y-3 group-hover:rotate-90" />
                {service.is_featured && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 text-primary font-mono-terminal text-[9px] tracking-wider rounded-bl-xl border-b border-l border-primary/20">
                    FEATURED
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_24px_hsl(var(--primary)/0.12)] group-hover:shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4 py-3 border-y border-border/30">
                    {service.price_label && (
                      <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider">
                        {service.price_label}
                      </span>
                    )}
                    <p className="font-display text-2xl text-primary text-glow-blue">
                      {service.price}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-4">
                    {(service.features || []).slice(0, isExpanded ? undefined : 3).map((feat: string, fi: number) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-foreground/70">
                        <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {(service.features || []).length > 3 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : service.id)}
                      className="flex items-center gap-1 text-primary font-mono-terminal text-xs hover:underline"
                    >
                      {isExpanded ? "Show less" : `+${(service.features || []).length - 3} more`}
                      <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                  )}
                </div>

                <div className="px-6 pb-6">
                  <a
                    href="#contact"
                    onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="block w-full text-center font-mono-terminal text-xs tracking-wider uppercase py-3 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 hover:box-glow-blue transition-all duration-300"
                  >
                    Get Quote →
                  </a>
                  <Link to={`/services/${service.slug}`} className="block w-full text-center font-mono-terminal text-xs tracking-wider uppercase py-3 mt-2 rounded-xl text-muted-foreground hover:text-primary transition-all duration-300">
                    View Details
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
