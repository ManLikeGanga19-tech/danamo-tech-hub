import { getProjects } from "@/lib/projects";
import { getOpenJobs } from "@/lib/jobs";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";
import { services } from "@/lib/services";

// Plain-text company summary for AI assistants and LLM crawlers (llmstxt.org).
// Facts only: everything here must be true and match the website.
export const revalidate = 3600;

export async function GET() {
  const [projects, jobs] = await Promise.all([getProjects(), getOpenJobs()]);

  const caseStudies = projects.length
    ? projects.map((p) => `- [${p.title}](${SITE_URL}/projects/${p.slug}): ${p.description}`).join("\n")
    : "- See " + SITE_URL + "/projects";
  const serviceList = services.map((s) => `- [${s.name}](${SITE_URL}/services/${s.slug}): ${s.summary}`).join("\n");
  const roles = jobs.length
    ? jobs.map((j) => `- [${j.title}](${SITE_URL}/careers/${j.slug}): ${j.employment_type}, ${j.location}`).join("\n")
    : "- No open roles at the moment. See " + SITE_URL + "/careers";

  const body = `# Danamo Tech

> Danamo Tech (Danamo Tech Ltd) is a software development company based on Airport Road, Mombasa, Kenya. It builds custom websites, web and mobile applications, SaaS products and business systems with M-Pesa integration for businesses, startups and schools in Kenya and East Africa.

## Key facts

- Legal name: Danamo Tech Ltd, registered in Kenya
- Location: Airport Road, Mombasa, Kenya; serves clients across Kenya and East Africa, and remotely
- Founder and CEO: Daniel Oganga (https://github.com/ManLikeGanga19-tech)
- Contact: ${CONTACT_EMAIL}, ${SITE_URL}/services (project inquiry form)
- Website: ${SITE_URL}

## Services

${serviceList}

## Own products

- ShuleHQ: school management SaaS for Kenyan schools
- WIFI.OS: ISP and Wi-Fi hotspot billing and network management with M-Pesa
- VendaPOS: point of sale software for businesses
- Tusome: CBC e-learning platform

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
