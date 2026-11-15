import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import CookieConsent from "@/components/consent/CookieConsent";
import GoogleAnalytics from "@/components/consent/GoogleAnalytics";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import localFont from "next/font/local";

// Inter (variable, latin subset), self-hosted so builds never depend on
// fonts.googleapis.com. License: SIL Open Font License 1.1.
const inter = localFont({
  src: "../fonts/inter-latin-var.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

const SITE_DESCRIPTION =
  "Explore cutting-edge tutorials, opinions, and innovations from Danamo's team of developers, designers, and engineers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Danamo - Tech Insights & Innovation",
    template: "%s | Danamo",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "web development",
    "software engineering",
    "technology blog",
    "AI and machine learning",
    "JavaScript tutorials",
    "TypeScript",
    "React",
    "Next.js",
    "UX design",
    "tech innovation",
    "programming tutorials",
  ],
  authors: [{ name: "Danamo Team" }],
  creator: "Danamo",
  publisher: "Danamo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Danamo - Tech Insights & Innovation",
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Danamo - Tech Insights & Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danamo - Tech Insights & Innovation",
    description: SITE_DESCRIPTION,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google4c249a539a678fdd.html",
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    contactType: "Customer Service",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta
          name="google-site-verification"
          content="8qSi6rQ_CKWZRfvonMwGlEV0ZdTwDupn4FTocPbFufw"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.className} min-h-screen antialiased bg-white text-black dark:bg-black dark:text-white`}
      >
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
          >
            Skip to main content
          </a>
          <main id="main-content">{children}</main>
          <CookieConsent />
          <GoogleAnalytics />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </body>
    </html>
  );
}