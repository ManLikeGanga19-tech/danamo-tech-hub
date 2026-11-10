"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { FileText, Shield, Cookie, Scale, Accessibility, ArrowRight } from "lucide-react";

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy", icon: Shield },
  { name: "Cookies Policy", href: "/cookies", icon: Cookie },
  { name: "Terms & Conditions", href: "/terms", icon: Scale },
  { name: "Accessibility", href: "/accessibility", icon: Accessibility },
];

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  children: ReactNode;
}

export default function LegalLayout({ title, subtitle, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* Header */}
        <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-[#0e0e15] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-cyan-300 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-4">{subtitle}</p>
            <p className="text-sm text-blue-200">Last updated: {lastUpdated}</p>
          </div>
        </section>

        <div className="max-w-[85rem] mx-auto px-4 md:px-8 py-16">
          <div className="grid lg:grid-cols-[260px_1fr] gap-12">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  Legal Documents
                </h3>
                <nav className="space-y-1">
                  {legalLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Questions about our legal policies?{" "}
                    <a href="/#contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      Contact us <ArrowRight className="inline w-3 h-3" />
                    </a>
                  </p>
                </div>
              </div>
            </aside>

            {/* Content */}
            <article className="prose prose-lg dark:prose-invert prose-blue max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-table:text-sm">
              {children}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}