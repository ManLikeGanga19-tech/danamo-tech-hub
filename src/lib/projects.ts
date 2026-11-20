import { SERVER_API } from "@/lib/server-api";

/** Published case studies, fetched on the server (rendered HTML for search engines). */

export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image_url: string;
  live_url: string | null;
  featured: boolean;
  created_at: string | null;
};

export type Project = ProjectSummary & {
  content: string;
  client_name: string | null;
  client_industry: string | null;
  gallery: string[];
  technologies: string[];
};

const API = SERVER_API;
const REVALIDATE_SECONDS = 60;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function getProjects(): Promise<ProjectSummary[]> {
  try {
    const res = await fetch(`${API}/projects`, { next: { revalidate: REVALIDATE_SECONDS, tags: ["projects"] } });
    if (!res.ok) return [];
    return (await res.json()) as ProjectSummary[];
  } catch {
    return [];
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!SLUG_RE.test(slug)) return null;
  try {
    const res = await fetch(`${API}/projects/${slug}`, { next: { revalidate: REVALIDATE_SECONDS, tags: ["projects"] } });
    if (!res.ok) return null;
    return (await res.json()) as Project;
  } catch {
    return null;
  }
}
