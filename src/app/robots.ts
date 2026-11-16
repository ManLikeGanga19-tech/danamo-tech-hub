import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Served on the public host. The admin host answers /robots.txt itself
// (Disallow: /) in src/proxy.ts.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/account", "/login", "/signup", "/api/"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
