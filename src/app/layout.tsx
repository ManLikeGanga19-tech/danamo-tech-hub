'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Navbar1 } from '@/components/navbar/Navbar';
import {SpeedInsights} from "@vercel/speed-insights/next";
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-white text-black dark:bg-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar1 />
          <main>{children}</main>
        </ThemeProvider>
        <SpeedInsights/>
      </body>
    </html>
  );
}


