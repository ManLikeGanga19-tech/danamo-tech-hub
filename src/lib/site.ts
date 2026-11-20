/** Canonical public site identity. The only place the domain is defined. */
export const SITE_URL = "https://danamotech.co.ke";
export const SITE_NAME = "Danamo Tech";
export const CONTACT_EMAIL = "hello@danamotech.co.ke";

/**
 * Business identity (NAP: name, address, phone). Google matches these against
 * the Google Business Profile and every directory listing, so they must be
 * character-for-character identical everywhere. Change them here only.
 */
export const CONTACT_PHONE = "+254785640048";
export const CONTACT_PHONE_DISPLAY = "+254 785 640 048";
export const WHATSAPP_URL = "https://wa.me/254785640048";

/** Year the company was founded (stated on /team; Business Profile opening date 15 Apr 2024). */
export const FOUNDING_YEAR = "2024";

/**
 * Danamo's own products (not client work). Each has its own website where one
 * exists. Add a URL only when that site names Danamo Tech Ltd as the maker, so
 * Google ties the product to this company instead of treating the product site
 * as the company's main home.
 */
export const OWN_PRODUCTS: { name: string; summary: string; url?: string }[] = [
  { name: "ShuleHQ", summary: "school management SaaS for Kenyan schools", url: "https://shulehq.co.ke" },
  { name: "WIFI.OS", summary: "ISP and Wi-Fi hotspot billing and network management with M-Pesa", url: "https://wifios.co.ke" },
  { name: "VendaPOS", summary: "point of sale software for businesses" },
  { name: "Tusome", summary: "CBC e-learning platform" },
];

export const BUSINESS_ADDRESS = {
  streetAddress: "Airport Road",
  addressLocality: "Mombasa",
  addressRegion: "Mombasa County",
  addressCountry: "KE",
} as const;

/**
 * Office coordinates, copied from the Google Business Profile pin.
 * Leave null until they are verified: structured data omits `geo` while null.
 */
export const BUSINESS_GEO: { latitude: number; longitude: number } | null = null;

/** The profile's public URL (Share → copy link). Empty = not published. */
export const GOOGLE_BUSINESS_PROFILE_URL = "";

/**
 * Opening hours as shown on the Google Business Profile (24h "HH:MM").
 * Empty = not published in structured data. Must match the profile exactly.
 */
export const OPENING_HOURS: { days: ("Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday")[]; opens: string; closes: string }[] = [];

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
