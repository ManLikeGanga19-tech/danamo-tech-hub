"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwriteServices";
import { AppwriteException } from "appwrite";

interface Props {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            console.log("ProtectedRoute: Checking authentication");
            try {
                await account.get();
                console.log("ProtectedRoute: User authenticated");
                setIsAuthenticated(true);
            } catch (error: unknown) { // Use 'unknown' to fix ts(1196)
                let errorMessage = "Unknown error";
                let errorCode: number | undefined;
                let errorType: string | undefined;

                if (error instanceof AppwriteException) {
                    errorMessage = error.message;
                    errorCode = error.code;
                    errorType = error.type;
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }

                console.error("ProtectedRoute auth error:", {
                    message: errorMessage,
                    code: errorCode,
                    type: errorType,
                    stack: error instanceof Error ? error.stack : undefined,
                });
                setIsAuthenticated(false);
                const redirectUrl = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
                console.log(`ProtectedRoute: Redirecting to ${redirectUrl}`);
                router.push(redirectUrl);
            }
        };
        checkAuth();
    }, [router]);

    if (isAuthenticated === null) {
        console.log("ProtectedRoute: Loading authentication state");
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
                <div className="relative flex items-center justify-center">
                    <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <div className="h-12 w-12 animate-pulse rounded-full bg-blue-600/20"></div>
                </div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;