'use client';

import { ReactNode, useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // On mount, check user preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <html lang="en" className={theme}>
      <body>
        <header className="p-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue">Danamo Tech Hub</h1>
          <ThemeToggle />

        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
