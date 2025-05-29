'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from 'next-auth/react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-white text-black dark:bg-black dark:text-white">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <main>{children}</main>
          </ThemeProvider>
          <SpeedInsights />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}


