import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export type SiteContent = Record<string, string>;

const getAdminKey = () => {
  if (typeof window === "undefined") return "";
  const fromUrl = new URLSearchParams(window.location.search).get("key") || "";
  if (fromUrl) sessionStorage.setItem("teamcyberops_admin_key", fromUrl);
  return fromUrl || sessionStorage.getItem("teamcyberops_admin_key") || "";
};

const adminRequest = async <T,>(action: string, table?: string, payload?: unknown, id?: string): Promise<T> => {
  const adminKey = getAdminKey();
  if (!adminKey) throw new Error("Admin key missing");
  const { data, error } = await supabase.functions.invoke("admin-cms", {
    body: { action, table, payload, id },
    headers: { "x-admin-key": adminKey },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data?.data ?? data;
};

export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("key, value")
        .order("key");
      if (error) throw error;
      const map: SiteContent = {};
      data.forEach((r) => (map[r.key] = r.value));
      return map;
    },
    staleTime: 60_000,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_visible", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}

export function useAllProjects() {
  return useQuery({
    queryKey: ["projects-all"],
    queryFn: () => adminRequest("list", "projects"),
    staleTime: 60_000,
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .eq("is_active", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}

// Services
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: ["services-all"],
    queryFn: () => adminRequest("list", "services"),
    staleTime: 60_000,
  });
}

export function useUpsertService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (service: any) => adminRequest("upsert", "services", service),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["services-all"] });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRequest("delete", "services", undefined, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["services-all"] });
    },
  });
}

// Blog posts
export function useBlogPosts(publishedOnly = true) {
  return useQuery({
    queryKey: ["blog-posts", publishedOnly],
    queryFn: async () => {
      let q = supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
      if (publishedOnly) q = q.eq("is_published", true);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// Contact messages with realtime
export function useContactMessages() {
  const qc = useQueryClient();
  
  useEffect(() => {
    const channel = supabase
      .channel("contact-messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => {
        qc.invalidateQueries({ queryKey: ["contact-messages"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 10_000,
  });
}

// Admin mutations
export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase.from("site_content").update({ value }).eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-content"] }),
  });
}

export function useUpsertProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (project: any) => {
      const { error } = await supabase.from("projects").upsert(project);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useUpsertTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (member: any) => {
      const { error } = await supabase.from("team_members").upsert(member);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
  });
}

export function useDeleteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team-members"] }),
  });
}

export function useUpsertSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (link: any) => {
      const { error } = await supabase.from("social_links").upsert(link);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social-links"] }),
  });
}

export function useDeleteSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("social_links").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["social-links"] }),
  });
}

// Blog mutations
export function useUpsertBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: any) => {
      const { error } = await supabase.from("blog_posts").upsert(post);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

// Mark message as read
export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-messages"] }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-messages"] }),
  });
}

// GitHub sync
export function useSyncGitHub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("https://api.github.com/users/mohidqx/repos?per_page=100&sort=updated");
      if (!res.ok) throw new Error("GitHub API error");
      const repos = await res.json();
      
      for (const repo of repos) {
        if (repo.fork) continue;
        const existing = await supabase
          .from("projects")
          .select("id, is_auto_synced")
          .eq("name", repo.name)
          .maybeSingle();
        
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
        
        await supabase.from("projects").upsert(project, { onConflict: "id" });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}
