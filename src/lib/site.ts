/** Canonical public site identity. The only place the domain is defined. */
export const SITE_URL = "https://danamotech.co.ke";
export const SITE_NAME = "Danamo Tech";
export const CONTACT_EMAIL = "hello@danamotech.co.ke";

/**
 * Official social profiles. Leave a value empty to hide that icon — never
 * link to a generic homepage. Fill these in when the profiles exist.
 */
export const SOCIAL_LINKS = {
  facebook: "",
  instagram: "",
  linkedin: "",
} as const;

// Single source of truth for the founder (Team page, blog author box,
// Organization/Person JSON-LD and llms.txt).
export const FOUNDER = {
  name: "Daniel Oganga",
  role: "Founder & CEO",
  titles: ["Senior Software Developer", "Networking Expert"],
  github: "https://github.com/ManLikeGanga19-tech",
  summary:
    "Founder and CEO of Danamo Tech, senior software developer and networking expert. Builds Danamo's products, including ShuleHQ and the WIFI.OS ISP billing and network management platform, and leads engineering on client work across Kenya and East Africa.",
  knowsAbout: [
    "Software development",
    "Web and mobile applications",
    "SaaS architecture",
    "M-Pesa integration",
    "Computer networking",
    "ISP, PPPoE and Wi-Fi hotspot networks",
    "MikroTik RouterOS",
    "RADIUS (AAA)",
    "Cisco networking",
    "Ubiquiti UniFi",
    "WireGuard VPN",
    "Cloud and DevOps",
  ],
} as const;
