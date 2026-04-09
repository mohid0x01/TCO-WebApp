import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = Record<string, string>;

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

// Admin mutations
export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from("site_content")
        .update({ value })
        .eq("key", key);
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
