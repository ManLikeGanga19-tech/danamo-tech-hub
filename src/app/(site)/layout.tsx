import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import CookieConsent from "@/components/consent/CookieConsent";
import GoogleAnalytics from "@/components/consent/GoogleAnalytics";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { DEFAULT_DESCRIPTION, OG_IMAGE, jsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Danamo Tech | Software Development Company in Mombasa, Kenya",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Daniel Oganga", url: "https://github.com/ManLikeGanga19-tech" }],
  creator: SITE_NAME,
  publisher: "Danamo Tech Ltd",
  formatDetection: { email: false, address: false, telephone: false },
  // Pages without their own metadata still get correct share tags. Every
  // page sets its own canonical URL (see lib/seo.ts) — there is deliberately
  // no site-wide canonical here, which would mark every page a duplicate of "/".
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: SITE_NAME,
    title: "Danamo Tech | Software Development Company in Mombasa, Kenya",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Danamo Tech — software development in Mombasa, Kenya" }],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: "8qSi6rQ_CKWZRfvonMwGlEV0ZdTwDupn4FTocPbFufw",
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

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
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
          <div id="main-content">{children}</div>
          <CookieConsent />
          <GoogleAnalytics />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([organizationJsonLd, websiteJsonLd]) }} />
      </body>
    </html>
  );
}