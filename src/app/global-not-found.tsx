import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./(site)/globals.css";

// Shown for URLs that match no route at all. The app has two root layouts
// ((site) and admin), so this page stands alone and links nowhere but "/" —
// which is the home page on the public host and the dashboard on the admin host.

const inter = localFont({
  src: "./fonts/inter-latin-var.woff2",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex items-center justify-center bg-white text-slate-900 px-4`}>
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">404</p>
          <h1 className="text-3xl font-bold mb-4">Page not found</h1>
          <p className="text-slate-500 mb-8 max-w-md">The page you are looking for does not exist.</p>
          <Link href="/" className="inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            Go to the start page
          </Link>
        </div>
      </body>
    </html>
  );
}
