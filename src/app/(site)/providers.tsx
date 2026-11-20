'use client';

import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/lib/auth/AuthContext';
import WelcomeCard from '@/components/WelcomePopover';
import MotionProvider from '@/components/motion/MotionProvider';

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <AuthProvider>
            <MotionProvider>
                {/* Light theme only: there is deliberately no theme provider, so the
                    "dark" class is never set and dark: styles never apply, even when
                    the device prefers dark mode. */}
                <WelcomeCard />
                {children}
                <Toaster richColors position='top-center' />
            </MotionProvider>
        </AuthProvider>
    );
}