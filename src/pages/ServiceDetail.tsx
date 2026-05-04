import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, HelpCircle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CyberBackground3D from "@/components/CyberBackground3D";
import FooterSection from "@/components/FooterSection";
import { useService } from "@/hooks/use-cms";
import { Skeleton } from "@/components/ui/skeleton";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const buildFaqs = (service: any) => [
  { q: "What happens first?", a: `Every ${service.title} operation starts with scope confirmation, authorization boundaries, and a secure kickoff.` },
  { q: "What do we receive?", a: `You receive ${((service.deliverables || ["a risk-ranked report", "remediation guidance"]).slice(0, 3)).join(", ")}.` },
  { q: "How long does it take?", a: service.timeline || "Timeline is confirmed after scoping." },
  { q: "Can this be customized?", a: "Yes. Scope, testing windows, reporting depth, and remediation support can be adjusted for your environment." },
];

const FaqSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="rounded-lg border border-border/50 bg-background/20 px-4 py-4">
        <Skeleton className="h-6 w-3/4 bg-muted/30" />
      </div>
    ))}
  </div>
);

const ServiceSkeleton = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="glass-card rounded-2xl p-7 md:p-10 gradient-border">
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24 bg-muted/30" />
          <Skeleton className="h-16 w-3/4 bg-muted/30" />
          <Skeleton className="h-20 w-full bg-muted/30" />
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
          <Skeleton className="h-4 w-16 bg-muted/30" />
          <Skeleton className="h-12 w-32 bg-muted/30" />
          <Skeleton className="h-10 w-full bg-muted/30" />
        </div>
      </div>
    </div>
    <div className="grid md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => <div key={i} className="glass-card rounded-xl p-5"><Skeleton className="h-4 w-16 bg-muted/30 mb-2" /><Skeleton className="h-8 w-full bg-muted/30" /></div>)}
    </div>
    <FaqSkeleton />
  </div>
);

const FaqAccordionItem = ({ faq, index, slug, isOpen, onToggle }: { faq: { q: string; a: string }; index: number; slug: string; isOpen: boolean; onToggle: () => void }) => {
  const faqId = `faq-${slugify(faq.q)}`;
  return (
    <div id={faqId} className="rounded-lg border border-border/50 bg-background/20 overflow-hidden scroll-mt-24" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-primary/5 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${index}`}
      >
        <span className="flex items-center gap-3 font-display text-lg text-foreground">
          <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" />
          <a href={`/services/${slug}#${faqId}`} onClick={(e) => e.stopPropagation()} className="hover:text-primary transition-colors" itemProp="name">{faq.q}</a>
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-content-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
            itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
          >
            <p className="px-4 pb-4 pl-11 text-sm text-muted-foreground leading-relaxed" itemProp="text">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceDetail = () => {
  const { slug = "" } = useParams();
  const { data: service, isLoading } = useService(slug);
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const faqs = service ? buildFaqs(service) : [];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Open FAQ from hash
  useEffect(() => {
    if (!service || !location.hash) return;
    const hash = location.hash.slice(1);
    const idx = faqs.findIndex((f) => `faq-${slugify(f.q)}` === hash);
    if (idx >= 0) {
      setOpenFaq(idx);
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
    }
  }, [service, location.hash]);

  const faqSchema = service ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  } : null;

  const handleCtaClick = (tier?: string) => {
    const params = new URLSearchParams();
    if (service) params.set("service", service.title);
    if (tier) params.set("tier", tier);
    navigate(`/?${params.toString()}#contact`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />
      <section ref={ref} className="relative pt-28 pb-24 px-4 overflow-hidden">
        <motion.div style={{ y }} className="absolute right-[12%] top-32 h-64 w-64 rounded-full border border-primary/10 bg-primary/5 blur-2xl" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <Link to="/services#comparison" className="inline-flex items-center gap-2 font-mono-terminal text-xs text-muted-foreground hover:text-primary mb-8"><ArrowLeft className="w-4 h-4" /> Back to comparison</Link>
          {isLoading ? <ServiceSkeleton /> : !service ? <div className="glass-card rounded-xl p-10 text-center font-mono-terminal text-muted-foreground">Service not found.</div> : (
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
                    <button onClick={() => handleCtaClick(service.comparison_level)} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground hover:box-glow-blue transition-all">{service.cta_label || "Get Quote"} <ArrowRight className="w-4 h-4" /></button>
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
                      {(service.features || []).map((feature: string) => <div key={feature} className="flex gap-3 rounded-lg border border-border/50 p-3 text-sm text-foreground/80 bg-background/20"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />{feature}</div>)}
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-7 gradient-border">
                    <h2 className="font-display text-3xl text-foreground mb-5">FAQs</h2>
                    <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
                      {faqs.map((faq, index) => (
                        <FaqAccordionItem
                          key={faq.q}
                          faq={faq}
                          index={index}
                          slug={slug}
                          isOpen={openFaq === index}
                          onToggle={() => setOpenFaq(openFaq === index ? null : index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <aside className="glass-card rounded-2xl p-7 gradient-border h-fit lg:sticky lg:top-24">
                  <h3 className="font-display text-2xl text-foreground mb-3">Deliverables</h3>
                  <ul className="space-y-3 mb-7">{(service.deliverables || service.features || []).map((d: string) => <li key={d} className="flex gap-3 font-mono-terminal text-xs text-muted-foreground"><Check className="w-4 h-4 text-primary flex-shrink-0" /> {d}</li>)}</ul>
                  <button onClick={() => handleCtaClick()} className="block w-full text-center font-display text-sm tracking-wider uppercase py-3 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-all">Request Quote →</button>
                  <Link to="/services#comparison" className="block text-center font-display text-xs tracking-wider uppercase py-2 mt-2 text-muted-foreground hover:text-primary transition-colors">Back to comparison</Link>
                </aside>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <FooterSection />
    </div>
  );
};

export default ServiceDetail;
