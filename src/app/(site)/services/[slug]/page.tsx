import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronDown, ChevronRight } from "lucide-react";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { ContentSection } from "@/components/services/ContentSection";
import { caseStudies, getService, services } from "@/lib/services";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { publishedLocations } from "@/lib/locations";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service not found", robots: { index: false } };
  // Absolute title: the /services layout sets a plain title, which stops the
  // site-wide "%s | Danamo Tech" template reaching pages below it.
  return pageMetadata({
    title: `${service.seoTitle} | ${SITE_NAME}`,
    absoluteTitle: true,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const url = `${SITE_URL}/services/${service.slug}`;
  const inquiryHref = `/services?service=${encodeURIComponent(service.value)}`;
  const related = service.related.map(getService).filter((s) => s !== undefined);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      serviceType: service.name,
      description: service.seoDescription,
      url,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: [
        { "@type": "City", name: "Mombasa" },
        ...publishedLocations.map((l) => ({ "@type": "City", name: l.name, url: `${SITE_URL}/locations/${l.slug}` })),
        { "@type": "Country", name: "Kenya" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        { "@type": "ListItem", position: 3, name: service.name, item: url },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* HEADER */}
        <section className="pt-32 pb-16 px-4 md:px-8 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <li><Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
                <li><Link href="/services" className="hover:text-blue-600 dark:hover:text-blue-400">Services</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-4 h-4" /></li>
                <li aria-current="page" className="font-medium text-gray-900 dark:text-white">{service.name}</li>
              </ol>
            </nav>
            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center mb-6">
              <ServiceIcon icon={service.icon} className="h-7 w-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 max-w-4xl">{service.h1}</h1>
            {service.intro.map((p) => (
              <p key={p} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4 max-w-3xl">{p}</p>
            ))}
            <Link
              href={inquiryHref}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-7 py-3 shadow-lg shadow-blue-600/20 transition-colors group"
            >
              Tell us about your project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-16">
          {service.sections.map((section) => (
            <ContentSection key={section.heading} section={section} />
          ))}

          {/* PROOF */}
          {service.proof.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Where we have done this</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.proof.map(({ key, note }) => {
                  const cs = caseStudies[key];
                  return (
                    <Link
                      key={key}
                      href={`/projects/${cs.slug}`}
                      className="group flex flex-col p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-2">
                        {cs.ownProduct ? "Danamo Tech product" : "Client project"}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cs.title}</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-grow mb-4">{note}</p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                        Read the case study
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* PRICING */}
          <section className="mb-16 p-8 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">What affects the price</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Every project is quoted for its own scope, so you only pay for what you need. The main factors are:</p>
            <ul className="space-y-2 mb-6">
              {service.pricing.map((item) => (
                <li key={item} className="flex gap-3 text-gray-800 dark:text-gray-200">
                  <Check className="w-5 h-5 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href={inquiryHref} className="inline-flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300 hover:underline">
              Ask for a quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently asked questions</h2>
            <div className="space-y-3">
              {service.faqs.map((f) => (
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

          {/* RELATED */}
          {related.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">Related services</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/services/${r.slug}`}
                    className="group flex flex-col gap-3 p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <ServiceIcon icon={r.icon} />
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{r.name}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-grow">{r.summary}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                      Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* CTA */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-700 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to talk about your project?</h2>
            <p className="text-lg text-blue-100 mb-8">Tell us what you need. We&apos;ll reply with a clear plan, timeline and quote.</p>
            <Link href={inquiryHref} className="inline-flex items-center gap-2 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-4 shadow-lg transition-colors group">
              Start your {service.name.toLowerCase()} inquiry
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </div>
  );
}
