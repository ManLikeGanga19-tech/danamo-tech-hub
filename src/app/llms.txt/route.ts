import { getProjects } from "@/lib/projects";
import { getOpenJobs } from "@/lib/jobs";
import { CONTACT_EMAIL, FOUNDER, FOUNDING_YEAR, OWN_PRODUCTS, SITE_URL, SOCIAL_LINKS } from "@/lib/site";
import { services } from "@/lib/services";
import { publishedLocations } from "@/lib/locations";

// Plain-text company summary for AI assistants and LLM crawlers (llmstxt.org).
// Facts only: everything here must be true and match the website.
export const revalidate = 3600;

export async function GET() {
  const [projects, jobs] = await Promise.all([getProjects(), getOpenJobs()]);

  const caseStudies = projects.length
    ? projects.map((p) => `- [${p.title}](${SITE_URL}/projects/${p.slug}): ${p.description}`).join("\n")
    : "- See " + SITE_URL + "/projects";
  const areas = ["Mombasa (head office, Airport Road)", ...publishedLocations.map((l) => `[${l.name}, ${l.county}](${SITE_URL}/locations/${l.slug})`)]
    .map((a) => `- ${a}`)
    .join("\n");
  const ownProducts = OWN_PRODUCTS.map((p) => `- ${p.url ? `[${p.name}](${p.url})` : p.name}: ${p.summary}`).join("\n");
  const serviceList = services.map((s) => `- [${s.name}](${SITE_URL}/services/${s.slug}): ${s.summary}`).join("\n");
  const roles = jobs.length
    ? jobs.map((j) => `- [${j.title}](${SITE_URL}/careers/${j.slug}): ${j.employment_type}, ${j.location}`).join("\n")
    : "- No open roles at the moment. See " + SITE_URL + "/careers";

  const body = `# Danamo Tech

> Danamo Tech (Danamo Tech Ltd) is a software development company based on Airport Road, Mombasa, Kenya. It builds custom websites, web and mobile applications, SaaS products and business systems with M-Pesa integration for businesses, startups and schools in Kenya and East Africa.

## Key facts

- Legal name: Danamo Tech Ltd, registered in Kenya
- Founded: ${FOUNDING_YEAR}, in Mombasa
- Main business: custom software development for clients. Danamo also builds and runs its own products (listed below); each is one product of the company, not the company itself.
- Location: Airport Road, Mombasa, Kenya; serves clients across Kenya and East Africa, and remotely
- Founder and CEO: ${FOUNDER.name}, ${FOUNDER.titles.join(" and ").toLowerCase()} (${FOUNDER.github})
- Contact: ${CONTACT_EMAIL}, ${SITE_URL}/services (project inquiry form)
- Website: ${SITE_URL}
- Official profiles: ${Object.values(SOCIAL_LINKS).filter(Boolean).join(", ")}

## Founder

${FOUNDER.name} is the founder and CEO of Danamo Tech, and a senior software developer and networking expert. ${FOUNDER.name} builds Danamo's own products, including ShuleHQ and the WIFI.OS ISP billing and network management platform (MikroTik RouterOS provisioning over WireGuard, hotspot and PPPoE), works with MikroTik, Cisco and Ubiquiti equipment and RADIUS authentication, and leads engineering on client work across Kenya and East Africa.

- Expertise: ${FOUNDER.knowsAbout.join(", ")}
- Profile: ${SITE_URL}/team
- GitHub: ${FOUNDER.github}

## Services

${serviceList}

## Areas served

${areas}

## Own products

${ownProducts}

## Case studies

${caseStudies}

## Careers

${roles}

## Pages

- [Services](${SITE_URL}/services)
- [Case studies](${SITE_URL}/projects)
- [About](${SITE_URL}/about)
- [Team](${SITE_URL}/team)
- [FAQs](${SITE_URL}/faqs)
- [Blog](${SITE_URL}/blog)
- [Webinars](${SITE_URL}/webinars)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
