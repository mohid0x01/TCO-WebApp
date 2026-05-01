import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import badge from "@/assets/teamcyberops-badge.jpeg";

const navLinks = [
  { label: "Mission", href: "#mission", type: "scroll" },
  { label: "Arsenal", href: "#projects", type: "scroll" },
  { label: "Services", href: "#services", type: "scroll" },
  { label: "Intel", href: "#stats", type: "scroll" },
  { label: "Crew", href: "#crew", type: "scroll" },
  { label: "Contact", href: "#contact", type: "scroll" },
];

const pageLinks = [
  { label: "Tools", href: "/tools" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (!isHome) {
      window.location.href = "/" + href;
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-lg shadow-background/50" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={badge} alt="TeamCyberOps" width={36} height={36} className="rounded-full ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all" />
              <span className="font-display text-lg text-primary text-glow-blue hidden sm:block">TEAMCYBEROPS</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button key={link.href} onClick={() => scrollTo(link.href)} className="font-mono-terminal text-xs tracking-wider uppercase px-3 py-2 text-muted-foreground hover:text-primary transition-colors relative group">
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-3/4 transition-all duration-300" />
                </button>
              ))}
              {pageLinks.map((link) => (
                <Link key={link.href} to={link.href} className={`font-mono-terminal text-xs tracking-wider uppercase px-3 py-2 transition-colors relative group ${location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-primary transition-all duration-300 ${location.pathname === link.href ? "w-3/4" : "w-0 group-hover:w-3/4"}`} />
                </Link>
              ))}
              <a href="https://github.com/mohidqx" target="_blank" rel="noopener noreferrer" className="ml-3 font-mono-terminal text-xs tracking-wider uppercase px-4 py-1.5 border border-primary/40 text-primary hover:bg-primary/10 rounded transition-all">GitHub</a>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex flex-col gap-1.5 p-2" aria-label="Toggle menu">
              <span className={`w-5 h-0.5 bg-primary transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-5 h-0.5 bg-primary transition-all ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-0.5 bg-primary transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-16 left-0 right-0 z-40 glass-strong border-b border-border md:hidden">
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button key={link.href} onClick={() => scrollTo(link.href)} className="font-mono-terminal text-sm tracking-wider uppercase px-4 py-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors text-left">{link.label}</button>
              ))}
              {pageLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="font-mono-terminal text-sm tracking-wider uppercase px-4 py-3 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors text-left">{link.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
