import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Validate environment variables
const requiredEnvVars = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

// Log missing environment variables for debugging
const missingVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(", ")}`);
    throw new Error(
        `The following environment variables are missing: ${missingVars.join(", ")}. Please set them in your environment configuration (e.g., Vercel dashboard or .env file).`
    );
}

// Initialize Firebase Admin SDK
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID!,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
                privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
            }),
        });
        console.log("Firebase Admin SDK initialized successfully");
    } catch (error) {
        console.error("Firebase Admin SDK initialization failed:", error);
        throw new Error(`Failed to initialize Firebase Admin SDK: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export const adminAuth = getAuth();
export const verifyIdToken = (token: string) => adminAuth.verifyIdToken(token);