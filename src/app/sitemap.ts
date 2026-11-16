import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPublishedPosts } from "@/lib/blog";
import { getOpenJobs } from "@/lib/jobs";
import { getProjects } from "@/lib/projects";
import { services } from "@/lib/services";

// Rebuilt at most hourly so new articles are picked up without a redeploy.
export const revalidate = 3600;

const pages: { path: string; changeFrequency: "daily" | "weekly" | "monthly" | "yearly"; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/projects", changeFrequency: "weekly", priority: 0.8 },
    { path: "/webinars", changeFrequency: "weekly", priority: 0.7 },
    { path: "/careers", changeFrequency: "weekly", priority: 0.7 },
    { path: "/team", changeFrequency: "monthly", priority: 0.6 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
    { path: "/faqs", changeFrequency: "monthly", priority: 0.5 },
    { path: "/help-center", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/cookies", changeFrequency: "yearly", priority: 0.3 },
    { path: "/accessibility", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // No lastModified on static pages: a date that changes on every rebuild
    // teaches search engines to ignore the field.
    const staticPages = pages.map(({ path, changeFrequency, priority }) => ({
        url: `${SITE_URL}${path === "/" ? "" : path}`,
        changeFrequency,
        priority,
    }));
    const servicePages = services.map((service) => ({
        url: `${SITE_URL}/services/${service.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));
    const projects = (await getProjects()).map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        ...(project.created_at ? { lastModified: new Date(project.created_at) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));
    const posts = (await getPublishedPosts()).map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        ...(post.published_at ? { lastModified: new Date(post.published_at) } : {}),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));
    const roles = (await getOpenJobs()).map((job) => ({
        url: `${SITE_URL}/careers/${job.slug}`,
        ...(job.posted_at ? { lastModified: new Date(job.posted_at) } : {}),
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));
    return [...staticPages, ...servicePages, ...projects, ...roles, ...posts];
}
