import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ExternalLink, Tag, User, Building2 } from "lucide-react";
import { getProject } from "@/lib/projects";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

function absolute(url: string): string {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return pageMetadata({
    title: `${project.title} Case Study`,
    description: project.description.slice(0, 160),
    path: `/projects/${project.slug}`,
    image: absolute(project.image_url),
    imageAlt: project.title,
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const url = `${SITE_URL}/projects/${project.slug}`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      headline: project.title,
      description: project.description,
      url,
      image: absolute(project.image_url),
      genre: project.category,
      creator: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: SITE_NAME },
      ...(project.created_at ? { dateCreated: project.created_at } : {}),
      ...(project.technologies?.length ? { keywords: project.technologies.join(", ") } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Our Work", item: `${SITE_URL}/projects` },
        { "@type": "ListItem", position: 3, name: project.title, item: url },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative w-full h-[55vh] md:h-[65vh] flex items-end justify-center pb-16 px-4">
          <div className="absolute inset-0 z-0 bg-gray-900">
            <img
              src={project.image_url}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="hero-shade absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto w-full">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm font-medium text-gray-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all projects
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 backdrop-blur-md rounded-full px-3 py-1">
                <Tag className="w-3 h-3" />
                {project.category}
              </span>
              {project.featured && (
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white bg-blue-600 rounded-full px-3 py-1">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              {project.title}
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl">
              {project.description}
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto w-full">
          {/* Client Info Cards */}
          {(project.client_name || project.client_industry) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {project.client_name && (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Client
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {project.client_name}
                  </p>
                </div>
              )}
              {project.client_industry && (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Industry
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {project.client_industry}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <div dangerouslySetInnerHTML={{ __html: project.content }} />
          </article>

          {/* Live URL CTA */}
          {project.live_url && (
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-2">See it in action</h3>
              <p className="text-blue-100 mb-6">
                Visit the live project to explore the final result.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 transition-colors rounded-xl group"
              >
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Visit Live Project
                  <ExternalLink className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
            </div>
          )}

          {/* Back CTA */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Want a similar result for your business?
            </p>
            <div className="flex gap-3">
              <Button
                asChild
                variant="outline"
                className="border-gray-300 dark:border-gray-700 rounded-xl"
              >
                <Link href="/projects" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  All Projects
                </Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl group"
              >
                <Link href="/#contact" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}