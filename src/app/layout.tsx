import { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import Providers from "@/app/providers";
import "./globals.css";
import { Inter } from "next/font/google";

// Use next/font for performance (no layout shift)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL("https://www.danamo-tech.co.ke/"),
  title: {
    default: "Danamo - Tech Insights & Innovation",
    template: "%s | Danamo",
  },
  description:
    "Explore cutting-edge tutorials, opinions, and innovations from Danamo's team of developers, designers, and engineers.",
  keywords: [
    "web development",
    "technology",
    "AI",
    "JavaScript",
    "UX design",
    "tutorials",
    "tech blog",
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
    url: "https://www.danamo-tech.co.ke/",
    title: "Danamo - Tech Insights & Innovation",
    description:
      "Explore cutting-edge tutorials, opinions, and innovations from our team of developers, designers, and engineers.",
    siteName: "Danamo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Danamo - Tech Insights & Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Danamo - Tech Insights & Innovation",
    description:
      "Explore cutting-edge tutorials, opinions, and innovations from our team of developers, designers, and engineers.",
    images: ["/og-image.jpg"],
    creator: "@yourtwitterhandle",
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
    canonical: "https://www.danamo-tech.co.ke/",
  },
  category: "technology",
};

// Viewport Configuration
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="8qSi6rQ_CKWZRfvonMwGlEV0ZdTwDupn4FTocPbFufw"
        />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${inter.className} min-h-screen antialiased bg-white text-black dark:bg-black dark:text-white`}
      >
        <Providers>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
          >
            Skip to main content
          </a>

          <main id="main-content">{children}</main>
        </Providers>

        <SpeedInsights />
        <Analytics />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Danamo",
              url: "https://www.danamo-tech.co.ke/",
              logo: "https://www.danamo-tech.co.ke/logo.png",
              description:
                "Tech insights and innovation from developers, designers, and engineers.",
              sameAs: [
                "https://twitter.com/yourhandle",
                "https://linkedin.com/company/yourcompany",
                "https://github.com/yourorg",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@yourdomain.com",
                contactType: "Customer Service",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
