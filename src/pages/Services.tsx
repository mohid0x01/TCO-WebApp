import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Shield, Search, ClipboardList, AlertTriangle, Target, BookOpen, X } from "lucide-react";
import { useMemo, useRef } from "react";
import type { ElementType } from "react";
import Navbar from "@/components/Navbar";
import CyberBackground3D from "@/components/CyberBackground3D";
import FooterSection from "@/components/FooterSection";
import { useServices } from "@/hooks/use-cms";

const iconMap: Record<string, ElementType> = {
  shield: Shield,
  search: Search,
  clipboard: ClipboardList,
  "alert-triangle": AlertTriangle,
  target: Target,
  "book-open": BookOpen,
};

const featureRows = [
  { label: "External attack surface scan", match: (s: any) => /scan|external|recon|assessment|vulnerability/i.test(`${s.title} ${s.features?.join(" ")}`) },
  { label: "Manual exploitation validation", match: (s: any) => /penetration|exploit|manual|red team|web app/i.test(`${s.title} ${s.features?.join(" ")}`) },
  { label: "Risk-ranked remediation report", match: (s: any) => /report|remediation|deliverable|audit|risk/i.test(`${s.title} ${s.features?.join(" ")}`) || (s.deliverables || []).length > 0 },
  { label: "Executive security briefing", match: (s: any) => /audit|brief|executive|compliance|governance/i.test(`${s.title} ${s.features?.join(" ")} ${s.deliverables?.join(" ")}`) },
  { label: "Retest window included", match: (s: any) => /retest|verification|follow.?up|closure/i.test(`${s.features?.join(" ")} ${s.deliverables?.join(" ")}`) },
  { label: "Priority response channel", match: (s: any) => /incident|priority|response|emergency|managed/i.test(`${s.title} ${s.features?.join(" ")}`) },
];

const assuranceRows = ["Authorized scope only", "Zero-leak evidence handling", "Encrypted reporting", "Remediation-first output"];

const operationSteps = [
  { phase: "01", title: "Scope Lock", copy: "Define targets, authorization windows, exclusions, and success criteria before testing starts." },
  { phase: "02", title: "Active Operation", copy: "Run controlled recon, validation, exploitation checks, and evidence capture with minimal noise." },
  { phase: "03", title: "Fix & Retest", copy: "Deliver ranked findings, remediation steps, and verification support to close security gaps." },
];

const Services = () => {
  const { data: services, isLoading } = useServices();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -110]);
  const yFast = useTransform(scrollYProgress, [0, 1], [140, -160]);
  const activeServices = services || [];
  const tiers = activeServices.slice(0, 4);
  const featured = useMemo(() => activeServices.find((s) => s.is_featured) || activeServices[0], [activeServices]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />
      <section ref={ref} className="relative pt-28 pb-28 px-4 overflow-hidden">
        <motion.div style={{ y }} className="absolute left-[8%] top-28 h-56 w-56 rotate-45 border border-primary/15 bg-primary/5 blur-[1px]" />
        <motion.div style={{ y: yFast }} className="absolute right-[7%] top-72 h-44 w-44 rounded-full border border-neon-red/20 bg-neon-red/5 blur-xl" />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <span className="font-mono-terminal text-sm text-primary tracking-widest uppercase">// Security Pricing</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-foreground mt-2">Services <span className="text-primary text-glow-blue">Comparison</span></h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Compare offensive security tiers, choose coverage, then open a secure quote request.</p>
          </motion.div>

          {isLoading ? <div className="text-center py-20 font-mono-terminal text-primary animate-pulse">Loading services...</div> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {activeServices.slice(0, 3).map((service, i) => {
                  const Icon = iconMap[service.icon] || Shield;
                  return (
                    <motion.div key={service.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -12, rotateX: 4, rotateY: i % 2 ? -3 : 3 }} className={`group relative glass-card rounded-2xl p-6 md:p-8 gradient-border min-h-[520px] flex flex-col overflow-hidden ${service.is_featured ? "box-glow-blue border-primary/30" : ""}`} style={{ transformStyle: "preserve-3d" }}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.18),transparent_45%)]" />
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-primary/20 bg-primary/10 group-hover:scale-125 transition-transform duration-500" />
                      {service.is_featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-5 py-1 text-primary-foreground font-mono-terminal text-xs">★ Most Popular</div>}
                      <Icon className="relative w-8 h-8 text-primary mb-5 drop-shadow-[0_0_16px_hsl(var(--primary)/0.65)]" />
                      <h2 className="relative font-display text-3xl text-foreground mb-3 group-hover:text-primary transition-colors">{service.title}</h2>
                      <div className="relative mb-5"><span className="font-mono-terminal text-[10px] text-muted-foreground uppercase">{service.price_label}</span><p className="font-display text-5xl text-primary text-glow-blue">{service.price}</p></div>
                      <p className="relative text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                      <ul className="relative space-y-3 flex-1">
                        {(service.features || []).slice(0, 8).map((feature) => <li key={feature} className="flex gap-3 text-sm text-foreground/80"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />{feature}</li>)}
                      </ul>
                      <Link to={`/services/${service.slug}`} className={`relative mt-8 text-center font-display text-sm tracking-wider uppercase py-3 rounded-lg border transition-all ${service.is_featured ? "bg-primary text-primary-foreground border-primary hover:box-glow-blue" : "border-primary/30 text-primary hover:bg-primary/10"}`}>{service.cta_label || "Get Started"} →</Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mb-16">
                <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border overflow-hidden relative">
                  <div className="absolute inset-0 grid-bg opacity-20" />
                  <div className="relative">
                    <span className="font-mono-terminal text-[10px] text-primary uppercase tracking-[0.3em]">// Engagement Flow</span>
                    <h2 className="font-display text-3xl text-foreground mt-2 mb-6">From Recon to Remediation</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      {operationSteps.map((step) => (
                        <div key={step.phase} className="rounded-xl border border-primary/15 bg-background/25 p-4">
                          <span className="font-mono-terminal text-xs text-primary">{step.phase}</span>
                          <h3 className="font-display text-xl text-foreground mt-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.copy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border">
                  <span className="font-mono-terminal text-[10px] text-primary uppercase tracking-[0.3em]">// Security Rules</span>
                  <h2 className="font-display text-3xl text-foreground mt-2 mb-5">Zero-Leak Handling</h2>
                  <div className="grid gap-3">
                    {assuranceRows.map((item) => <div key={item} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/20 p-3 text-sm text-foreground/80"><Check className="h-4 w-4 text-primary" />{item}</div>)}
                  </div>
                </div>
              </div>

              <div id="comparison" className="relative glass-card rounded-2xl overflow-hidden gradient-border mb-10">
                <div className="p-6 border-b border-border/50 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <div>
                    <span className="font-mono-terminal text-[10px] text-primary uppercase tracking-[0.3em]">// Feature Matrix</span>
                    <h2 className="font-display text-3xl text-foreground mt-2">Capability Comparison</h2>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xl">Feature rows map across service tiers. On mobile, swipe the matrix sideways while the feature column stays pinned.</p>
                </div>
                <div className="overflow-x-auto pb-3 [-webkit-overflow-scrolling:touch]">
                  <table className="w-full min-w-[760px] sm:min-w-[920px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="sticky left-0 z-20 bg-card/95 backdrop-blur text-left p-4 font-mono-terminal text-xs text-primary uppercase tracking-wider w-64">Feature</th>
                        {tiers.map((service) => <th key={service.id} className="p-4 text-left align-top"><Link to={`/services/${service.slug}`} className="font-display text-xl text-foreground hover:text-primary transition-colors">{service.title}</Link><div className="font-mono-terminal text-xs text-primary mt-1">{service.price}</div></th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30"><td className="sticky left-0 z-10 bg-card/95 p-4 font-mono-terminal text-xs text-muted-foreground uppercase">Best For</td>{tiers.map((s) => <td key={s.id} className="p-4 text-sm text-muted-foreground">{s.best_for}</td>)}</tr>
                      <tr className="border-b border-border/30"><td className="sticky left-0 z-10 bg-card/95 p-4 font-mono-terminal text-xs text-muted-foreground uppercase">Timeline</td>{tiers.map((s) => <td key={s.id} className="p-4 text-sm text-muted-foreground">{s.timeline}</td>)}</tr>
                      <tr className="border-b border-border/30"><td className="sticky left-0 z-10 bg-card/95 p-4 font-mono-terminal text-xs text-muted-foreground uppercase">Level</td>{tiers.map((s) => <td key={s.id} className="p-4 text-sm text-muted-foreground">{s.comparison_level}</td>)}</tr>
                      {featureRows.map((row) => <tr key={row.label} className="border-b border-border/30 hover:bg-primary/5 transition-colors"><td className="sticky left-0 z-10 bg-card/95 p-4 font-mono-terminal text-xs text-foreground uppercase">{row.label}</td>{tiers.map((s) => <td key={s.id} className="p-4">{row.match(s) ? <Check className="w-5 h-5 text-primary drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" /> : <X className="w-4 h-4 text-muted-foreground/40" />}</td>)}</tr>)}
                      <tr><td className="sticky left-0 z-10 bg-card/95 p-4 font-mono-terminal text-xs text-muted-foreground uppercase">Deliverables</td>{tiers.map((s) => <td key={s.id} className="p-4 text-sm text-muted-foreground">{(s.deliverables || s.features || []).slice(0, 3).join(" • ")}</td>)}</tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="sticky bottom-4 z-30 rounded-2xl border border-primary/30 bg-card/90 backdrop-blur-xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] box-glow-blue">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div><p className="font-display text-xl text-foreground">Ready for a zero-leak security operation?</p><p className="font-mono-terminal text-xs text-muted-foreground">Recommended: {featured?.title || "Security Assessment"} • {featured?.price || "Contact Us"}</p></div>
                  <a href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground hover:box-glow-blue transition-all">Request Quote <ArrowRight className="w-4 h-4" /></a>
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