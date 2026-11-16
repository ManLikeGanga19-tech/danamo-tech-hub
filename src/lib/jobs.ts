/**
 * Open roles for /careers and /careers/[slug]. Managed in the admin console
 * (Careers -> Job Openings); only roles with status "open" are returned.
 */

export type Job = {
  title: string;
  slug: string;
  employment_type: "Full-time" | "Part-time" | "Contract" | "Internship";
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site";
  summary: string;
  /** Paragraphs separated by blank lines. */
  about: string;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  offer: string[];
  posted_at: string | null;
};

// Server-side only: the Next.js server reaches the API on the private network.
const API = `${process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8000"}/api/v1`;
const REVALIDATE_SECONDS = 60;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function getOpenJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${API}/jobs`, { next: { revalidate: REVALIDATE_SECONDS, tags: ["jobs"] } });
    if (!res.ok) return [];
    return (await res.json()) as Job[];
  } catch {
    return []; // API unreachable: show "no open roles" rather than crash
  }
}

export async function getOpenJob(slug: string): Promise<Job | null> {
  if (!SLUG_RE.test(slug)) return null;
  try {
    const res = await fetch(`${API}/jobs/${slug}`, { next: { revalidate: REVALIDATE_SECONDS, tags: ["jobs"] } });
    if (!res.ok) return null;
    return (await res.json()) as Job;
  } catch {
    return null;
  }
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
