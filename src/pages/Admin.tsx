import { useState, useEffect, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useSiteContent,
  useAllProjects,
  useAllTeamMembers,
  useAllSocialLinks,
  useUpdateContent,
  useUpsertProject,
  useDeleteProject,
  useUpsertTeamMember,
  useDeleteTeamMember,
  useUpsertSocialLink,
  useDeleteSocialLink,
  useSyncGitHub,
  useBlogPosts,
  useUpsertBlogPost,
  useDeleteBlogPost,
  useContactMessages,
  useMarkMessageRead,
  useDeleteMessage,
  useAllServices,
  useUpsertService,
  useDeleteService,
  validateAdminKey,
} from "@/hooks/use-cms";
import CyberBackground3D from "@/components/CyberBackground3D";

type TabId = "dashboard" | "content" | "projects" | "team" | "social" | "blog" | "messages" | "services";
type AccessState = "checking" | "locked" | "unlocked";

const ADMIN_SESSION_KEY = "teamcyberops_admin_session";
const LEGACY_ADMIN_KEY = "teamcyberops_admin_key";
const SESSION_TTL = 1000 * 60 * 60 * 12;

const readStoredAdminKey = () => {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY) || sessionStorage.getItem(LEGACY_ADMIN_KEY) || "";
    if (!raw) return "";
    if (!raw.startsWith("{")) return raw;
    const session = JSON.parse(raw) as { key?: string; expiresAt?: number };
    if (!session.key || (session.expiresAt && session.expiresAt < Date.now())) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      return "";
    }
    return session.key;
  } catch {
    return "";
  }
};

const persistAdminKey = (key: string) => {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ key, expiresAt: Date.now() + SESSION_TTL }));
  sessionStorage.removeItem(LEGACY_ADMIN_KEY);
};

const Admin = () => {
  const [params] = useSearchParams();
  const [access, setAccess] = useState<AccessState>("checking");
  const [keyInput, setKeyInput] = useState("");
  const [accessError, setAccessError] = useState("");
  const [tab, setTab] = useState<TabId>("dashboard");

  useEffect(() => {
    let cancelled = false;
    const unlock = async () => {
      const urlKey = params.get("key")?.trim() || "";
      const candidate = urlKey || readStoredAdminKey();
      if (!candidate) {
        setAccess("locked");
        return;
      }
      setAccess("checking");
      setAccessError("");
      try {
        await validateAdminKey(candidate);
        if (cancelled) return;
        persistAdminKey(candidate);
        setAccess("unlocked");
        if (urlKey) window.history.replaceState({}, "", "/admin");
      } catch (error) {
        if (cancelled) return;
        localStorage.removeItem(ADMIN_SESSION_KEY);
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
        setAccess("locked");
        setAccessError(error instanceof Error ? error.message : "Invalid admin key");
      }
    };
    unlock();
    return () => { cancelled = true; };
  }, [params]);

  const handleUnlock = async (event?: FormEvent) => {
    event?.preventDefault();
    const candidate = keyInput.trim();
    if (!candidate) {
      setAccessError("Enter the admin key to unlock editing.");
      return;
    }
    setAccess("checking");
    setAccessError("");
    try {
      await validateAdminKey(candidate);
      persistAdminKey(candidate);
      setKeyInput("");
      setAccess("unlocked");
    } catch (error) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      setAccess("locked");
      setAccessError(error instanceof Error ? error.message : "Invalid admin key");
    }
  };

  if (access !== "unlocked") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative">
        <CyberBackground3D />
        <form onSubmit={handleUnlock} className="relative z-10 glass-card rounded-2xl p-8 max-w-md w-[calc(100%-2rem)] gradient-border text-center box-glow-blue">
          <div className="mx-auto mb-5 h-14 w-14 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center text-primary text-2xl">⌁</div>
          <h1 className="font-display text-3xl text-primary text-glow-blue mb-3">ADMIN UNLOCK</h1>
          <p className="text-muted-foreground font-mono-terminal text-sm">Verified session required for CMS editing.</p>
          {accessError && (
            <div className="mt-5 rounded-lg border border-neon-red/30 bg-neon-red/10 px-3 py-2 text-left font-mono-terminal text-xs text-neon-red">
              {accessError === "Access denied" ? "Access denied. Check the key and try again." : accessError}
            </div>
          )}
          <div className="mt-6 flex gap-2">
            <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="admin key" type="password" autoComplete="current-password" className="flex-1 min-w-0 bg-background/60 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
            <button disabled={access === "checking"} className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {access === "checking" ? "Checking" : "Unlock"}
            </button>
          </div>
          <p className="mt-4 font-mono-terminal text-[10px] text-muted-foreground">Session persists for 12 hours on this device.</p>
          {access === "checking" && <div className="absolute inset-x-8 bottom-0 h-px bg-primary animate-pulse" />}
        </form>
      </div>
    );
  }

  const lockAdmin = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(LEGACY_ADMIN_KEY);
    setAccess("locked");
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "messages", label: "Messages" },
    { id: "content", label: "Content" },
    { id: "projects", label: "Projects" },
    { id: "services", label: "Services" },
    { id: "blog", label: "Blog" },
    { id: "team", label: "Team" },
    { id: "social", label: "Social" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CyberBackground3D />
      <div className="relative z-10">
        <div className="border-b border-border/50 glass-strong sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-display text-xl text-primary text-glow-blue">TeamCyberØps CMS</h1>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono-terminal text-[10px] text-neon-green">ADMIN</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={lockAdmin} className="font-mono-terminal text-xs text-neon-red hover:text-foreground transition-colors">Lock</button>
              <a href="/" className="font-mono-terminal text-xs text-muted-foreground hover:text-primary transition-colors">← Back to Site</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-2 mb-8 flex-wrap">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`font-mono-terminal text-xs tracking-wider uppercase px-4 py-2 rounded-lg transition-all ${tab === t.id ? "bg-primary/20 text-primary border border-primary/40 box-glow-blue" : "glass-card text-muted-foreground hover:text-foreground border border-transparent"}`}>
                {t.label}
                {t.id === "messages" && <MessageBadge />}
              </button>
            ))}
          </div>
          {tab === "dashboard" && <DashboardTab />}
          {tab === "messages" && <MessagesTab />}
          {tab === "content" && <ContentTab />}
          {tab === "projects" && <ProjectsTab />}
          {tab === "services" && <ServicesTab />}
          {tab === "blog" && <BlogTab />}
          {tab === "team" && <TeamTab />}
          {tab === "social" && <SocialTab />}
        </div>
      </div>
    </div>
  );
};

const MessageBadge = () => {
  const { data: msgs } = useContactMessages();
  const unread = (msgs || []).filter((m) => !m.is_read).length;
  if (unread === 0) return null;
  return <span className="ml-1.5 px-1.5 py-0.5 bg-neon-red text-[9px] text-white rounded-full">{unread}</span>;
};

// ---- Dashboard Tab ----
const DashboardTab = () => {
  const { data: content } = useSiteContent();
  const { data: projects } = useAllProjects();
  const { data: members } = useAllTeamMembers();
  const { data: msgs } = useContactMessages();
  const { data: posts } = useBlogPosts(false);
  const updateMut = useUpdateContent();

  const stats = [
    { label: "Threats Neutralized", key: "stat_threats", value: content?.stat_threats || "1247", icon: "🛡️" },
    { label: "Tools Developed", key: "stat_tools", value: content?.stat_tools || "26", icon: "⚔️" },
    { label: "Lines of Code", key: "stat_lines", value: content?.stat_lines || "85420", icon: "💻" },
    { label: "Vulnerabilities Found", key: "stat_vulns", value: content?.stat_vulns || "342", icon: "🔍" },
  ];

  const [edits, setEdits] = useState<Record<string, string>>({});

  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl text-foreground">Operations Dashboard</h2>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: projects?.length || 0, color: "text-primary" },
          { label: "Team Members", value: members?.length || 0, color: "text-neon-green" },
          { label: "Unread Messages", value: (msgs || []).filter((m) => !m.is_read).length, color: "text-neon-red" },
          { label: "Blog Posts", value: posts?.length || 0, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5 gradient-border text-center">
            <p className={`font-display text-3xl ${s.color}`}>{s.value}</p>
            <p className="font-mono-terminal text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Editable homepage stats */}
      <div className="glass-card rounded-xl p-6 gradient-border">
        <h3 className="font-display text-lg text-primary mb-4">Homepage Stats (Operations Dashboard)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.key} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{s.icon} {s.label}</label>
                <input
                  className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50"
                  value={edits[s.key] ?? s.value}
                  onChange={(e) => setEdits((p) => ({ ...p, [s.key]: e.target.value }))}
                />
              </div>
              {edits[s.key] !== undefined && edits[s.key] !== s.value && (
                <button onClick={() => { updateMut.mutate({ key: s.key, value: edits[s.key] }); setEdits((p) => { const n = { ...p }; delete n[s.key]; return n; }); }} className="font-mono-terminal text-xs px-3 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">Save</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      <div className="glass-card rounded-xl p-6 gradient-border">
        <h3 className="font-display text-lg text-primary mb-4">Recent Messages</h3>
        {(msgs || []).slice(0, 5).map((m) => (
          <div key={m.id} className={`py-3 border-b border-border/30 last:border-0 ${!m.is_read ? "bg-primary/5 -mx-2 px-2 rounded" : ""}`}>
            <div className="flex items-center gap-2">
              {!m.is_read && <div className="w-2 h-2 rounded-full bg-neon-red" />}
              <span className="font-display text-sm text-foreground">{m.name}</span>
              <span className="font-mono-terminal text-[10px] text-muted-foreground">{m.email}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Messages Tab (Realtime) ----
const MessagesTab = () => {
  const { data: msgs, isLoading } = useContactMessages();
  const markRead = useMarkMessageRead();
  const deleteMut = useDeleteMessage();

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Messages</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="font-mono-terminal text-[10px] text-neon-green">REALTIME</span>
        </div>
      </div>

      <div className="space-y-3">
        {(msgs || []).map((m) => (
          <div key={m.id} className={`glass-card rounded-xl p-5 gradient-border transition-all ${!m.is_read ? "border-l-2 border-l-neon-red" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {!m.is_read && <span className="text-[9px] font-mono-terminal px-2 py-0.5 bg-neon-red/20 text-neon-red rounded-full border border-neon-red/30">NEW</span>}
                  <span className="font-display text-lg text-foreground">{m.name}</span>
                  <span className="font-mono-terminal text-[10px] text-muted-foreground">{m.email}</span>
                </div>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{m.message}</p>
                <p className="font-mono-terminal text-[10px] text-muted-foreground mt-2">{new Date(m.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!m.is_read && (
                  <button onClick={() => markRead.mutate(m.id)} className="font-mono-terminal text-xs px-3 py-1.5 text-neon-green border border-neon-green/30 rounded-lg hover:bg-neon-green/10 transition-all">✓ Read</button>
                )}
                <button onClick={() => deleteMut.mutate(m.id)} className="font-mono-terminal text-xs px-3 py-1.5 text-neon-red border border-neon-red/30 rounded-lg hover:bg-neon-red/10 transition-all">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {(msgs || []).length === 0 && (
          <div className="text-center py-10 glass-card rounded-xl gradient-border">
            <p className="font-mono-terminal text-muted-foreground">No messages yet.</p>
          </div>
        )}
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
      setEdits((prev) => { const n = { ...prev }; delete n[key]; return n; });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-foreground">Site Content</h2>
      {Object.entries(grouped).map(([section, keys]) => (
        <div key={section} className="glass-card rounded-xl p-6 gradient-border">
          <h3 className="font-display text-lg text-primary mb-4 capitalize">{section}</h3>
          <div className="space-y-4">
            {keys.sort().map((key) => (
              <div key={key} className="flex flex-col gap-1.5">
                <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider">{key.replace(/_/g, " ")}</label>
                <div className="flex gap-2">
                  <input className="flex-1 bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all" value={edits[key] ?? content?.[key] ?? ""} onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))} />
                  {edits[key] !== undefined && (
                    <button onClick={() => handleSave(key)} disabled={updateMut.isPending} className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">Save</button>
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
  const { data: projects, isLoading } = useAllProjects();
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
          <button onClick={() => syncMut.mutate()} disabled={syncMut.isPending} className="font-mono-terminal text-xs px-4 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg hover:bg-neon-green/20 transition-all">{syncMut.isPending ? "Syncing..." : "🔄 Sync GitHub"}</button>
          <button onClick={() => setEditing({ name: "", description: "", long_description: "", tech: [], github_url: "", language: "Python", category: "Tools", stars: 0, is_visible: true, order_index: (projects?.length || 0) + 1 })} className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">+ Add Project</button>
        </div>
      </div>
      {editing && <ProjectForm project={editing} onSave={(p) => { upsertMut.mutate(p); setEditing(null); }} onCancel={() => setEditing(null)} />}
      <div className="grid gap-3">
        {projects?.map((p) => (
          <div key={p.id} className="glass-card rounded-xl p-4 gradient-border flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                {p.is_auto_synced && <span className="font-mono-terminal text-[9px] px-2 py-0.5 bg-neon-green/10 text-neon-green rounded-full border border-neon-green/20">AUTO</span>}
                {!p.is_visible && <span className="font-mono-terminal text-[9px] px-2 py-0.5 bg-neon-red/10 text-neon-red rounded-full border border-neon-red/20">HIDDEN</span>}
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
        { key: "name", label: "Name" }, { key: "description", label: "Description" },
        { key: "long_description", label: "Long Description", type: "textarea" },
        { key: "github_url", label: "GitHub URL" }, { key: "language", label: "Language" }, { key: "category", label: "Category" },
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
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_visible} onChange={(e) => set("is_visible", e.target.checked)} className="accent-primary" />
          <span className="font-mono-terminal text-xs text-muted-foreground">Visible</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="font-mono-terminal text-xs px-5 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">Save</button>
        <button onClick={onCancel} className="font-mono-terminal text-xs px-5 py-2 text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-all">Cancel</button>
      </div>
    </div>
  );
};

// ---- Blog Tab ----
const BlogTab = () => {
  const { data: posts, isLoading } = useBlogPosts(false);
  const upsertMut = useUpsertBlogPost();
  const deleteMut = useDeleteBlogPost();
  const [editing, setEditing] = useState<any | null>(null);

  if (isLoading) return <Loading />;

  const newPost = () => setEditing({
    title: "", slug: "", content: "", excerpt: "", cover_image_url: "", author: "TeamCyberOps",
    tags: [], is_published: false, published_at: new Date().toISOString(), order_index: (posts?.length || 0) + 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Blog Posts</h2>
        <button onClick={newPost} className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">+ New Post</button>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 gradient-border space-y-4">
          <h3 className="font-display text-lg text-primary">{editing.id ? "Edit" : "New"} Post</h3>
          {[
            { key: "title", label: "Title" }, { key: "slug", label: "Slug (URL-friendly)" },
            { key: "excerpt", label: "Excerpt" }, { key: "cover_image_url", label: "Cover Image URL" },
            { key: "author", label: "Author" },
          ].map((f) => (
            <div key={f.key}>
              <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{f.label}</label>
              <input value={editing[f.key] || ""} onChange={(e) => setEditing((prev: any) => ({ ...prev, [f.key]: e.target.value }))} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
            </div>
          ))}
          <div>
            <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Tags (comma separated)</label>
            <input value={(editing.tags || []).join(", ")} onChange={(e) => setEditing((prev: any) => ({ ...prev, tags: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Content (HTML / Text)</label>
            <textarea value={editing.content || ""} onChange={(e) => setEditing((prev: any) => ({ ...prev, content: e.target.value }))} rows={12} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50 resize-y" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editing.is_published} onChange={(e) => setEditing((prev: any) => ({ ...prev, is_published: e.target.checked, published_at: e.target.checked ? new Date().toISOString() : prev.published_at }))} className="accent-primary" />
            <span className="font-mono-terminal text-xs text-muted-foreground">Published</span>
          </label>
          <div className="flex gap-2">
            <button onClick={() => { upsertMut.mutate(editing); setEditing(null); }} className="font-mono-terminal text-xs px-5 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">Save</button>
            <button onClick={() => setEditing(null)} className="font-mono-terminal text-xs px-5 py-2 text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {(posts || []).map((p) => (
          <div key={p.id} className="glass-card rounded-xl p-4 gradient-border flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-foreground">{p.title}</h3>
                <span className={`font-mono-terminal text-[9px] px-2 py-0.5 rounded-full border ${p.is_published ? "bg-neon-green/10 text-neon-green border-neon-green/20" : "bg-muted text-muted-foreground border-border"}`}>{p.is_published ? "PUBLISHED" : "DRAFT"}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{p.excerpt}</p>
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

// ---- Team Tab ----
const TeamTab = () => {
  const { data: members, isLoading } = useAllTeamMembers();
  const upsertMut = useUpsertTeamMember();
  const deleteMut = useDeleteTeamMember();
  const [editing, setEditing] = useState<any | null>(null);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Team Members</h2>
        <button onClick={() => setEditing({ name: "", alias: "", role: "Member", bio: "", avatar_url: "", github_url: "", clearance_level: "LEVEL 1", order_index: (members?.length || 0) + 1, is_active: true })} className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">+ Add Member</button>
      </div>
      {editing && (
        <div className="glass-card rounded-xl p-6 gradient-border space-y-4">
          <h3 className="font-display text-lg text-primary">{editing.id ? "Edit" : "New"} Member</h3>
          {[
            { key: "name", label: "Name" }, { key: "alias", label: "Alias" }, { key: "role", label: "Role" },
            { key: "bio", label: "Bio" }, { key: "avatar_url", label: "Avatar URL" },
            { key: "github_url", label: "GitHub URL" }, { key: "linkedin_url", label: "LinkedIn URL" },
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
      <div className="grid gap-3">
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
  const { data: links, isLoading } = useAllSocialLinks();
  const upsertMut = useUpsertSocialLink();
  const deleteMut = useDeleteSocialLink();
  const [editing, setEditing] = useState<any | null>(null);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Social Links</h2>
        <button onClick={() => setEditing({ platform: "", url: "", icon: "link", order_index: (links?.length || 0) + 1, is_active: true })} className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">+ Add Link</button>
      </div>
      {editing && (
        <div className="glass-card rounded-xl p-6 gradient-border space-y-4">
          <h3 className="font-display text-lg text-primary">{editing.id ? "Edit" : "New"} Social Link</h3>
          {[
            { key: "platform", label: "Platform Name" }, { key: "url", label: "URL" },
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

// ---- Services Tab ----
const ServicesTab = () => {
  const { data: services, isLoading } = useAllServices();
  const upsertMut = useUpsertService();
  const deleteMut = useDeleteService();
  const [editing, setEditing] = useState<any | null>(null);

  const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  if (isLoading) return <Loading />;

  const newService = () => setEditing({
    title: "", slug: "", description: "", long_description: "", price: "Contact Us", price_label: "Starting from",
    icon: "shield", features: [], category: "Security", is_featured: false, is_active: true,
    timeline: "Custom timeline", best_for: "Teams needing verified security coverage", deliverables: [], comparison_level: "Standard", cta_label: "Get Quote",
    order_index: (services?.length || 0) + 1,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Services</h2>
        <button onClick={newService} className="font-mono-terminal text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">+ Add Service</button>
      </div>

      {editing && (
        <div className="glass-card rounded-xl p-6 gradient-border space-y-4">
          <h3 className="font-display text-lg text-primary">{editing.id ? "Edit" : "New"} Service</h3>
          {[
            { key: "title", label: "Title" }, { key: "slug", label: "Slug (/services/slug)" }, { key: "description", label: "Description" },
            { key: "long_description", label: "Long Description", type: "textarea" },
            { key: "price", label: "Price" }, { key: "price_label", label: "Price Label (e.g. Starting from)" },
            { key: "icon", label: "Icon (shield/search/clipboard/alert-triangle/target/book-open)" },
            { key: "category", label: "Category" }, { key: "timeline", label: "Timeline" },
            { key: "best_for", label: "Best For" }, { key: "comparison_level", label: "Comparison Level" },
            { key: "cta_label", label: "CTA Label" },
          ].map((f) => (
            <div key={f.key}>
              <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{f.label}</label>
              {f.type === "textarea" ? (
                <textarea value={editing[f.key] || ""} onChange={(e) => setEditing((prev: any) => ({ ...prev, [f.key]: e.target.value }))} rows={3} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
              ) : (
                <input value={editing[f.key] || ""} onChange={(e) => setEditing((prev: any) => ({ ...prev, [f.key]: e.target.value, ...(f.key === "title" && !prev.id ? { slug: slugify(e.target.value) } : {}) }))} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
              )}
            </div>
          ))}
          <div>
            <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Features (comma separated)</label>
            <input value={(editing.features || []).join(", ")} onChange={(e) => setEditing((prev: any) => ({ ...prev, features: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="font-mono-terminal text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Deliverables (comma separated)</label>
            <input value={(editing.deliverables || []).join(", ")} onChange={(e) => setEditing((prev: any) => ({ ...prev, deliverables: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) }))} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 font-mono-terminal text-sm text-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing((prev: any) => ({ ...prev, is_featured: e.target.checked }))} className="accent-primary" />
              <span className="font-mono-terminal text-xs text-muted-foreground">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing((prev: any) => ({ ...prev, is_active: e.target.checked }))} className="accent-primary" />
              <span className="font-mono-terminal text-xs text-muted-foreground">Active</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { upsertMut.mutate(editing); setEditing(null); }} className="font-mono-terminal text-xs px-5 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">Save</button>
            <button onClick={() => setEditing(null)} className="font-mono-terminal text-xs px-5 py-2 text-muted-foreground border border-border rounded-lg hover:bg-secondary transition-all">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {(services || []).map((s) => (
          <div key={s.id} className="glass-card rounded-xl p-4 gradient-border flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-lg text-foreground">{s.title}</h3>
                <span className="font-mono-terminal text-[9px] px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">{s.price}</span>
                {s.is_featured && <span className="font-mono-terminal text-[9px] px-2 py-0.5 bg-neon-green/10 text-neon-green rounded-full border border-neon-green/20">FEATURED</span>}
                {!s.is_active && <span className="font-mono-terminal text-[9px] px-2 py-0.5 bg-neon-red/10 text-neon-red rounded-full border border-neon-red/20">INACTIVE</span>}
              </div>
              <p className="text-sm text-muted-foreground truncate">{s.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditing(s)} className="font-mono-terminal text-xs px-3 py-1.5 text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-all">Edit</button>
              <button onClick={() => deleteMut.mutate(s.id)} className="font-mono-terminal text-xs px-3 py-1.5 text-neon-red border border-neon-red/30 rounded-lg hover:bg-neon-red/10 transition-all">Delete</button>
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
