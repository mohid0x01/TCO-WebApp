import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useProjects } from "@/hooks/use-cms";
import Navbar from "@/components/Navbar";
import CyberBackground3D from "@/components/CyberBackground3D";
import FooterSection from "@/components/FooterSection";
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

const ToolDetailModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
    <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={(e) => e.stopPropagation()} className="relative glass-strong rounded-2xl max-w-3xl w-full overflow-hidden gradient-border max-h-[90vh] overflow-y-auto">
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: langColors[project.language] }} />
            <span className="font-mono-terminal text-xs text-muted-foreground uppercase">{project.language}</span>
            <span className="font-mono-terminal text-xs uppercase text-primary">{project.category}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div>
          <h2 className="font-display text-3xl md:text-4xl text-primary text-glow-blue mb-3">{project.name}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono-terminal">
            <span>⭐ {project.stars} stars</span>
            <span>📁 {project.category}</span>
          </div>
        </div>

        <p className="text-foreground/90 leading-relaxed text-lg">{project.long_description || project.description}</p>

        <div>
          <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider">Tech Stack</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {(project.tech || []).map((t) => (
              <span key={t} className="text-xs font-mono-terminal px-3 py-1.5 rounded-full border border-primary/20 text-primary/80 bg-primary/5">{t}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 text-center font-display text-sm tracking-wider uppercase py-3 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all rounded-lg">
            View on GitHub →
          </a>
        </div>
      </div>
      <div className="absolute inset-0 scanline pointer-events-none opacity-20" />
    </motion.div>
  </motion.div>
);

const Tools = () => {
  const { data: projects, isLoading } = useProjects();
  const [selected, setSelected] = useState<Project | null>(null);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...new Set((projects || []).map((p) => p.category))];
  const filtered = filter === "All" ? projects || [] : (projects || []).filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CyberBackground3D />
      <Navbar />

      <section className="relative pt-28 pb-20 px-4">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="font-mono-terminal text-sm text-primary tracking-widest uppercase">// Full Arsenal</span>
            <h1 className="font-display text-5xl md:text-7xl text-foreground mt-2 text-glow-blue">Our Tools</h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Complete collection of open-source security tools built by TeamCyberOps.</p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-mono-terminal text-xs tracking-wider uppercase px-4 py-2 rounded-lg transition-all ${
                  filter === cat ? "bg-primary/20 text-primary border border-primary/40 box-glow-blue" : "glass-card text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-20 font-mono-terminal text-primary animate-pulse">Loading tools...</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelected(project)}
                    className="glass-card rounded-xl p-6 cursor-pointer gradient-border glass-card-hover group transition-all duration-300 hover:box-glow-blue"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColors[project.language] || langColors.Unknown }} />
                        <span className="font-mono-terminal text-[10px] text-muted-foreground uppercase">{project.language}</span>
                      </div>
                      <span className="font-mono-terminal text-[10px] uppercase tracking-wider text-primary">{project.category}</span>
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(project.tech || []).slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] font-mono-terminal px-2 py-0.5 rounded-full border border-primary/15 text-primary/70 bg-primary/5">{t}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono-terminal">
                      <span className="text-muted-foreground">⭐ {project.stars}</span>
                      <span className="text-primary/60 group-hover:text-primary transition-colors">Click for details →</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <FooterSection />

      <AnimatePresence>
        {selected && <ToolDetailModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Tools;
