import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, HelpCircle } from "lucide-react";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import CyberBackground3D from "@/components/CyberBackground3D";
import FooterSection from "@/components/FooterSection";
import { useService } from "@/hooks/use-cms";

const buildFaqs = (service: any) => [
  { q: "What happens first?", a: `Every ${service.title} operation starts with scope confirmation, authorization boundaries, and a secure kickoff.` },
  { q: "What do we receive?", a: `You receive ${((service.deliverables || ["a risk-ranked report", "remediation guidance"]).slice(0, 3)).join(", ")}.` },
  { q: "How long does it take?", a: service.timeline || "Timeline is confirmed after scoping." },
  { q: "Can this be customized?", a: "Yes. Scope, testing windows, reporting depth, and remediation support can be adjusted for your environment." },
];

const ServiceDetail = () => {
  const { slug = "" } = useParams();
  const { data: service, isLoading } = useService(slug);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -120]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />
      <section ref={ref} className="relative pt-28 pb-24 px-4 overflow-hidden">
        <motion.div style={{ y }} className="absolute right-[12%] top-32 h-64 w-64 rounded-full border border-primary/10 bg-primary/5 blur-2xl" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <Link to="/services#comparison" className="inline-flex items-center gap-2 font-mono-terminal text-xs text-muted-foreground hover:text-primary mb-8"><ArrowLeft className="w-4 h-4" /> Back to comparison</Link>
          {isLoading ? <div className="text-center py-20 font-mono-terminal text-primary animate-pulse">Loading operation...</div> : !service ? <div className="glass-card rounded-xl p-10 text-center font-mono-terminal text-muted-foreground">Service not found.</div> : (
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="glass-card rounded-2xl p-7 md:p-10 gradient-border overflow-hidden relative">
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="absolute right-0 top-0 h-48 w-48 bg-primary/10 blur-3xl" />
                <div className="relative grid lg:grid-cols-[1fr_340px] gap-8 items-end">
                  <div>
                    <span className="font-mono-terminal text-xs text-primary uppercase tracking-widest">// {service.category}</span>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-foreground mt-3 text-glow-blue">{service.title}</h1>
                    <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl leading-relaxed">{service.long_description || service.description}</p>
                  </div>
                  <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-6 box-glow-blue">
                    <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase">{service.price_label || "Pricing"}</span>
                    <p className="font-display text-5xl text-primary text-glow-blue mt-1">{service.price}</p>
                    <p className="font-mono-terminal text-xs text-muted-foreground mt-3">{service.timeline} • {service.comparison_level}</p>
                    <a href="/#contact" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground hover:box-glow-blue transition-all">{service.cta_label || "Get Quote"} <ArrowRight className="w-4 h-4" /></a>
                  </aside>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[{ label: "Overview", value: service.best_for }, { label: "Timeline", value: service.timeline }, { label: "Security Level", value: service.comparison_level }].map((item) => <div key={item.label} className="glass-card rounded-xl p-5 gradient-border"><span className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span><p className="mt-2 text-foreground/85 leading-relaxed">{item.value}</p></div>)}
              </div>

              <div className="grid lg:grid-cols-[1fr_360px] gap-6">
                <div className="space-y-6">
                  <div className="glass-card rounded-2xl p-7 gradient-border">
                    <h2 className="font-display text-3xl text-foreground mb-5">Included Capabilities</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(service.features || []).map((feature) => <div key={feature} className="flex gap-3 rounded-lg border border-border/50 p-3 text-sm text-foreground/80 bg-background/20"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />{feature}</div>)}
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-7 gradient-border">
                    <h2 className="font-display text-3xl text-foreground mb-5">FAQs</h2>
                    <div className="space-y-4">
                      {buildFaqs(service).map((faq) => <div key={faq.q} className="rounded-lg border border-border/50 p-4 bg-background/20"><div className="flex gap-3"><HelpCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" /><div><h3 className="font-display text-lg text-foreground">{faq.q}</h3><p className="text-sm text-muted-foreground mt-1 leading-relaxed">{faq.a}</p></div></div></div>)}
                    </div>
                  </div>
                </div>
                <aside className="glass-card rounded-2xl p-7 gradient-border h-fit lg:sticky lg:top-24">
                  <h3 className="font-display text-2xl text-foreground mb-3">Deliverables</h3>
                  <ul className="space-y-3 mb-7">{(service.deliverables || service.features || []).map((d: string) => <li key={d} className="flex gap-3 font-mono-terminal text-xs text-muted-foreground"><Check className="w-4 h-4 text-primary flex-shrink-0" /> {d}</li>)}</ul>
                  <Link to="/services#comparison" className="block text-center font-display text-sm tracking-wider uppercase py-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all">Back to comparison</Link>
                </aside>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      <FooterSection />
    </div>
  );
};

export default ServiceDetail;