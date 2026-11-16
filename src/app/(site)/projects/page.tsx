import ProjectsClient from "./ProjectsClient";
import { getProjects } from "@/lib/projects";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Our Work: Software Case Studies from Kenya",
  description:
    "Case studies of software Danamo Tech has built in Kenya: school management (ShuleHQ), ISP billing (WIFI.OS), point of sale (VendaPOS), e-commerce and more.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Danamo Tech case studies",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/projects/${p.slug}`,
      name: p.title,
    })),
  };
  return (
    <>
      <ProjectsClient projects={projects} />
      {projects.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemList) }} />
      )}
    </>
  );
}
