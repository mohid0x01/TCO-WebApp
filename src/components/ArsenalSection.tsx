import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { useProjects, useSiteContent } from "@/hooks/use-cms";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const langColors: Record<string, string> = {
  Python: "hsl(195 100% 50%)",
  JavaScript: "hsl(50 100% 50%)",
  HTML: "hsl(15 100% 55%)",
  Shell: "hsl(120 100% 45%)",
  Go: "hsl(195 60% 50%)",
  TypeScript: "hsl(210 80% 55%)",
  Unknown: "hsl(210 10% 50%)",
};

const categoryColors: Record<string, string> = {
  Reconnaissance: "text-neon-green",
  Exploitation: "text-neon-red",
  "Browser Tools": "text-primary",
  Scanning: "text-primary",
  "Network Security": "text-neon-red",
  Training: "text-neon-green",
  Tools: "text-primary",
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
        className={`relative glass-card rounded-xl p-6 h-full cursor-pointer transition-all duration-300 gradient-border glass-card-hover ${isHovered ? "box-glow-blue" : ""}`}
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) ${isHovered ? "translateZ(10px) scale(1.02)" : ""}`,
          transformStyle: "preserve-3d",
          transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
        }}
        onClick={onOpen}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[project.language] || langColors.Unknown }} />
            <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase">{project.language}</span>
          </div>
          <span className={`font-mono-terminal text-[10px] uppercase tracking-wider ${categoryColors[project.category] || "text-primary"}`}>
            {project.category}
          </span>
        </div>
        <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(project.tech || []).slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] font-mono-terminal px-2 py-0.5 rounded-full border border-primary/15 text-primary/70 bg-primary/5">{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-2 text-xs font-mono-terminal text-primary/80 hover:text-primary transition-all">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            Source
          </a>
          <span className="text-[10px] font-mono-terminal text-muted-foreground group-hover:text-primary/60 transition-colors">Click for details →</span>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
    <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={(e) => e.stopPropagation()} className="relative glass-strong rounded-2xl max-w-2xl w-full overflow-hidden gradient-border">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: langColors[project.language] }} />
            <span className="font-mono-terminal text-xs text-muted-foreground uppercase">{project.language}</span>
            <span className={`font-mono-terminal text-xs uppercase ${categoryColors[project.category]}`}>{project.category}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <h2 className="font-display text-3xl text-primary text-glow-blue mb-2">{project.name}</h2>
      </div>
      <div className="p-6 space-y-5">
        <p className="text-foreground/90 leading-relaxed">{project.long_description || project.description}</p>
        <div>
          <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider">Tech Stack</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {(project.tech || []).map((t) => (
              <span key={t} className="text-xs font-mono-terminal px-3 py-1 rounded-full border border-primary/20 text-primary/80 bg-primary/5">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 text-center font-display text-sm tracking-wider uppercase py-3 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all rounded-lg">
            View on GitHub →
          </a>
        </div>
      </div>
      <div className="absolute inset-0 scanline pointer-events-none opacity-30" />
    </motion.div>
  </motion.div>
);

const ArsenalSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: projects } = useProjects();
  const { data: content } = useSiteContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="projects" ref={ref} className="relative py-28 px-4">
      <div className="absolute inset-0 carbon-fiber opacity-10" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div style={{ y }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="font-mono-terminal text-sm text-primary tracking-widest uppercase">{content?.arsenal_label || "// Arsenal"}</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-2 text-glow-blue">{content?.arsenal_title || "Our Weapons"}</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm">{content?.arsenal_description || "Open-source security tools."}</p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projects || []).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpen={() => setSelectedProject(project)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default ArsenalSection;
