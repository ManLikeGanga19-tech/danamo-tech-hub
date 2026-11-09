import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://danamo-tech.co.ke";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },
            {
                userAgent: "Googlebot-Image",
                allow: ["/"],
            },
            {
                userAgent: "Googlebot-News",
                allow: ["/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
