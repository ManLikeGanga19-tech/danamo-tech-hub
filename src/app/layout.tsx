'use client';

import { ReactNode } from 'react';
import {Navbar1} from '@/components/navbar/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased bg-white text-black dark:bg-black dark:text-white">
        <div className="layout">
          <Navbar1 />
          <main className="pt-20">{children}</main>
        </div>
      </body>
    </html>
  );
}
