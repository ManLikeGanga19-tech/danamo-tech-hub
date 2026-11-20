import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronRight, MapPin } from "lucide-react";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { ContentSection } from "@/components/services/ContentSection";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { getPublishedLocation, publishedLocations } from "@/lib/locations";
import { caseStudies, getService } from "@/lib/services";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Only published locations exist; drafts and unknown towns are 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedLocations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loc = getPublishedLocation(slug);
  if (!loc) return { title: "Page not found", robots: { index: false } };
  return pageMetadata({
    title: `${loc.seoTitle} | ${SITE_NAME}`,
    absoluteTitle: true,
    description: loc.seoDescription,
    path: `/locations/${loc.slug}`,
  });
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const loc = getPublishedLocation(slug);
  if (!loc) notFound();

  const url = `${SITE_URL}/locations/${loc.slug}`;
  const services = loc.services.map(getService).filter((s) => s !== undefined);
  const city = {
    "@type": "City",
    name: loc.name,
    containedInPlace: { "@type": "AdministrativeArea", name: loc.county, containedInPlace: { "@type": "Country", name: "Kenya" } },
  };

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Software and web development in ${loc.name}`,
      serviceType: "Software development",
      description: loc.seoDescription,
      url,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: [city, ...loc.nearby.map((name) => ({ "@type": "Place", name }))],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Services in ${loc.name}`,
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.name, url: `${SITE_URL}/services/${s.slug}` },
        })),
      },
    },
    ...(loc.faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loc.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: loc.name, item: url },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        <section className="pt-32 pb-16 px-4 md:px-8 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
                <li aria-current="page" className="font-medium text-gray-900 dark:text-white">{loc.name}</li>
              </ol>
            </nav>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {loc.name}, {loc.county}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 max-w-4xl">{loc.h1}</h1>
            {loc.intro.map((p) => (
              <p key={p} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 max-w-3xl">{p}</p>
            ))}
            {loc.nearby.length > 0 && (
              <p className="text-gray-600 dark:text-gray-300 mb-6">Also serving {loc.nearby.join(", ")}.</p>
            )}
            <Link
              href="/services"
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-7 py-3 shadow-lg shadow-blue-600/20 transition-colors group"
            >
              Tell us about your project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
          <ContentSection section={{ heading: `What we build for ${loc.name} businesses`, features: loc.industries }} />

          {loc.sections.map((section) => (
            <ContentSection key={section.heading} section={section} />
          ))}

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Our work in {loc.name}</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {loc.localProof.map(({ caseStudy, note }) => {
                const cs = caseStudy ? caseStudies[caseStudy] : undefined;
                return (
                  <li key={note} className="p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{note}</p>
                    {cs && (
                      <Link href={`/projects/${cs.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300 hover:underline">
                        Read the {cs.title} case study <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          {services.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Services in {loc.name}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <ServiceIcon icon={s.icon} />
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{s.name}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow">{s.summary}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {loc.faqs.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently asked questions</h2>
              <div className="space-y-3">
                {loc.faqs.map((f) => (
                  <details key={f.q} className="group rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-semibold text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl">
                      <h3 className="text-base">{f.q}</h3>
                      <ChevronDown className="w-5 h-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-5 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
