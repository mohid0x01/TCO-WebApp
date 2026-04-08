import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Project {
  name: string;
  description: string;
  longDescription: string;
  tech: string[];
  url: string;
  stars: number;
  language: string;
  category: string;
}

const projects: Project[] = [
  {
    name: "JsSecretsHunter",
    description: "Scans JavaScript files to extract hidden API keys, tokens, and sensitive secrets from web applications.",
    longDescription: "JsSecretsHunter is a powerful reconnaissance tool designed for security researchers and bug bounty hunters. It crawls and analyzes JavaScript files to detect exposed API keys, authentication tokens, AWS secrets, database credentials, and other sensitive information that developers accidentally leave in client-side code. Features regex-based pattern matching with customizable rules and JSON/CSV export.",
    tech: ["Python", "Regex", "OSINT", "Secrets Detection"],
    url: "https://github.com/mohidqx/JsSecretsHunter",
    stars: 0,
    language: "Python",
    category: "Reconnaissance",
  },
  {
    name: "AutoInjectX",
    description: "Fast & lightweight XSS automation tool. Streamlines payload injection, detection, and exploitation.",
    longDescription: "AutoInjectX (XSS-Automator) is a fast and lightweight tool for automating cross-site scripting (XSS) testing. It streamlines the entire workflow of payload injection, detection, and exploitation for security researchers and penetration testers. Supports reflected, stored, and DOM-based XSS with custom payload lists and multi-threaded scanning.",
    tech: ["Python", "XSS", "Automation", "Pen Testing"],
    url: "https://github.com/mohidqx/AutoInjectX",
    stars: 1,
    language: "Python",
    category: "Exploitation",
  },
  {
    name: "GhostSession",
    description: "Browser extension that auto-saves and restores login sessions seamlessly.",
    longDescription: "GhostSession is a lightweight browser extension that automatically saves and restores your Instagram login sessions. No need to re-enter credentials — stay logged in seamlessly across browser restarts. Built with pure JavaScript using the browser extension API, it securely stores session cookies and handles automatic session restoration.",
    tech: ["JavaScript", "Browser Extension", "Sessions", "Cookies"],
    url: "https://github.com/mohidqx/GhostSession",
    stars: 1,
    language: "JavaScript",
    category: "Browser Tools",
  },
  {
    name: "VulnScopeX",
    description: "Advanced vulnerability scanner engine v6.0 with automation and roadmap integration.",
    longDescription: "VulnScopeX is an advanced vulnerability scanning engine (v6.0) with built-in automation pipelines and roadmap integration designed specifically for bug bounty hunters. It combines multiple scanning techniques including port scanning, directory brute-forcing, and vulnerability detection into a single unified platform with automated reporting.",
    tech: ["Python", "Scanner", "Bug Bounty", "Automation"],
    url: "https://github.com/mohidqx/VulnScopeX",
    stars: 0,
    language: "Python",
    category: "Scanning",
  },
  {
    name: "NetReaper",
    description: "Network packet harvester and credential sniffer for ethical penetration testing.",
    longDescription: "NetReaper is a network analysis tool built for ethical penetration testing. It captures and analyzes network packets in real-time to identify potential credential leaks, unencrypted data transmissions, and network security misconfigurations. Designed for authorized security assessments with detailed logging and export capabilities.",
    tech: ["Python", "Networking", "Packets", "Sniffing"],
    url: "https://github.com/mohidqx/NetReaper",
    stars: 0,
    language: "Python",
    category: "Network Security",
  },
  {
    name: "TeamCyberOps-Recon",
    description: "Ultimate BugBounty Intelligence Platform — browser-based recon engine.",
    longDescription: "CyberOps-Recon-v14.6 is the Ultimate BugBounty Intelligence Platform. An advanced, browser-based reconnaissance engine designed for security researchers that combines subdomain enumeration, port scanning, technology fingerprinting, and vulnerability assessment into a single web interface. Features real-time results streaming and collaborative features.",
    tech: ["HTML", "JavaScript", "Recon", "OSINT"],
    url: "https://github.com/mohidqx/TeamCyberOps-Recon",
    stars: 0,
    language: "HTML",
    category: "Reconnaissance",
  },
  {
    name: "NucleiFuzzer",
    description: "Advanced Web Vulnerability Scanner & Automation Framework powered by Nuclei.",
    longDescription: "NucleiFuzzer is an advanced web vulnerability scanner and automation framework that leverages Nuclei templates for comprehensive security testing. It automates the entire fuzzing pipeline from target discovery to vulnerability verification, supporting custom templates, rate limiting, and integration with popular bug bounty platforms.",
    tech: ["Shell", "Nuclei", "Fuzzing", "CVE Detection"],
    url: "https://github.com/mohidqx/NucleiFuzzer",
    stars: 0,
    language: "Shell",
    category: "Scanning",
  },
  {
    name: "Recon-Subdomain",
    description: "Single-file orchestrator for recon pipelines — subdomain enumeration & probing.",
    longDescription: "Recon Command Center is a single-file orchestrator for common reconnaissance pipelines. It runs traditional subdomain enumeration tools, probes discovered hosts, identifies live services, and maps attack surfaces automatically. Integrates with amass, subfinder, httpx, and nuclei for a complete recon workflow.",
    tech: ["Python", "Recon", "Subdomains", "DNS"],
    url: "https://github.com/mohidqx/Recon-Subdomain",
    stars: 1,
    language: "Python",
    category: "Reconnaissance",
  },
  {
    name: "CTF",
    description: "Collection of CTF-style web challenges for ethical hacking practice.",
    longDescription: "A comprehensive collection of CTF-style web challenges focused on real-world vulnerabilities. Designed for learning ethical hacking, practicing bug-hunting skills, and exploring common web security flaws including SQL injection, XSS, CSRF, SSRF, and authentication bypasses. Each challenge includes difficulty ratings and detailed writeups.",
    tech: ["HTML", "CTF", "Web Security", "Challenges"],
    url: "https://github.com/mohidqx/CTF",
    stars: 0,
    language: "HTML",
    category: "Training",
  },
];

const langColors: Record<string, string> = {
  Python: "hsl(195 100% 50%)",
  JavaScript: "hsl(50 100% 50%)",
  HTML: "hsl(15 100% 55%)",
  Shell: "hsl(120 100% 45%)",
  Go: "hsl(195 60% 50%)",
};

const categoryColors: Record<string, string> = {
  Reconnaissance: "text-neon-green",
  Exploitation: "text-neon-red",
  "Browser Tools": "text-primary",
  Scanning: "text-primary",
  "Network Security": "text-neon-red",
  Training: "text-neon-green",
};

const ProjectCard = ({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTilt({ x, y });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setIsHovered(false); }}
    >
      <div
        className={`relative glass-card rounded-xl p-6 h-full cursor-pointer transition-all duration-300 gradient-border glass-card-hover ${
          isHovered ? "box-glow-blue" : ""
        }`}
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) ${isHovered ? "translateZ(10px) scale(1.02)" : ""}`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
        }}
        onClick={onOpen}
      >
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[project.language] || "hsl(195 100% 50%)" }} />
            <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase">{project.language}</span>
          </div>
          <span className={`font-mono-terminal text-[10px] uppercase tracking-wider ${categoryColors[project.category] || "text-primary"}`}>
            {project.category}
          </span>
        </div>

        <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] font-mono-terminal px-2 py-0.5 rounded-full border border-primary/15 text-primary/70 bg-primary/5">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 text-xs font-mono-terminal text-primary/80 hover:text-primary transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Source
          </a>
          <span className="text-[10px] font-mono-terminal text-muted-foreground group-hover:text-primary/60 transition-colors">
            Click for details →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative glass-strong rounded-2xl max-w-2xl w-full overflow-hidden gradient-border"
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: langColors[project.language] }} />
              <span className="font-mono-terminal text-xs text-muted-foreground uppercase">{project.language}</span>
              <span className={`font-mono-terminal text-xs uppercase ${categoryColors[project.category]}`}>{project.category}</span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="font-display text-3xl text-primary text-glow-blue mb-2">{project.name}</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-foreground/90 leading-relaxed">{project.longDescription}</p>

          <div>
            <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider">Tech Stack</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tech.map((t) => (
                <span key={t} className="text-xs font-mono-terminal px-3 py-1 rounded-full border border-primary/20 text-primary/80 bg-primary/5">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center font-display text-sm tracking-wider uppercase py-3 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all rounded-lg"
            >
              View on GitHub →
            </a>
          </div>
        </div>

        {/* Scanline overlay */}
        <div className="absolute inset-0 scanline pointer-events-none opacity-30" />
      </motion.div>
    </motion.div>
  );
};

const ArsenalSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative py-28 px-4">
      <div className="absolute inset-0 carbon-fiber opacity-10" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono-terminal text-sm text-primary tracking-widest uppercase">// Arsenal</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-2 text-glow-blue">
            Our Weapons
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm">
            Open-source security tools built for researchers, pentesters, and bug bounty hunters.
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} onOpen={() => setSelectedProject(project)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ArsenalSection;
