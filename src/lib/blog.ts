import { SITE_URL } from "@/lib/site";
import { SERVER_API } from "@/lib/server-api";

export type BlogSummary = {
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string[];
  author_name: string;
  read_minutes: number;
  published_at: string | null;
};

export type BlogPost = BlogSummary & {
  id: string;
  content: string; // Markdown
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

/** Fallback image when a post has no cover. */
export const DEFAULT_BLOG_COVER = "/blogs/blog-bg.jpg";

const API = SERVER_API;
const REVALIDATE_SECONDS = 60;

export async function getPublishedPosts(): Promise<BlogSummary[]> {
  try {
    const res = await fetch(`${API}/blog`, { next: { revalidate: REVALIDATE_SECONDS, tags: ["blog"] } });
    if (!res.ok) return [];
    return (await res.json()) as BlogSummary[];
  } catch {
    return []; // API unreachable: render the page with no posts rather than crash
  }
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  try {
    const res = await fetch(`${API}/blog/${slug}`, { next: { revalidate: REVALIDATE_SECONDS, tags: ["blog"] } });
    if (!res.ok) return null;
    return (await res.json()) as BlogPost;
  } catch {
    return null;
  }
}

/** Image path as served to browsers ("/uploads/..." is proxied by Next.js). */
export function coverSrc(post: Pick<BlogSummary, "cover_image_url">): string {
  return post.cover_image_url || DEFAULT_BLOG_COVER;
}

/** Absolute URL for Open Graph / social previews. */
export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Nairobi" });
}
