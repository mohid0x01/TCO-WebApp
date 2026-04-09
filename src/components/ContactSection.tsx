import { motion } from "framer-motion";
import { useState } from "react";
import { useSiteContent } from "@/hooks/use-cms";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const { data: content } = useSiteContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setStatus("sending");
    const subject = encodeURIComponent(`[TeamCyberOps Contact] Message from ${name.trim()}`);
    const body = encodeURIComponent(`Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`);
    window.open(`mailto:contact@teamcyberops.org?subject=${subject}&body=${body}`, "_self");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => { setStatus("idle"); setName(""); setEmail(""); setMessage(""); }, 3000);
    }, 1000);
  };

  return (
    <section id="contact" className="relative py-28 px-4">
      <div className="absolute inset-0 carbon-fiber opacity-10" />
      <div className="relative max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="font-mono-terminal text-sm text-primary tracking-widest uppercase">{content?.contact_label || "// Comms Channel"}</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-2">{content?.contact_title || "Get In Touch"}</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl overflow-hidden gradient-border">
          <div className="bg-secondary/50 px-5 py-3 flex items-center gap-3 border-b border-border/50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-red/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-neon-green/60" />
            </div>
            <span className="font-mono-terminal text-[10px] text-muted-foreground tracking-wider">secure_comms.sh — TeamCyberOps</span>
          </div>

          <div className="p-6 md:p-8">
            <div className="font-mono-terminal text-xs text-muted-foreground mb-6">
              <span className="text-neon-green">root@cyberops</span>:<span className="text-primary">~</span><span className="text-muted-foreground">$ ./init_secure_channel.sh</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "AGENT_NAME", value: name, set: setName, type: "text", placeholder: "Enter your callsign..." },
                { label: "SECURE_EMAIL", value: email, set: setEmail, type: "email", placeholder: "your@email.com" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    <span className="text-primary">$</span> {f.label}
                  </label>
                  <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={f.placeholder} required maxLength={255} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 font-mono-terminal text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" />
                </div>
              ))}
              <div>
                <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  <span className="text-primary">$</span> TRANSMISSION
                </label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your encrypted message..." required maxLength={1000} rows={5} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 font-mono-terminal text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none" />
              </div>
              <button type="submit" disabled={status !== "idle"} className="w-full font-display text-sm tracking-[0.2em] uppercase py-3.5 bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:box-glow-blue disabled:opacity-50 transition-all duration-300 rounded-lg">
                {status === "idle" && ">> Transmit Message <<"}
                {status === "sending" && "Encrypting..."}
                {status === "sent" && "✓ Transmission Complete"}
              </button>
            </form>
            <div className="font-mono-terminal text-[10px] text-muted-foreground/50 mt-4 text-center">
              All transmissions are encrypted end-to-end // PGP keys available on request
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
