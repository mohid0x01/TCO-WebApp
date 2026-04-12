import { motion } from "framer-motion";
import { Shield, Search, ClipboardList, AlertTriangle, Target, BookOpen, ChevronRight } from "lucide-react";
import { useServices } from "@/hooks/use-cms";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
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

  return (
    <section id="services" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

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
                className={`group relative glass-card rounded-2xl overflow-hidden gradient-border transition-all duration-500 ${service.is_featured ? "ring-1 ring-primary/20" : ""}`}
              >
                {service.is_featured && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 text-primary font-mono-terminal text-[9px] tracking-wider rounded-bl-xl border-b border-l border-primary/20">
                    FEATURED
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
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
