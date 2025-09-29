'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import WelcomeCard from '@/components/WelcomePopover';

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                {/* Show WelcomeCard globally and conditionally */}
                <WelcomeCard />

                {children}

                <Toaster richColors position='top-center' />
            </ThemeProvider>
        </SessionProvider>
    );
}