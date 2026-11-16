import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, CalendarDays, Check, MapPin, Building2 } from "lucide-react";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { getOpenJob, paragraphs } from "@/lib/jobs";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import ApplyForm from "./ApplyForm";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getOpenJob(slug);
  if (!job) return { title: "Role not found", robots: { index: false } };

  return pageMetadata({
    title: `${job.title} Job (${job.employment_type}, ${job.location})`,
    description: `${job.summary} ${job.employment_type}, ${job.workplace.toLowerCase()} role in ${job.location}. Apply online.`.slice(0, 160),
    path: `/careers/${job.slug}`,
  });
}

const EMPLOYMENT_TYPE: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-gray-700 dark:text-gray-300 leading-relaxed">
            <Check className="w-5 h-5 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getOpenJob(slug);
  if (!job) notFound();
  const about = paragraphs(job.about);
  const list = (items: string[]) => `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;

  // Lets Google show the role in job search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [
      ...about.map((p) => `<p>${escapeHtml(p)}</p>`),
      `<p><strong>Responsibilities</strong></p>${list(job.responsibilities)}`,
      `<p><strong>Requirements</strong></p>${list(job.requirements)}`,
    ].join(""),
    ...(job.posted_at ? { datePosted: job.posted_at.slice(0, 10) } : {}),
    employmentType: EMPLOYMENT_TYPE[job.employment_type],
    hiringOrganization: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL, logo: `${SITE_URL}/logo.png` },
    ...(job.workplace === "Remote"
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Kenya" } }
      : {
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: "Mombasa", addressCountry: "KE" },
          },
        }),
    directApply: true,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* HEADER */}
        <section className="pt-32 pb-12 px-4 md:px-8 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto">
            <Link href="/careers#openings" className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" /> All open roles
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">{job.title}</h1>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="inline-flex items-center text-sm font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 rounded-full px-3 py-1">
                <Briefcase className="w-4 h-4 mr-1.5" aria-hidden="true" /> {job.employment_type}
              </span>
              <span className="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                <MapPin className="w-4 h-4 mr-1.5" aria-hidden="true" /> {job.location}
              </span>
              <span className="inline-flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
                <Building2 className="w-4 h-4 mr-1.5" aria-hidden="true" /> {job.workplace}
              </span>
            </div>
            <a href="#apply" className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-8 py-3 shadow-lg shadow-blue-600/20 transition-colors">
              Apply for this Role
            </a>
          </div>
        </section>

        {/* DETAILS */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
          <article>
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the role</h2>
              {about.map((p) => (
                <p key={p} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{p}</p>
              ))}
            </section>
            <Section title="What you'll do" items={job.responsibilities} />
            <Section title="What we're looking for" items={job.requirements} />
            <Section title="Nice to have" items={job.nice_to_have} />
            <Section title="What we offer" items={job.offer} />

            <section className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to apply</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Fill in the form below with your details, a cover letter and your CV. You&apos;ll get an email confirming we
                received your application, and we&apos;ll contact shortlisted candidates for an interview.
              </p>
            </section>
          </article>

          {/* SUMMARY */}
          <aside className="lg:sticky lg:top-28 h-fit p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Role summary</h2>
            <dl className="space-y-3 text-sm mb-6">
              <div className="flex justify-between gap-4"><dt className="text-gray-600 dark:text-gray-300">Employment</dt><dd className="font-semibold text-gray-900 dark:text-white">{job.employment_type}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-gray-600 dark:text-gray-300">Location</dt><dd className="font-semibold text-gray-900 dark:text-white text-right">{job.location}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-gray-600 dark:text-gray-300">Workplace</dt><dd className="font-semibold text-gray-900 dark:text-white">{job.workplace}</dd></div>
              {job.posted_at && (
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-600 dark:text-gray-300 inline-flex items-center"><CalendarDays className="w-4 h-4 mr-1.5" aria-hidden="true" />Posted</dt>
                  <dd className="font-semibold text-gray-900 dark:text-white">{formatDate(job.posted_at)}</dd>
                </div>
              )}
            </dl>
            <a href="#apply" className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 transition-colors">
              Apply for this Role
            </a>
          </aside>
        </div>

        {/* APPLICATION FORM */}
        <section id="apply" className="scroll-mt-24 py-20 px-4 md:px-8 bg-gray-50 dark:bg-[#0e0e15] border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Apply for this Role</h2>
              <p className="text-gray-700 dark:text-gray-300">{job.title} · {job.employment_type} · {job.location}</p>
            </div>
            <div className="p-6 md:p-10 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
              <ApplyForm roleTitle={job.title} jobSlug={job.slug} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
