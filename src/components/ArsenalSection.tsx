import { motion } from "framer-motion";
import { useState } from "react";

interface Project {
  name: string;
  description: string;
  tech: string[];
  url: string;
  stars?: number;
  language: string;
}

const projects: Project[] = [
  {
    name: "JsSecretsHunter",
    description: "Scans JavaScript files to extract hidden API keys, tokens, and sensitive secrets from web applications.",
    tech: ["Python", "Regex", "Security"],
    url: "https://github.com/mohidqx/JsSecretsHunter",
    stars: 0,
    language: "Python",
  },
  {
    name: "AutoInjectX",
    description: "Fast & lightweight XSS automation tool. Streamlines payload injection, detection, and exploitation for penetration testers.",
    tech: ["Python", "XSS", "Automation"],
    url: "https://github.com/mohidqx/AutoInjectX",
    stars: 1,
    language: "Python",
  },
  {
    name: "GhostSession",
    description: "Browser extension that auto-saves and restores Instagram login sessions. Stay logged in seamlessly with zero effort.",
    tech: ["JavaScript", "Browser Ext", "Sessions"],
    url: "https://github.com/mohidqx/GhostSession",
    stars: 1,
    language: "JavaScript",
  },
  {
    name: "VulnScopeX",
    description: "Advanced vulnerability scanner engine v6.0 with automation and roadmap integration for bug bounty hunters.",
    tech: ["Python", "Scanner", "BugBounty"],
    url: "https://github.com/mohidqx/VulnScopeX",
    stars: 0,
    language: "Python",
  },
  {
    name: "NetReaper",
    description: "Network packet harvester and credential sniffer. Built for ethical network penetration testing and analysis.",
    tech: ["Python", "Networking", "Packets"],
    url: "https://github.com/mohidqx/NetReaper",
    stars: 0,
    language: "Python",
  },
  {
    name: "TeamCyberOps-Recon",
    description: "Ultimate BugBounty Intelligence Platform — browser-based recon engine for security researchers.",
    tech: ["HTML", "Recon", "OSINT"],
    url: "https://github.com/mohidqx/TeamCyberOps-Recon",
    stars: 0,
    language: "HTML",
  },
  {
    name: "NucleiFuzzer",
    description: "Advanced Web Vulnerability Scanner & Automation Framework powered by Nuclei templates.",
    tech: ["Shell", "Nuclei", "Fuzzing"],
    url: "https://github.com/mohidqx/NucleiFuzzer",
    stars: 0,
    language: "Shell",
  },
  {
    name: "Recon-Subdomain",
    description: "Single-file orchestrator for recon pipelines. Runs subdomain enumeration, probes hosts, and maps attack surfaces.",
    tech: ["Python", "Recon", "Subdomains"],
    url: "https://github.com/mohidqx/Recon-Subdomain",
    stars: 1,
    language: "Python",
  },
  {
    name: "CTF",
    description: "Collection of CTF-style web challenges focused on real-world vulnerabilities for ethical hacking practice.",
    tech: ["HTML", "CTF", "Web Security"],
    url: "https://github.com/mohidqx/CTF",
    stars: 0,
    language: "HTML",
  },
];

const langColors: Record<string, string> = {
  Python: "hsl(195 100% 50%)",
  JavaScript: "hsl(50 100% 50%)",
  HTML: "hsl(15 100% 55%)",
  Shell: "hsl(120 100% 45%)",
  Go: "hsl(195 60% 50%)",
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative bg-card border border-border rounded-lg p-6 h-full transition-all duration-300 ${
          isHovered ? "box-glow-blue border-glow-blue" : ""
        }`}
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) ${isHovered ? "translateZ(20px)" : ""}`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: langColors[project.language] || "hsl(195 100% 50%)" }}
          />
          <span className="font-mono-terminal text-xs text-muted-foreground">{project.language}</span>
        </div>

        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs font-mono-terminal px-2 py-0.5 rounded border border-primary/20 text-primary/80 bg-primary/5"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-mono-terminal text-primary hover:text-glow-blue transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          View Source
        </a>
      </div>
    </motion.div>
  );
};

const ArsenalSection = () => {
  return (
    <section id="projects" className="relative py-24 px-4">
      <div className="absolute inset-0 carbon-fiber opacity-20" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono-terminal text-sm text-primary tracking-widest uppercase">// Arsenal</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2 text-glow-blue">
            Our Weapons
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArsenalSection;
