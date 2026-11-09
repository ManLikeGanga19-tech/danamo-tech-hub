'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth/AuthContext';
import WelcomeCard from '@/components/WelcomePopover';

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <WelcomeCard />
                {children}
                <Toaster richColors position='top-center' />
            </ThemeProvider>
        </AuthProvider>
    );
}