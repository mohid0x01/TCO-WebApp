import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Shield, Search, ClipboardList, AlertTriangle, Target, BookOpen } from "lucide-react";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import CyberBackground3D from "@/components/CyberBackground3D";
import FooterSection from "@/components/FooterSection";
import { useServices } from "@/hooks/use-cms";

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  search: Search,
  clipboard: ClipboardList,
  "alert-triangle": AlertTriangle,
  target: Target,
  "book-open": BookOpen,
};

const Services = () => {
  const { data: services, isLoading } = useServices();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -80]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />
      <section ref={ref} className="relative pt-28 pb-20 px-4 overflow-hidden">
        <motion.div style={{ y }} className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full border border-primary/10 bg-primary/5 blur-2xl" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <span className="font-mono-terminal text-sm text-primary tracking-widest uppercase">// Security Pricing</span>
            <h1 className="font-display text-5xl md:text-7xl text-foreground mt-2">Simple, Transparent <span className="text-primary text-glow-blue">Pricing</span></h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Choose the operation package that fits your risk profile. Every plan starts with a secure strategy session.</p>
          </motion.div>

          {isLoading ? <div className="text-center py-20 font-mono-terminal text-primary animate-pulse">Loading services...</div> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {(services || []).slice(0, 3).map((service, i) => {
                  const Icon = iconMap[service.icon] || Shield;
                  return (
                    <motion.div key={service.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -10, rotateX: 3 }} className={`relative glass-card rounded-2xl p-6 md:p-8 gradient-border min-h-[520px] flex flex-col ${service.is_featured ? "box-glow-blue border-primary/30" : ""}`}>
                      {service.is_featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1 text-primary-foreground font-mono-terminal text-xs">★ Most Popular</div>}
                      <Icon className="w-8 h-8 text-primary mb-5" />
                      <h2 className="font-display text-3xl text-foreground mb-3">{service.title}</h2>
                      <div className="mb-5"><span className="font-mono-terminal text-[10px] text-muted-foreground uppercase">{service.price_label}</span><p className="font-display text-5xl text-primary text-glow-blue">{service.price}</p></div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                      <ul className="space-y-3 flex-1">
                        {(service.features || []).slice(0, 8).map((feature) => <li key={feature} className="flex gap-3 text-sm text-foreground/80"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />{feature}</li>)}
                      </ul>
                      <Link to={`/services/${service.slug}`} className={`mt-8 text-center font-display text-sm tracking-wider uppercase py-3 rounded-lg border transition-all ${service.is_featured ? "bg-primary text-primary-foreground border-primary hover:box-glow-blue" : "border-primary/30 text-primary hover:bg-primary/10"}`}>{service.cta_label || "Get Started"} →</Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="glass-card rounded-2xl overflow-hidden gradient-border">
                <div className="p-6 border-b border-border/50"><h2 className="font-display text-3xl text-foreground">Capability Comparison</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px]">
                    <thead><tr className="border-b border-border/50">{["Service", "Level", "Timeline", "Best For", "Deliverables"].map((h) => <th key={h} className="text-left p-4 font-mono-terminal text-xs text-primary uppercase tracking-wider">{h}</th>)}</tr></thead>
                    <tbody>{(services || []).map((s) => <tr key={s.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors"><td className="p-4 font-display text-lg text-foreground">{s.title}<div className="font-mono-terminal text-xs text-primary">{s.price}</div></td><td className="p-4 text-sm text-muted-foreground">{s.comparison_level}</td><td className="p-4 text-sm text-muted-foreground">{s.timeline}</td><td className="p-4 text-sm text-muted-foreground">{s.best_for}</td><td className="p-4 text-sm text-muted-foreground">{(s.deliverables || s.features || []).slice(0, 3).join(" • ")}</td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default Services;
