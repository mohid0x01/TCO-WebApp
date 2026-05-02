import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export type SiteContent = Record<string, string>;

const ADMIN_KEY_STORAGE = "teamcyberops_admin_session";

const getAdminKey = () => {
  if (typeof window === "undefined") return "";
  const fromUrl = new URLSearchParams(window.location.search).get("key") || "";
  if (fromUrl) return fromUrl;

  try {
    const raw = localStorage.getItem(ADMIN_KEY_STORAGE) || sessionStorage.getItem("teamcyberops_admin_key") || "";
    if (!raw) return "";
    if (!raw.startsWith("{")) return raw;
    const session = JSON.parse(raw) as { key?: string; expiresAt?: number };
    if (!session.key || (session.expiresAt && session.expiresAt < Date.now())) {
      localStorage.removeItem(ADMIN_KEY_STORAGE);
      return "";
    }
    return session.key;
  } catch {
    return "";
  }
};

export const validateAdminKey = async (adminKey: string) => {
  const { data, error } = await supabase.functions.invoke("admin-cms", {
    body: { action: "validate" },
    headers: { "x-admin-key": adminKey },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data?.ok === true;
};

const adminRequest = async (action: string, table?: string, payload?: unknown, id?: string): Promise<any> => {
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

export function useAllTeamMembers() {
  return useQuery({
    queryKey: ["team-members-all"],
    queryFn: () => adminRequest("list", "team_members"),
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

export function useAllSocialLinks() {
  return useQuery({
    queryKey: ["social-links-all"],
    queryFn: () => adminRequest("list", "social_links"),
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

export function useService(slug: string) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
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
      if (!publishedOnly) return adminRequest("list", "blog_posts");
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
    const channelName = `contact-messages-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => {
        qc.invalidateQueries({ queryKey: ["contact-messages"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return useQuery({
    queryKey: ["contact-messages"],
    queryFn: () => adminRequest("list", "contact_messages"),
    refetchInterval: 5_000,
    staleTime: 10_000,
  });
}

// Admin mutations
export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => adminRequest("update_content", undefined, { key, value }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site-content"] }),
  });
}

export function useUpsertProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (project: any) => adminRequest("upsert", "projects", project),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects-all"] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRequest("delete", "projects", undefined, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects-all"] });
    },
  });
}

export function useUpsertTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (member: any) => adminRequest("upsert", "team_members", member),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team-members"] });
      qc.invalidateQueries({ queryKey: ["team-members-all"] });
    },
  });
}

export function useDeleteTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRequest("delete", "team_members", undefined, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["team-members"] });
      qc.invalidateQueries({ queryKey: ["team-members-all"] });
    },
  });
}

export function useUpsertSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (link: any) => adminRequest("upsert", "social_links", link),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-links"] });
      qc.invalidateQueries({ queryKey: ["social-links-all"] });
    },
  });
}

export function useDeleteSocialLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRequest("delete", "social_links", undefined, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-links"] });
      qc.invalidateQueries({ queryKey: ["social-links-all"] });
    },
  });
}

// Blog mutations
export function useUpsertBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (post: any) => adminRequest("upsert", "blog_posts", post),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRequest("delete", "blog_posts", undefined, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-posts"] }),
  });
}

// Mark message as read
export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRequest("mark_message_read", undefined, undefined, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-messages"] }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminRequest("delete", "contact_messages", undefined, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact-messages"] }),
  });
}

// GitHub sync
export function useSyncGitHub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminRequest("sync_github"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["projects-all"] });
    },
  });
}
