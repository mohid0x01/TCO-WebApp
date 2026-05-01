import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import CyberBackground3D from "@/components/CyberBackground3D";
import FooterSection from "@/components/FooterSection";
import { useService } from "@/hooks/use-cms";

const ServiceDetail = () => {
  const { slug = "" } = useParams();
  const { data: service, isLoading } = useService(slug);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />
      <section className="relative pt-28 pb-20 px-4">
        <div className="relative z-10 max-w-5xl mx-auto">
          <Link to="/services" className="inline-flex items-center gap-2 font-mono-terminal text-xs text-muted-foreground hover:text-primary mb-8"><ArrowLeft className="w-4 h-4" /> Back to services</Link>
          {isLoading ? <div className="text-center py-20 font-mono-terminal text-primary animate-pulse">Loading operation...</div> : !service ? <div className="glass-card rounded-xl p-10 text-center font-mono-terminal text-muted-foreground">Service not found.</div> : (
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="glass-card rounded-2xl p-8 md:p-10 gradient-border overflow-hidden relative">
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="relative">
                  <span className="font-mono-terminal text-xs text-primary uppercase tracking-widest">// {service.category}</span>
                  <h1 className="font-display text-5xl md:text-7xl text-foreground mt-3 text-glow-blue">{service.title}</h1>
                  <p className="text-xl text-muted-foreground mt-4 max-w-3xl">{service.long_description || service.description}</p>
                  <div className="grid sm:grid-cols-3 gap-4 mt-8">
                    {[{ label: "Price", value: service.price }, { label: "Timeline", value: service.timeline }, { label: "Level", value: service.comparison_level }].map((item) => <div key={item.label} className="rounded-xl border border-primary/15 bg-primary/5 p-4"><span className="font-mono-terminal text-[10px] text-muted-foreground uppercase">{item.label}</span><p className="font-display text-2xl text-primary">{item.value}</p></div>)}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-[1fr_320px] gap-6">
                <div className="glass-card rounded-2xl p-7 gradient-border">
                  <h2 className="font-display text-3xl text-foreground mb-5">Included Capabilities</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(service.features || []).map((feature) => <div key={feature} className="flex gap-3 rounded-lg border border-border/50 p-3 text-sm text-foreground/80"><Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />{feature}</div>)}
                  </div>
                </div>
                <aside className="glass-card rounded-2xl p-7 gradient-border h-fit sticky top-24">
                  <h3 className="font-display text-2xl text-foreground mb-3">Deliverables</h3>
                  <ul className="space-y-3 mb-6">{(service.deliverables || []).map((d) => <li key={d} className="font-mono-terminal text-xs text-muted-foreground">▸ {d}</li>)}</ul>
                  <a href="/#contact" className="block text-center font-display text-sm tracking-wider uppercase py-3 rounded-lg bg-primary text-primary-foreground hover:box-glow-blue transition-all">{service.cta_label || "Get Quote"}</a>
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
