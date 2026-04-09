import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CyberBackground3D from "@/components/CyberBackground3D";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CyberBackground3D />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-border/50 glass-strong">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="font-display text-lg text-primary text-glow-blue">
              ← TEAMCYBEROPS
            </Link>
            <span className="font-mono-terminal text-xs text-muted-foreground">LEGAL // TERMS</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-6xl text-primary text-glow-blue mb-4">
              Terms & Conditions
            </h1>
            <p className="font-mono-terminal text-xs text-muted-foreground mb-12">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-8">
              {[
                {
                  title: "1. Acceptance of Terms",
                  content: "By accessing and using TeamCyberOps tools, websites, and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree, you must not use our services."
                },
                {
                  title: "2. Ethical Use Policy",
                  content: "All tools and resources provided by TeamCyberOps are intended strictly for ethical and legal purposes including authorized penetration testing, security research, bug bounty programs, and educational training. You agree NOT to use our tools for unauthorized access to systems, data theft, or any illegal activity. Violation of this policy may result in immediate termination of access and reporting to authorities."
                },
                {
                  title: "3. Intellectual Property",
                  content: "All tools, code, documentation, and content created by TeamCyberOps are protected under applicable open-source licenses (as specified in each repository). You may use, modify, and distribute our open-source tools in accordance with their respective licenses. The TeamCyberOps name, logo, and branding are proprietary and may not be used without written permission."
                },
                {
                  title: "4. Disclaimer of Warranties",
                  content: "Our tools and services are provided \"AS IS\" without any warranties of any kind. TeamCyberOps does not guarantee that our tools will be error-free, secure, or uninterrupted. We are not responsible for any damages resulting from the use or inability to use our tools."
                },
                {
                  title: "5. Limitation of Liability",
                  content: "TeamCyberOps and its members shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our tools or services. Users assume full responsibility for the use of our tools and any consequences thereof."
                },
                {
                  title: "6. User Responsibilities",
                  content: "Users must obtain proper authorization before conducting any security testing. Users must comply with all applicable local, national, and international laws. Users must not use our tools to target systems without explicit written consent from the system owner."
                },
                {
                  title: "7. Privacy",
                  content: "We respect your privacy. We do not collect personal data through our tools unless explicitly stated. Any data submitted through our contact forms is used solely for communication purposes and is not shared with third parties."
                },
                {
                  title: "8. Changes to Terms",
                  content: "TeamCyberOps reserves the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the new terms."
                },
                {
                  title: "9. Contact",
                  content: "For questions about these Terms & Conditions, contact us through our website or reach out via our social media channels."
                },
              ].map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-xl p-6 gradient-border"
                >
                  <h2 className="font-display text-xl text-foreground mb-3">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">{section.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
