import type { ReactNode } from "react";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { faqs } from "./data";

export const metadata = pageMetadata({
  title: "FAQs: Working With a Software Company",
  description:
    "Answers about working with Danamo Tech: what we build, pricing, timelines, our development process, support after launch and working with clients outside Mombasa.",
  path: "/faqs",
});

// Lets Google show these questions as an FAQ rich result.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }} />
    </>
  );
}
