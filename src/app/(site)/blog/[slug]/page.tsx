import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { absoluteUrl, coverSrc, formatDate, getPublishedPost } from "@/lib/blog";
import { FOUNDER, SITE_NAME, SITE_URL } from "@/lib/site";
import ShareButtons from "./ShareButtons";
import MarkdownContent from "@/components/markdown/MarkdownContent";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = absoluteUrl(coverSrc(post));
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    // Facebook and LinkedIn build the share card from these tags.
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
      images: [{ url: image, alt: post.title }],
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(coverSrc(post))],
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author:
      post.author_name === FOUNDER.name
        ? { "@type": "Person", name: FOUNDER.name, jobTitle: [FOUNDER.role, ...FOUNDER.titles], url: `${SITE_URL}/team`, sameAs: FOUNDER.github }
        : { "@type": "Person", name: post.author_name },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` } },
    mainEntityOfPage: url,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative w-full h-[50vh] md:h-[65vh] flex items-end justify-center pb-16 px-4">
          <div className="absolute inset-0 z-0">
            <img src={coverSrc(post)} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
            {/* Darken only the lower part, where the text sits; the image stays vivid */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto w-full">
            <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-white hover:underline mb-6 [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" /> Back to all articles
            </Link>

            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-4" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag} className="flex items-center text-xs font-semibold text-white bg-blue-600 rounded-full px-3 py-1">
                    <Tag className="w-3 h-3 mr-1.5" aria-hidden="true" /> {tag}
                  </li>
                ))}
              </ul>
            )}

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white font-medium [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold" aria-hidden="true">
                  {post.author_name.charAt(0)}
                </div>
                <span>{post.author_name}</span>
              </div>
              {post.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" aria-hidden="true" /> {post.read_minutes} min read
              </div>
            </div>
          </div>
        </section>

        {/* ARTICLE */}
        <section className="py-16 px-4">
          <article className="max-w-3xl mx-auto">
            <div
              className="prose md:prose-lg dark:prose-invert prose-blue max-w-none
                         prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                         prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-relaxed
                         prose-li:text-gray-800 dark:prose-li:text-gray-200
                         prose-a:text-blue-700 dark:prose-a:text-blue-300 prose-img:rounded-xl
                         prose-code:before:content-none prose-code:after:content-none prose-code:font-medium
                         prose-code:text-[0.9em] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                         prose-code:bg-gray-100 prose-code:text-gray-900 dark:prose-code:bg-gray-800 dark:prose-code:text-gray-100
                         prose-th:text-left prose-table:text-sm md:prose-table:text-base"
            >
              <MarkdownContent>{post.content}</MarkdownContent>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Share this article</p>
              <ShareButtons url={url} title={post.title} />
            </div>

            <div className="mt-12 p-8 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl font-bold text-blue-700 dark:text-blue-300 shrink-0" aria-hidden="true">
                {post.author_name.charAt(0)}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.author_name}</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {post.author_name === FOUNDER.name
                    ? "Founder and CEO of Danamo Tech. Senior software developer and networking expert, building software products, platforms and network systems for businesses across Kenya and East Africa."
                    : `Writing for ${SITE_NAME}.`}
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Footer />
    </div>
  );
}
