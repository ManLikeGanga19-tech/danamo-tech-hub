import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ReactNode } from "react";
import AdminProviders from "@/components/admin/AdminProviders";
import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

// Root layout of the admin console. It is a separate root layout from the
// public site (src/app/(site)/layout.tsx): no shared providers, styles,
// analytics, SEO tags or theme storage.

const inter = localFont({
  src: "../fonts/inter-latin-var.woff2",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Danamo Admin", template: "%s | Danamo Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e15" },
  ],
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <AdminProviders>
          <AdminShell>{children}</AdminShell>
        </AdminProviders>
      </body>
    </html>
  );
}
