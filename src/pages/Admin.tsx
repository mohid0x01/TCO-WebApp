import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  useSiteContent,
  useProjects,
  useTeamMembers,
  useSocialLinks,
  useUpdateContent,
  useUpsertProject,
  useDeleteProject,
  useUpsertTeamMember,
  useDeleteTeamMember,
  useUpsertSocialLink,
  useDeleteSocialLink,
  useSyncGitHub,
} from "@/hooks/use-cms";
import CyberBackground3D from "@/components/CyberBackground3D";

const ADMIN_KEY = "teamcyberops2024";

const Admin = () => {
  const [params] = useSearchParams();
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"content" | "projects" | "team" | "social">("content");

  useEffect(() => {
    if (params.get("key") === ADMIN_KEY) setAuthed(true);
  }, [params]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <CyberBackground3D />
        <div className="relative z-10 glass-card rounded-2xl p-8 max-w-md w-full gradient-border text-center">
          <h1 className="font-display text-3xl text-primary text-glow-blue mb-4">ACCESS DENIED</h1>
          <p className="text-muted-foreground font-mono-terminal text-sm">Invalid or missing access key.</p>
          <p className="text-muted-foreground/50 font-mono-terminal text-xs mt-4">Use: /admin?key=YOUR_SECRET_KEY</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "content" as const, label: "Site Content" },
    { id: "projects" as const, label: "Projects" },
    { id: "team" as const, label: "Team" },
    { id: "social" as const, label: "Social Links" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CyberBackground3D />
      <div className="relative z-10">
        <div className="border-b border-border/50 glass-strong sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-xl text-primary text-glow-blue">CMS DASHBOARD</h1>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono-terminal text-[10px] text-neon-green">ADMIN</span>
              </div>
            </div>
            <a href="/" className="font-mono-terminal text-xs text-muted-foreground hover:text-primary transition-colors">
              ← Back to Site
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`font-mono-terminal text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg transition-all ${
                  tab === t.id
                    ? "bg-primary/20 text-primary border border-primary/40 box-glow-blue"
                    : "glass-card text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "content" && <ContentTab />}
          {tab === "projects" && <ProjectsTab />}
          {tab === "team" && <TeamTab />}
          {tab === "social" && <SocialTab />}
        </div>
      </div>
    </div>
  );
};

// ---- Content Tab ----
const ContentTab = () => {
  const { data: content, isLoading } = useSiteContent();
  const updateMut = useUpdateContent();
  const [edits, setEdits] = useState<Record<string, string>>({});

  if (isLoading) return <Loading />;

  const sections = new Set<string>();
  const allContent: { key: string; value: string; section: string }[] = [];

  // We need raw data for sections
  const { data: rawData } = supabase.from ? { data: null } : { data: null };

  // Group by section from keys
  const grouped: Record<string, string[]> = {};
  if (content) {
    Object.keys(content).forEach((key) => {
      const section = key.split("_")[0] || "general";
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(key);
    });
  }

  const handleSave = (key: string) => {
    if (edits[key] !== undefined) {
      updateMut.mutate({ key, value: edits[key] });
      setEdits((prev) => {
        const n = { ...prev };
        delete n[key];
        return n;
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-foreground">Site Content</h2>
      <p className="text-muted-foreground text-sm">Edit any text on the website. Changes are live instantly.</p>
      
      {Object.entries(grouped).map(([section, keys]) => (
        <div key={section} className="glass-card rounded-xl p-6 gradient-border">
          <h3 className="font-display text-lg text-primary mb-4 capitalize">{section}</h3>
          <div className="space-y-4">
            {keys.sort().map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider">
                  {key.replace(/_/g, " ")}
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                    value={edits[key] ?? content?.[key] ?? ""}
                    onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                  />
                  {edits[key] !== undefined && (
                    <button
                      onClick={() => handleSave(key)}
                      disabled={updateMut.isPending}
                      className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---- Projects Tab ----
const ProjectsTab = () => {
  const { data: projects, isLoading } = useProjects();
  const upsertMut = useUpsertProject();
  const deleteMut = useDeleteProject();
  const syncMut = useSyncGitHub();
  const [editing, setEditing] = useState<any | null>(null);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl text-foreground">Projects</h2>
        <div className="flex gap-2">
          <button
            onClick={() => syncMut.mutate()}
            disabled={syncMut.isPending}
            className="font-mono-terminal text-xs px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg hover:bg-neon-green/20 transition-all"
          >
            {syncMut.isPending ? "Syncing..." : "🔄 Sync GitHub"}
          </button>
          <button
            onClick={() => setEditing({ name: "", description: "", long_description: "", tech: [], github_url: "", language: "Python", category: "Tools", stars: 0, is_visible: true, order_index: (projects?.length || 0) + 1 })}
            className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all"
          >
            + Add Project
          </button>
        </div>
      </div>

      {editing && (
        <ProjectForm
          project={editing}
          onSave={(p) => { upsertMut.mutate(p); setEditing(null); }}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="grid gap-4">
        {projects?.map((p) => (
          <div key={p.id} className="glass-card rounded-xl p-4 gradient-border flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                {p.is_auto_synced && <span className="font-mono-terminal text-[9px] px-2 py-0.5 bg-neon-green/10 text-neon-green rounded-full border border-neon-green/20">AUTO</span>}
                <span className="font-mono-terminal text-[9px] text-muted-foreground">{p.language}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{p.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(p)} className="font-mono-terminal text-xs px-3 py-1.5 text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">Edit</button>
              <button onClick={() => deleteMut.mutate(p.id)} className="font-mono-terminal text-xs px-3 py-1.5 text-neon-red border border-neon-red/30 rounded-lg hover:bg-neon-red/10 transition-all">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectForm = ({ project, onSave, onCancel }: { project: any; onSave: (p: any) => void; onCancel: () => void }) => {
  const [form, setForm] = useState(project);
  const set = (key: string, val: any) => setForm((f: any) => ({ ...f, [key]: val }));

  return (
    <div className="glass-card rounded-xl p-6 gradient-border space-y-4">
      <h3 className="font-display text-lg text-primary">{form.id ? "Edit" : "New"} Project</h3>
      {[
        { key: "name", label: "Name", type: "text" },
        { key: "description", label: "Description", type: "text" },
        { key: "long_description", label: "Long Description", type: "textarea" },
        { key: "github_url", label: "GitHub URL", type: "text" },
        { key: "language", label: "Language", type: "text" },
        { key: "category", label: "Category", type: "text" },
      ].map((f) => (
        <div key={f.key}>
          <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} rows={3} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
          ) : (
            <input value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
          )}
        </div>
      ))}
      <div>
        <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Tech (comma separated)</label>
        <input value={(form.tech || []).join(", ")} onChange={(e) => set("tech", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="font-mono-terminal text-xs px-5 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">Save</button>
        <button onClick={onCancel} className="font-mono-terminal text-xs px-5 py-2 text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-all">Cancel</button>
      </div>
    </div>
  );
};

// ---- Team Tab ----
const TeamTab = () => {
  const { data: members, isLoading } = useTeamMembers();
  const upsertMut = useUpsertTeamMember();
  const deleteMut = useDeleteTeamMember();
  const [editing, setEditing] = useState<any | null>(null);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Team Members</h2>
        <button
          onClick={() => setEditing({ name: "", alias: "", role: "Member", bio: "", avatar_url: "", github_url: "", clearance_level: "LEVEL 1", order_index: (members?.length || 0) + 1, is_active: true })}
          className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all"
        >
          + Add Member
        </button>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 gradient-border space-y-4">
          <h3 className="font-display text-lg text-primary">{editing.id ? "Edit" : "New"} Member</h3>
          {[
            { key: "name", label: "Name" },
            { key: "alias", label: "Alias/Title" },
            { key: "role", label: "Role" },
            { key: "bio", label: "Bio" },
            { key: "avatar_url", label: "Avatar URL" },
            { key: "github_url", label: "GitHub URL" },
            { key: "linkedin_url", label: "LinkedIn URL" },
            { key: "clearance_level", label: "Clearance Level" },
          ].map((f) => (
            <div key={f.key}>
              <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{f.label}</label>
              <input value={editing[f.key] || ""} onChange={(e) => setEditing((prev: any) => ({ ...prev, [f.key]: e.target.value }))} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={() => { upsertMut.mutate(editing); setEditing(null); }} className="font-mono-terminal text-xs px-5 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">Save</button>
            <button onClick={() => setEditing(null)} className="font-mono-terminal text-xs px-5 py-2 text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {members?.map((m) => (
          <div key={m.id} className="glass-card rounded-xl p-4 gradient-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
              {m.avatar_url ? <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-primary/30 text-lg">👤</div>}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg text-foreground">{m.name}</h3>
              <p className="text-xs text-muted-foreground">{m.role} • {m.clearance_level}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(m)} className="font-mono-terminal text-xs px-3 py-1.5 text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">Edit</button>
              <button onClick={() => deleteMut.mutate(m.id)} className="font-mono-terminal text-xs px-3 py-1.5 text-neon-red border border-neon-red/30 rounded-lg hover:bg-neon-red/10 transition-all">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Social Tab ----
const SocialTab = () => {
  const { data: links, isLoading } = useSocialLinks();
  const upsertMut = useUpsertSocialLink();
  const deleteMut = useDeleteSocialLink();
  const [editing, setEditing] = useState<any | null>(null);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Social Links</h2>
        <button
          onClick={() => setEditing({ platform: "", url: "", icon: "link", order_index: (links?.length || 0) + 1, is_active: true })}
          className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all"
        >
          + Add Link
        </button>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 gradient-border space-y-4">
          <h3 className="font-display text-lg text-primary">{editing.id ? "Edit" : "New"} Social Link</h3>
          {[
            { key: "platform", label: "Platform Name" },
            { key: "url", label: "URL" },
            { key: "icon", label: "Icon (github/linkedin/twitter/whatsapp/discord/instagram)" },
          ].map((f) => (
            <div key={f.key}>
              <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{f.label}</label>
              <input value={editing[f.key] || ""} onChange={(e) => setEditing((prev: any) => ({ ...prev, [f.key]: e.target.value }))} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={() => { upsertMut.mutate(editing); setEditing(null); }} className="font-mono-terminal text-xs px-5 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">Save</button>
            <button onClick={() => setEditing(null)} className="font-mono-terminal text-xs px-5 py-2 text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {links?.map((l) => (
          <div key={l.id} className="glass-card rounded-xl p-4 gradient-border flex items-center justify-between">
            <div>
              <h3 className="font-display text-base text-foreground">{l.platform}</h3>
              <p className="text-xs text-muted-foreground truncate max-w-md">{l.url}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(l)} className="font-mono-terminal text-xs px-3 py-1.5 text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">Edit</button>
              <button onClick={() => deleteMut.mutate(l.id)} className="font-mono-terminal text-xs px-3 py-1.5 text-neon-red border border-neon-red/30 rounded-lg hover:bg-neon-red/10 transition-all">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Loading = () => (
  <div className="flex items-center justify-center py-20">
    <div className="font-mono-terminal text-sm text-primary animate-pulse">Loading data...</div>
  </div>
);

export default Admin;
