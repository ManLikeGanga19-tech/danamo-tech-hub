import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Validate environment variables
const requiredEnvVars = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
        throw new Error(`${key} environment variable is missing. Please set it in your environment configuration.`);
    }
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
    } catch (error) {
        throw new Error(`Failed to initialize Firebase Admin SDK: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

export const adminAuth = getAuth();
export const verifyIdToken = (token: string) => adminAuth.verifyIdToken(token);