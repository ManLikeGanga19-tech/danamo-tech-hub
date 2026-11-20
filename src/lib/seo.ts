import type { Metadata } from "next";
import {
  BUSINESS_ADDRESS,
  BUSINESS_GEO,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  FOUNDER,
  GOOGLE_BUSINESS_PROFILE_URL,
  OPENING_HOURS,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/site";

/** Default share image (1200x630). Pages with their own image pass `image`. */
export const OG_IMAGE = "/og-image.jpg";

export const DEFAULT_DESCRIPTION =
  "Danamo Tech is a software development company in Mombasa, Kenya. We build custom websites, web and mobile apps, SaaS products and business systems with M-Pesa integration for companies and schools across East Africa.";

type PageSeo = {
  /** Page title without the brand; the layout adds " | Danamo Tech". */
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/services". */
  path: string;
  image?: string;
  imageAlt?: string;
  /** Use the title as-is (no " | Danamo Tech" suffix), e.g. for the home page. */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: "website" | "article";
};

/**
 * Metadata for one page: title, description, its OWN canonical URL and
 * matching Open Graph / Twitter tags. Next.js replaces (not merges) nested
 * openGraph objects, so every page must provide the full set.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = OG_IMAGE,
  imageAlt,
  absoluteTitle = false,
  noindex = false,
  type = "website",
}: PageSeo): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const images = [{ url: image, width: 1200, height: 630, alt: imageAlt ?? fullTitle }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_KE",
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** Business identity for Google (knowledge panel, local results). */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "Danamo Tech Ltd",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}${OG_IMAGE}`,
  description: DEFAULT_DESCRIPTION,
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE,
  address: { "@type": "PostalAddress", ...BUSINESS_ADDRESS },
  // Optional local signals: emitted only once verified in lib/site.ts.
  ...(BUSINESS_GEO ? { geo: { "@type": "GeoCoordinates", ...BUSINESS_GEO } } : {}),
  ...(GOOGLE_BUSINESS_PROFILE_URL ? { hasMap: GOOGLE_BUSINESS_PROFILE_URL } : {}),
  ...(OPENING_HOURS.length
    ? {
        openingHoursSpecification: OPENING_HOURS.map(({ days, opens, closes }) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: days,
          opens,
          closes,
        })),
      }
    : {}),
  areaServed: [
    { "@type": "City", name: "Mombasa" },
    { "@type": "Country", name: "Kenya" },
    { "@type": "Place", name: "East Africa" },
  ],
  founder: {
    "@type": "Person",
    name: FOUNDER.name,
    jobTitle: [FOUNDER.role, ...FOUNDER.titles],
    description: FOUNDER.summary,
    knowsAbout: [...FOUNDER.knowsAbout],
    url: `${SITE_URL}/team`,
    sameAs: FOUNDER.github,
  },
  knowsAbout: [
    "Custom software development",
    "Web development",
    "Mobile app development",
    "SaaS product development",
    "M-Pesa integration",
    "School management systems",
    "ISP billing systems",
    "Point of sale systems",
    "Cloud and DevOps",
    "Search engine optimisation",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software development services",
    itemListElement: [
      "Custom web development",
      "SaaS product development",
      "E-commerce development",
      "Branding and UI/UX design",
      "Search engine optimisation",
      "Cloud and DevOps",
      "IT consulting and support",
      "Digital marketing",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE,
    contactType: "sales",
    areaServed: "KE",
    availableLanguage: ["English"],
  },
  // Every official profile, so Google ties them to one entity.
  sameAs: [
    "https://github.com/ManLikeGanga19-tech",
    ...Object.values(SOCIAL_LINKS),
    GOOGLE_BUSINESS_PROFILE_URL,
  ].filter(Boolean),
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-KE",
};

/** Safe JSON for a <script type="application/ld+json"> tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
