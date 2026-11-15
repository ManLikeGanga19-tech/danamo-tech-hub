import { Metadata } from "next";
import AboutClient from "./AboutClient";
import { SITE_URL, SOCIAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us | Danamo Tech",
  description: "Learn about Danamo Tech, a premier technology consultancy in Mombasa empowering startups and SMEs with enterprise-grade digital solutions.",
  openGraph: {
    title: "About Danamo Tech",
    description: "Empowering startups and SMEs with enterprise-grade digital solutions.",
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/about-bg.jpg` }],
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Danamo Tech',
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            sameAs: Object.values(SOCIAL_LINKS).filter(Boolean),
            description: 'Danamo Tech empowers startups and SMEs in Mombasa with affordable and innovative digital solutions.',
          }),
        }}
      />
      <AboutClient />
    </>
  );
}