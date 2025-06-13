"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwriteServices";

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
            } catch (error: any) {
                console.error("ProtectedRoute auth error:", {
                    message: error.message,
                    code: error.code,
                    type: error.type,
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
        return <div className="flex justify-center py-10">Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;