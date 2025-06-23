'use client';
import type { Metadata } from "next";
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import WelcomeCard from '@/components/WelcomePopover';
import './globals.css';

export const metadata: Metadata = {
  title: "Danamo-Tech",
  description: "Company head-quartered in Nairobi, Kenya. Founded in 2024, the company was established to bridge the technology gap faced by small business and startups in need of affordable digital solutions.",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-white text-black dark:bg-black dark:text-white">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {/* Show WelcomeCard globally and conditionally */}
            <WelcomeCard />
            <main>{children} <Toaster richColors position='top-center' /></main>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}


