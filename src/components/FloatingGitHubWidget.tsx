import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { useGitHubAvatar } from "@/hooks/use-github-avatar";

const GITHUB_ORG = "mohidqx";

const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const WidgetLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group/link relative flex items-center justify-between px-4 py-2.5 rounded-xl border border-border/40 text-foreground/80 overflow-hidden transition-all text-sm font-mono-terminal hover:border-primary/30 hover:text-primary"
  >
    <span className="absolute inset-0 bg-primary/0 group-hover/link:bg-primary/5 transition-colors duration-300" />
    <span className="absolute inset-0 rounded-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),hsl(var(--primary)/0.12)_0%,transparent_60%)]" />
    <span className="relative flex items-center gap-2">{children}</span>
    <ExternalIcon />
  </a>
);

const FloatingGitHubWidget = () => {
  const [open, setOpen] = useState(false);
  const avatarUrl = useGitHubAvatar();

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={(e) => {
          // Ripple effect
          const btn = e.currentTarget;
          const circle = document.createElement("span");
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const size = Math.max(rect.width, rect.height) * 2;
          circle.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;background:hsl(var(--primary)/0.35);transform:scale(0);animation:widget-ripple 0.6s ease-out forwards;pointer-events:none;z-index:10;`;
          btn.appendChild(circle);
          setTimeout(() => circle.remove(), 650);
          setOpen((v) => !v);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/40 hover:ring-primary/80 shadow-lg shadow-primary/20 hover:shadow-[0_0_28px_hsl(var(--primary)/0.45)] transition-all duration-300 active:scale-90"
        aria-label="Open GitHub profile"
      >
        <span className="absolute inset-0 rounded-full animate-ping bg-primary/20 pointer-events-none" style={{ animationDuration: "3s" }} />
        <img src={avatarUrl} alt="GitHub" className="relative w-full h-full object-cover" />
      </motion.button>

      {/* Popup card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-80 glass-strong rounded-2xl p-5 border border-primary/20 shadow-2xl"
          >
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img src={avatarUrl} alt="TeamCyberOps" className="w-12 h-12 rounded-full ring-2 ring-primary/30" />
              <div>
                <h3 className="font-display text-base text-foreground">TeamCyberOps</h3>
                <p className="text-xs text-muted-foreground">Offensive Security · OSINT · BugBounty</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Explore tools, write-ups, CTF solves and bug-bounty research from{" "}
              <a href={`https://github.com/${GITHUB_ORG}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@{GITHUB_ORG}</a>.
            </p>

            <div className="flex flex-col gap-2">
              <WidgetLink href="https://teamcyberops.lovable.app">🌐 Visit Portfolio</WidgetLink>
              <WidgetLink href={`https://github.com/${GITHUB_ORG}`}>⚡ GitHub @{GITHUB_ORG}</WidgetLink>
              <WidgetLink href={`https://github.com/${GITHUB_ORG}?tab=repositories`}>📁 Oneliners Library</WidgetLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingGitHubWidget;
