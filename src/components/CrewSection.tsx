import { motion } from "framer-motion";

interface CrewMember {
  name: string;
  alias: string;
  role: string;
  bio: string;
  avatar: string;
}

const crew: CrewMember[] = [
  {
    name: "mohid0x01",
    alias: "Founder",
    role: "Lead Security Researcher",
    bio: "Cybersecurity enthusiast and ethical hacker. Building tools to make the internet safer, one exploit at a time.",
    avatar: "https://avatars.githubusercontent.com/u/249065981?v=4",
  },
  {
    name: "Operative-02",
    alias: "Penetration Tester",
    role: "Red Team Specialist",
    bio: "Specialized in breaking into systems so others can build them stronger. Expert in XSS, SQLi, and network exploitation.",
    avatar: "",
  },
  {
    name: "Operative-03",
    alias: "OSINT Analyst",
    role: "Intelligence Gatherer",
    bio: "Open-source intelligence specialist. Mapping digital footprints and discovering hidden attack surfaces.",
    avatar: "",
  },
];

const CrewCard = ({ member, index }: { member: CrewMember; index: number }) => {
  const slideFrom = index % 2 === 0 ? -100 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: slideFrom }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group"
    >
      <div className="relative bg-card border border-border rounded-lg overflow-hidden hover:border-glow-blue hover:box-glow-blue transition-all duration-500">
        {/* Top security clearance bar */}
        <div className="bg-secondary px-4 py-2 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono-terminal text-xs text-neon-green">CLEARANCE: ALPHA</span>
          </div>
          <span className="font-mono-terminal text-xs text-muted-foreground">ID-{String(index + 1).padStart(3, "0")}</span>
        </div>

        <div className="p-6 flex flex-col sm:flex-row gap-5">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded border-2 border-primary/30 overflow-hidden bg-secondary flex items-center justify-center">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} loading="lazy" width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg font-semibold text-foreground">{member.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono-terminal text-xs px-2 py-0.5 bg-primary/10 border border-primary/30 text-primary rounded">
                {member.alias}
              </span>
              <span className="font-mono-terminal text-xs text-muted-foreground">{member.role}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{member.bio}</p>
          </div>
        </div>

        {/* Bottom scanline effect */}
        <div className="h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};

const CrewSection = () => {
  return (
    <section className="relative py-24 px-4">
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono-terminal text-sm text-neon-red tracking-widest uppercase">// The Crew</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-2">
            Operatives
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-red to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="space-y-6">
          {crew.map((member, i) => (
            <CrewCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CrewSection;
