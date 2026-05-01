import { createClient } from "https://esm.sh/@supabase/supabase-js@2.102.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
};

const ADMIN_KEY = Deno.env.get("ADMIN_PANEL_KEY") || "teamcyberops2024";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const allowedTables = new Set([
  "site_content",
  "projects",
  "team_members",
  "social_links",
  "blog_posts",
  "contact_messages",
  "services",
]);

const orderBy: Record<string, { column: string; ascending: boolean }> = {
  site_content: { column: "key", ascending: true },
  projects: { column: "order_index", ascending: true },
  team_members: { column: "order_index", ascending: true },
  social_links: { column: "order_index", ascending: true },
  blog_posts: { column: "published_at", ascending: false },
  contact_messages: { column: "created_at", ascending: false },
  services: { column: "order_index", ascending: true },
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const providedKey = req.headers.get("x-admin-key") || "";
  if (!ADMIN_KEY || providedKey !== ADMIN_KEY) {
    return json({ error: "Access denied" }, 403);
  }

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return json({ error: "Backend not configured" }, 500);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { action, table, payload, id } = await req.json();

    if (table && !allowedTables.has(table)) {
      return json({ error: "Table not allowed" }, 400);
    }

    if (action === "list") {
      const cfg = orderBy[table] || { column: "created_at", ascending: false };
      const { data, error } = await admin.from(table).select("*").order(cfg.column, { ascending: cfg.ascending, nullsFirst: false });
      if (error) throw error;
      return json({ data });
    }

    if (action === "upsert") {
      const { data, error } = await admin.from(table).upsert(payload).select("*");
      if (error) throw error;
      return json({ data });
    }

    if (action === "delete") {
      const { error } = await admin.from(table).delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "update_content") {
      const { key, value } = payload || {};
      const { error } = await admin.from("site_content").update({ value }).eq("key", key);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "mark_message_read") {
      const { error } = await admin.from("contact_messages").update({ is_read: true }).eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "sync_github") {
      const res = await fetch("https://api.github.com/users/mohidqx/repos?per_page=100&sort=updated", {
        headers: { "User-Agent": "TeamCyberOps-CMS" },
      });
      if (!res.ok) return json({ error: "GitHub sync failed" }, 502);
      const repos = await res.json();
      let synced = 0;

      for (const repo of repos) {
        if (repo.fork) continue;
        const existing = await admin.from("projects").select("id, is_auto_synced").eq("name", repo.name).maybeSingle();
        if (existing.data && !existing.data.is_auto_synced) continue;

        const project = {
          name: repo.name,
          description: repo.description || "No description available.",
          long_description: repo.description || "No detailed description available.",
          tech: [repo.language || "Unknown"].filter(Boolean),
          github_url: repo.html_url,
          language: repo.language || "Unknown",
          category: "Tools",
          stars: repo.stargazers_count || 0,
          is_auto_synced: true,
          is_visible: true,
          ...(existing.data ? { id: existing.data.id } : {}),
        };

        const { error } = await admin.from("projects").upsert(project, { onConflict: existing.data ? "id" : "name" });
        if (error) throw error;
        synced++;
      }

      return json({ ok: true, synced });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
