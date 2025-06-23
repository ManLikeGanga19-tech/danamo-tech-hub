import { NextResponse, NextRequest } from "next/server";
import { Account } from "appwrite";
import { appwriteClient } from "@/lib/appwriteServices";

const account = new Account(appwriteClient);

export async function GET(_request: NextRequest) {
    try {
        // Verify session
        const user = await account.get();
        console.log("Appwrite OAuth callback: User logged in", { id: user.$id, email: user.email });

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
        if (!baseUrl) {
            console.error("NEXT_PUBLIC_APP_URL is not defined");
            return new NextResponse("Server configuration error", { status: 500 });
        }

        return NextResponse.redirect(new URL("/", baseUrl));
    } catch (error: unknown) {
        console.error("Appwrite OAuth callback error:", error);

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        let redirectUrl = "/login?error=oauth_failed";

        if (error instanceof Error && "code" in error && "type" in error) {
            if (error.code === 401 && error.type === "general_unauthorized_scope") {
                console.log("No session found, redirecting to login...");
                redirectUrl = "/login?error=session_failed";
            }
        }

        try {
            return NextResponse.redirect(new URL(redirectUrl, baseUrl));
        } catch (urlError) {
            console.error("Redirect URL error:", urlError);
            return new NextResponse("Invalid redirect URL", { status: 500 });
        }
    }
}