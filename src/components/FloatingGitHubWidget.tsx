import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const GITHUB_ORG = "mohidqx";
const AVATAR_CACHE_KEY = "gh_avatar_url";
const AVATAR_CACHE_TTL = 3600_000; // 1 hour

const FloatingGitHubWidget = () => {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(`https://github.com/${GITHUB_ORG}.png?size=96`);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(AVATAR_CACHE_KEY);
      if (cached) {
        const { url, ts } = JSON.parse(cached);
        if (Date.now() - ts < AVATAR_CACHE_TTL) { setAvatarUrl(url); return; }
      }
    } catch {}
    fetch(`https://api.github.com/users/${GITHUB_ORG}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.avatar_url) {
          const url = `${d.avatar_url}&s=96`;
          setAvatarUrl(url);
          localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify({ url, ts: Date.now() }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2.5, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/40 hover:ring-primary/80 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
        aria-label="Open GitHub profile"
      >
        <img src={avatarUrl} alt="GitHub" className="w-full h-full object-cover" />
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
              Explore tools, write-ups, CTF solves and bug-bounty research from <a href={`https://github.com/${GITHUB_ORG}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@{GITHUB_ORG}</a>.
            </p>

            <div className="flex flex-col gap-2">
              <a
                href="https://teamcyberops.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-all text-sm font-mono-terminal"
              >
                <span className="flex items-center gap-2">🌐 Visit Portfolio</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <a
                href={`https://github.com/${GITHUB_ORG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-border/40 text-foreground/80 hover:bg-primary/5 transition-all text-sm font-mono-terminal"
              >
                <span className="flex items-center gap-2">⚡ GitHub @{GITHUB_ORG}</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
              <a
                href={`https://github.com/${GITHUB_ORG}?tab=repositories`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-border/40 text-foreground/80 hover:bg-primary/5 transition-all text-sm font-mono-terminal"
              >
                <span className="flex items-center gap-2">📁 Oneliners Library</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingGitHubWidget;
