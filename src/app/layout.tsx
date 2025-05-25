'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Navbar1 } from '@/components/navbar/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-white text-black dark:bg-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar1 />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}


{/* Logo */}
                    // <div className="flex-shrink-0 flex items-center">
                    //     <Link href="/" aria-label="Danamo Tech Logo">
                    //         <Logo className="h-10 w-auto text-secondary-light dark:text-secondary-dark" />
                    //     </Link>
                    // </div>