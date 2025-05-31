import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin only once
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Firebase Admin initialization failed:', error);
        throw error;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log('Middleware triggered for path:', pathname);

    // Define protected routes
    const protectedRoutes = ['/careers', '/webinars', '/blog'];

    // Check if the request is for a protected route
    if (protectedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        console.log('Protected route detected:', pathname);

        // Get the Firebase ID token from cookies
        const idToken = request.cookies.get('idToken')?.value;
        console.log('ID Token found:', idToken ? 'Yes' : 'No', 'Token:', idToken);

        if (!idToken) {
            console.log('No token found, redirecting to /login');
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        try {
            // Verify the token with Firebase Admin
            const auth = getAuth();
            const decodedToken = await auth.verifyIdToken(idToken);
            console.log('Token verified for user:', decodedToken.uid);
            // Token is valid, allow the request to proceed
            return NextResponse.next();
        } catch (error) {
            console.error('Token verification failed:', error);
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    console.log('Non-protected route, proceeding:', pathname);
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/careers/:path*',
        '/webinars/:path*',
        '/blog/:path*',
        '/careers',
        '/webinars',
        '/blog',
    ],
};