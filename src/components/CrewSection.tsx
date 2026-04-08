import { motion } from "framer-motion";

interface CrewMember {
  name: string;
  alias: string;
  role: string;
  bio: string;
  avatar: string;
  certs: string[];
  github?: string;
  location?: string;
}

const crew: CrewMember[] = [
  {
    name: "mohid0x01",
    alias: "Founder & Lead",
    role: "Lead Security Researcher",
    bio: "Cybersecurity enthusiast and ethical hacker building cutting-edge security tools. Certified professional with expertise in penetration testing, bug bounty hunting, and offensive security research. Passionate about making the internet safer one exploit at a time.",
    avatar: "https://avatars.githubusercontent.com/u/249065981?v=4",
    certs: ["C|EH", "C|SSP", "eJPT", "ISC2"],
    github: "https://github.com/mohid0x01",
    location: "Pakistan 🇵🇰",
  },
  {
    name: "Operative-02",
    alias: "Red Team Specialist",
    role: "Penetration Tester",
    bio: "Specialized in breaking into systems so others can build them stronger. Expert in XSS, SQL injection, and advanced network exploitation techniques. Conducts comprehensive security assessments and develops custom exploitation frameworks.",
    avatar: "",
    certs: ["OSCP", "eWPT"],
  },
  {
    name: "Operative-03",
    alias: "OSINT Analyst",
    role: "Intelligence Gatherer",
    bio: "Open-source intelligence specialist focused on mapping digital footprints, discovering hidden attack surfaces, and conducting comprehensive reconnaissance operations. Develops automated OSINT pipelines and threat intelligence tools.",
    avatar: "",
    certs: ["GOSI", "OSINT+"],
  },
];

const CrewCard = ({ member, index }: { member: CrewMember; index: number }) => {
  const slideFrom = index % 2 === 0 ? -80 : 80;

  return (
    <motion.div
      initial={{ opacity: 0, x: slideFrom }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      className="group"
    >
      <div className="relative glass-card rounded-xl overflow-hidden gradient-border glass-card-hover transition-all duration-500">
        {/* Top security clearance bar */}
        <div className="bg-secondary/50 px-5 py-2.5 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono-terminal text-[10px] text-neon-green tracking-widest">CLEARANCE: ALPHA</span>
          </div>
          <span className="font-mono-terminal text-[10px] text-muted-foreground">AGENT-{String(index + 1).padStart(3, "0")}</span>
        </div>

        <div className="p-6 flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg border border-primary/20 overflow-hidden bg-secondary/30 flex items-center justify-center relative group-hover:border-primary/40 transition-colors">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} loading="lazy" width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-background">
                  <svg className="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              {/* Scan line effect */}
              <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-b from-primary/30 to-transparent" style={{ animation: "scan 2s linear infinite" }} />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-display text-xl text-foreground">{member.name}</h3>
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="font-mono-terminal text-[10px] px-2.5 py-0.5 bg-primary/10 border border-primary/25 text-primary rounded-full">
                {member.alias}
              </span>
              <span className="font-mono-terminal text-[10px] text-muted-foreground">{member.role}</span>
              {member.location && (
                <span className="font-mono-terminal text-[10px] text-muted-foreground">• {member.location}</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{member.bio}</p>

            {/* Certs */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {member.certs.map((cert) => (
                <span key={cert} className="text-[10px] font-mono-terminal px-2 py-0.5 rounded-full border border-neon-green/20 text-neon-green/70 bg-neon-green/5">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="h-px bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};

const CrewSection = () => {
  return (
    <section id="crew" className="relative py-28 px-4">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono-terminal text-sm text-neon-red tracking-widest uppercase">// The Crew</span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-2">
            Operatives
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm">
            The team behind TeamCyberOps — security researchers, pentesters, and digital defenders.
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-neon-red to-transparent mx-auto mt-6" />
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
