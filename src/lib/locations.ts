/**
 * Location pages (/locations/<slug>): one page per town we actively serve
 * outside our home city.
 *
 * Why there is no Mombasa page: Danamo Tech is based in Mombasa, so the home
 * page, every service page and the Google Business Profile already target
 * Mombasa. A separate /locations/mombasa would compete with the home page for
 * the same searches.
 *
 * Rollout runs outward in rings (see the "Geo-First SEO Plan" doc):
 *   ring 2 = Coast towns, ring 3 = rest of Kenya, ring 4 = East Africa.
 * Open the next ring only when the current one is ranking.
 *
 * PUBLISHING RULES — Google treats near-identical town pages as "doorway
 * pages" and can demote the whole site. A location may be published only when:
 *   1. it has at least one real local proof item (a client, project or
 *      engagement in that area, true and approved for publication), and
 *   2. everything it says about Danamo (site visits, response times) is true.
 * Facts about the town itself (economy, geography) must be accurate too.
 * `assertPublishable` below fails the build if rule 1 is broken.
 */

import type { CaseStudyKey, ServiceSection } from "@/lib/services";

export type LocalProof = {
  /** A case study on the site, if there is one. */
  caseStudy?: CaseStudyKey;
  /** One factual line, e.g. "Booking site and M-Pesa checkout for a villa operator in Galu." */
  note: string;
};

export type Location = {
  slug: string;
  /** Town name as people search it, e.g. "Diani". */
  name: string;
  county: string;
  ring: 2 | 3 | 4;
  /** Drafts are not built, listed, linked or put in the sitemap. */
  published: boolean;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string[];
  /** Nearby areas covered by this page, e.g. ["Ukunda", "Galu", "Tiwi"]. */
  nearby: string[];
  /** The local economy and what we build for it. */
  industries: { title: string; text: string }[];
  sections: ServiceSection[];
  /** Service slugs to feature, most relevant first. */
  services: string[];
  localProof: LocalProof[];
  faqs: { q: string; a: string }[];
};

export const locations: Location[] = [
  // ── Ring 2: Coast ────────────────────────────────────────────────
  {
    slug: "diani",
    name: "Diani",
    county: "Kwale County",
    ring: 2,
    published: false, // NEEDS: local proof + confirm site-visit offer
    seoTitle: "Web Design & Booking Systems in Diani, Kwale",
    seoDescription:
      "Websites, direct-booking systems and M-Pesa payments for hotels, villas, restaurants and tour operators in Diani and Ukunda, from Danamo Tech in Mombasa.",
    h1: "Websites and Booking Systems for Diani Businesses",
    intro: [
      "Danamo Tech builds websites, booking systems and M-Pesa payment integrations for hotels, holiday villas, restaurants and tour operators in Diani, Ukunda and the wider Kwale coast.",
      "Most visitors find and book Diani stays on their phones. We build fast, mobile-first sites that take direct bookings and payments, so you rely less on commission-based booking platforms.",
    ],
    nearby: ["Ukunda", "Galu", "Tiwi", "Msambweni"],
    industries: [
      { title: "Hotels and holiday villas", text: "Direct-booking websites with availability, deposits by M-Pesa or card, and booking confirmations by email and SMS." },
      { title: "Restaurants and beach bars", text: "Menus, table reservations and event pages that load quickly on mobile data." },
      { title: "Tours and watersports", text: "Trip listings, online booking and payment, and a simple dashboard to manage each day's bookings." },
    ],
    sections: [],
    services: ["web-development", "ecommerce-development", "mpesa-integration", "seo"],
    localProof: [],
    faqs: [
      {
        q: "Can guests pay a booking deposit by M-Pesa?",
        a: "Yes. We integrate M-Pesa STK Push so the guest gets a payment prompt on their phone, and the booking is confirmed automatically once the payment succeeds.",
      },
      {
        q: "Do you work with businesses in Diani from Mombasa?",
        a: "Yes. Our office is on Airport Road in Mombasa, and we work with clients outside Mombasa through calls, WhatsApp and regular online demos.",
      },
    ],
  },
  {
    slug: "kilifi",
    name: "Kilifi",
    county: "Kilifi County",
    ring: 2,
    published: false, // NEEDS: local proof + confirm site-visit offer
    seoTitle: "Web Development & IT Services in Kilifi",
    seoDescription:
      "Websites, school systems and M-Pesa integrated business software for organisations in Kilifi and Mtwapa, from Danamo Tech in Mombasa.",
    h1: "Web Development and Business Systems in Kilifi",
    intro: [
      "Danamo Tech builds websites, school management systems and M-Pesa integrated business software for organisations in Kilifi town, Mtwapa and across Kilifi County.",
    ],
    nearby: ["Mtwapa", "Takaungu", "Mnarani", "Bofa"],
    industries: [
      { title: "Schools", text: "School management with fee payments by M-Pesa, parent SMS receipts and CBC reporting, built on our ShuleHQ platform." },
      { title: "Hospitality", text: "Websites with direct booking and payments for hotels, guesthouses and restaurants." },
      { title: "Local businesses", text: "Business websites, online shops and point-of-sale systems with M-Pesa built in." },
    ],
    sections: [],
    services: ["web-development", "saas-development", "mpesa-integration", "it-consulting"],
    localProof: [],
    faqs: [],
  },
  {
    slug: "malindi",
    name: "Malindi",
    county: "Kilifi County",
    ring: 2,
    published: false, // NEEDS: local proof + confirm site-visit offer
    seoTitle: "Web Design & Booking Websites in Malindi",
    seoDescription:
      "Websites, direct-booking systems and M-Pesa payments for hotels, villas and businesses in Malindi and Watamu, from Danamo Tech.",
    h1: "Websites and Booking Systems for Malindi and Watamu",
    intro: [
      "Danamo Tech builds websites, direct-booking systems and M-Pesa integrations for hotels, villas, restaurants and local businesses in Malindi and Watamu.",
    ],
    nearby: ["Watamu", "Mambrui", "Gede"],
    industries: [
      { title: "Hotels, villas and resorts", text: "Direct-booking websites that take deposits by M-Pesa or card and confirm bookings automatically." },
      { title: "Local businesses", text: "Business websites, online shops and point-of-sale systems built for M-Pesa." },
    ],
    sections: [],
    services: ["web-development", "ecommerce-development", "mpesa-integration", "seo"],
    localProof: [],
    faqs: [],
  },
];

/** Fails the build if a published location breaks the publishing rules above. */
function assertPublishable(list: Location[]): void {
  const slugs = new Set<string>();
  for (const loc of list) {
    if (slugs.has(loc.slug)) throw new Error(`Duplicate location slug "${loc.slug}"`);
    slugs.add(loc.slug);
    if (loc.published && loc.localProof.length === 0) {
      throw new Error(
        `Location "${loc.slug}" is published without local proof. Add a real, approved localProof item or set published: false.`,
      );
    }
  }
}
assertPublishable(locations);

export const publishedLocations: Location[] = locations.filter((l) => l.published);

export function getPublishedLocation(slug: string): Location | undefined {
  return publishedLocations.find((l) => l.slug === slug);
}
