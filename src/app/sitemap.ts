import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    return pages.map(({ path, changeFrequency, priority }) => ({
        url: `${SITE_URL}${path === "/" ? "" : path}`,
        lastModified,
        changeFrequency,
        priority,
    }));
}
