import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

const stats: Stat[] = [
  { label: "Threats Neutralized", value: 1247, suffix: "+", icon: "🛡️" },
  { label: "Tools Developed", value: 26, suffix: "", icon: "⚔️" },
  { label: "Lines of Code", value: 85420, suffix: "+", icon: "💻" },
  { label: "Vulnerabilities Found", value: 342, suffix: "+", icon: "🔍" },
];

const AnimatedCounter = ({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span className="font-display text-4xl md:text-5xl text-primary text-glow-blue tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const MatrixColumn = ({ delay, left }: { delay: number; left: string }) => {
  const chars = "01アイウエオカキクケコ";
  const text = Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join("\n");
  return (
    <div
      className="absolute top-0 font-mono text-xs text-neon-green/15 whitespace-pre leading-4 pointer-events-none select-none"
      style={{
        left,
        animation: `matrix-fall ${6 + Math.random() * 4}s linear ${delay}s infinite`,
      }}
    >
      {text}
    </div>
  );
};

const StatsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const matrixCols = Array.from({ length: 25 }, (_, i) => ({
    delay: Math.random() * 5,
    left: `${(i / 25) * 100}%`,
  }));

  return (
    <section id="stats" className="relative py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-30 overflow-hidden">
        {matrixCols.map((col, i) => (
          <MatrixColumn key={i} delay={col.delay} left={col.left} />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background z-[1]" />

      <div ref={ref} className="relative z-[2] max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono-terminal text-sm text-neon-green tracking-widest uppercase">// Live Intel</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-2">
            Operations Dashboard
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-xl p-6 text-center gradient-border"
            >
              <div className="text-2xl mb-3">{stat.icon}</div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
              <p className="font-mono-terminal text-[10px] text-muted-foreground mt-3 tracking-wider uppercase leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
